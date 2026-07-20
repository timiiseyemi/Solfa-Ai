import type { TranscriptionNote } from '@/types/transcription'

/** Serializes Basic Pitch's MIDI bytes for private Storage. */
export function createMidiBlob(bytes: Uint8Array) {
  return new Blob([bytes], { type: 'audio/midi' })
}

/** Reads stored raw note events into the typed shape used by the app. */
export function readNoteEvents(serialized: string): TranscriptionNote[] {
  const value: unknown = JSON.parse(serialized)
  if (!Array.isArray(value)) throw new Error('The saved note events are invalid.')
  return value.filter(isTranscriptionNote)
}

function isTranscriptionNote(value: unknown): value is TranscriptionNote {
  if (!value || typeof value !== 'object') return false
  const note = value as Record<string, unknown>
  return typeof note.startTimeSeconds === 'number'
    && typeof note.durationSeconds === 'number'
    && typeof note.pitchMidi === 'number'
    && typeof note.confidence === 'number'
}
