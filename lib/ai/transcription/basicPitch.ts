import { createMidiBlob } from './midi'
import { normalizeNoteEvents, summarizeNoteEvents } from './noteParser'
import type { TranscriptionResult } from '@/types/transcription'

// Version-pinned package asset; Basic Pitch resolves model weights relative to this URL.
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@spotify/basic-pitch@1.0.1/model/model.json'

export async function transcribeWithBasicPitch({
  audio,
  onProgress,
  onModelLoading,
}: {
  audio: ArrayBuffer
  onProgress?: (percentage: number) => void
  onModelLoading?: () => void
}): Promise<Omit<TranscriptionResult, 'midiPath' | 'noteEventsPath'> & { midi: Blob }> {
  if (typeof window === 'undefined') throw new Error('Basic Pitch requires a browser audio context.')

  const audioContext = new AudioContext()
  try {
    let audioBuffer: AudioBuffer
    try {
      audioBuffer = await audioContext.decodeAudioData(audio.slice(0))
    } catch {
      throw new Error('We could not decode this audio file. Try another supported audio format.')
    }

    const resampledBuffer = await resampleToBasicPitchRate(audioBuffer, audioContext)
    onModelLoading?.()
    const { BasicPitch, addPitchBendsToNoteEvents, noteFramesToTime, outputToNotesPoly } = await import('@spotify/basic-pitch')
    const { testables } = await import('@spotify/basic-pitch/esm/toMidi')
    const frames: number[][] = []
    const onsets: number[][] = []
    const contours: number[][] = []
    const basicPitch = new BasicPitch(MODEL_URL)

    await basicPitch.evaluateModel(
      resampledBuffer,
      (nextFrames, nextOnsets, nextContours) => {
        frames.push(...nextFrames)
        onsets.push(...nextOnsets)
        contours.push(...nextContours)
      },
      (percentage) => onProgress?.(Math.round(percentage * 100)),
    )

    const notes = normalizeNoteEvents(
      noteFramesToTime(addPitchBendsToNoteEvents(contours, outputToNotesPoly(frames, onsets, 0.25, 0.25, 5))),
    )
    ensureMidiBufferShim()
    const midiBytes = new Uint8Array(testables.generateFileData(notes.map((note) => ({
      startTimeSeconds: note.startTimeSeconds,
      durationSeconds: note.durationSeconds,
      pitchMidi: note.pitchMidi,
      amplitude: note.confidence,
      pitchBends: note.pitchBends,
    }))))

    return { midi: createMidiBlob(midiBytes), notes, summary: summarizeNoteEvents(notes) }
  } finally {
    await audioContext.close()
  }
}

export function transcriptionStoragePaths(userId: string, songId: string) {
  const prefix = `${userId}/transcriptions/${songId}`
  return { midiPath: `${prefix}.mid`, noteEventsPath: `${prefix}.notes.json` }
}

/**
 * Basic Pitch requires 22,050 Hz mono samples. Render every source channel at
 * that rate first, then average the rendered channels so stereo recordings are
 * down-mixed without silently discarding either side.
 */
export async function resampleToBasicPitchRate(audioBuffer: AudioBuffer, audioContext: BaseAudioContext) {
  const targetSampleRate = 22_050
  const OfflineContext = window.OfflineAudioContext
    ?? (window as typeof window & { webkitOfflineAudioContext?: typeof OfflineAudioContext }).webkitOfflineAudioContext

  if (!OfflineContext) throw new Error('Your browser does not support offline audio processing.')

  const frameCount = Math.max(1, Math.ceil(audioBuffer.duration * targetSampleRate))
  const offlineContext = new OfflineContext(audioBuffer.numberOfChannels, frameCount, targetSampleRate)
  const source = offlineContext.createBufferSource()
  source.buffer = audioBuffer
  source.connect(offlineContext.destination)
  source.start(0)

  const rendered = await offlineContext.startRendering()
  const mono = audioContext.createBuffer(1, rendered.length, targetSampleRate)
  const monoSamples = mono.getChannelData(0)

  for (let channel = 0; channel < rendered.numberOfChannels; channel += 1) {
    const samples = rendered.getChannelData(channel)
    for (let index = 0; index < samples.length; index += 1) {
      monoSamples[index] += samples[index] / rendered.numberOfChannels
    }
  }

  return mono
}

function ensureMidiBufferShim() {
  const scope = globalThis as unknown as { Buffer?: { from: (values: number[]) => Uint8Array } }
  if (!scope.Buffer) scope.Buffer = { from: (values: number[]) => new Uint8Array(values) }
}
