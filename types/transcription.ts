export type TranscriptionNote = {
  startTimeSeconds: number
  durationSeconds: number
  pitchMidi: number
  confidence: number
  pitchBends?: number[]
}

export type TranscriptionSummary = {
  noteCount: number
  durationSeconds: number
  averageConfidence: number
}

export type TranscriptionResult = {
  midiPath: string
  noteEventsPath: string
  notes: TranscriptionNote[]
  summary: TranscriptionSummary
}
