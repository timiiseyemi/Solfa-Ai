import type { TranscriptionNote } from '@/types/transcription'

/** Produces a transparent 0–100 score from note density, range, variety, rhythm, and simultaneity. */
export function estimateComplexity(notes: TranscriptionNote[]) {
  if (!notes.length) return null

  const duration = Math.max(...notes.map((note) => note.startTimeSeconds + note.durationSeconds))
  if (!Number.isFinite(duration) || duration <= 0) return null

  const pitches = notes.map((note) => note.pitchMidi)
  const pitchRange = Math.max(...pitches) - Math.min(...pitches)
  const pitchClasses = new Set(pitches.map((pitch) => ((pitch % 12) + 12) % 12)).size
  const noteDensity = notes.length / duration
  const durations = notes.map((note) => Math.max(0.01, note.durationSeconds))
  const durationMean = durations.reduce((sum, value) => sum + value, 0) / durations.length
  const durationDeviation = Math.sqrt(durations.reduce((sum, value) => sum + (value - durationMean) ** 2, 0) / durations.length)
  const rhythmVariation = Math.min(1, durationDeviation / durationMean)
  const simultaneousNotes = notes.length - new Set(notes.map((note) => Math.round(note.startTimeSeconds * 100))).size

  const score = (Math.min(1, pitchRange / 36) * 22)
    + (Math.min(1, noteDensity / 5) * 28)
    + (Math.min(1, pitchClasses / 12) * 18)
    + (rhythmVariation * 20)
    + (Math.min(1, simultaneousNotes / Math.max(1, notes.length * 0.25)) * 12)

  return Math.round(Math.max(0, Math.min(100, score)))
}
