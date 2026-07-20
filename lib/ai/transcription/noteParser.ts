import type { TranscriptionNote, TranscriptionSummary } from '@/types/transcription'

type BasicPitchNote = {
  startTimeSeconds: number
  durationSeconds: number
  pitchMidi: number
  amplitude: number
  pitchBends?: number[]
}

export function normalizeNoteEvents(noteEvents: BasicPitchNote[]): TranscriptionNote[] {
  return noteEvents.map((note) => ({
    startTimeSeconds: round(note.startTimeSeconds),
    durationSeconds: round(note.durationSeconds),
    pitchMidi: note.pitchMidi,
    confidence: round(Math.max(0, Math.min(1, note.amplitude))),
    pitchBends: note.pitchBends,
  }))
}

export function summarizeNoteEvents(notes: TranscriptionNote[]): TranscriptionSummary {
  const durationSeconds = notes.reduce((latest, note) => Math.max(latest, note.startTimeSeconds + note.durationSeconds), 0)
  const averageConfidence = notes.length ? notes.reduce((sum, note) => sum + note.confidence, 0) / notes.length : 0

  return { noteCount: notes.length, durationSeconds: round(durationSeconds), averageConfidence: round(averageConfidence) }
}

function round(value: number) {
  return Math.round(value * 1000) / 1000
}
