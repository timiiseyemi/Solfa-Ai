import type { TranscriptionNote } from '@/types/transcription'

/** Uses MIDI tempo when present, otherwise estimates a beat rate from note onsets. */
export function estimateTempo(notes: TranscriptionNote[], midiTempo: number | null) {
  if (midiTempo && Number.isFinite(midiTempo) && midiTempo >= 30 && midiTempo <= 300) return Math.round(midiTempo)

  const onsets = [...new Set(notes.map((note) => Math.round(note.startTimeSeconds * 1000) / 1000))].sort((a, b) => a - b)
  if (onsets.length < 4) return null

  const intervals = onsets.slice(1).map((onset, index) => onset - onsets[index]).filter((interval) => interval >= 0.08 && interval <= 2)
  if (intervals.length < 3) return null

  const medianInterval = median(intervals)
  let bpm = 60 / medianInterval
  while (bpm < 60) bpm *= 2
  while (bpm > 200) bpm /= 2

  return Number.isFinite(bpm) ? Math.round(bpm) : null
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}
