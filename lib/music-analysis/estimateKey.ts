import type { TranscriptionNote } from '@/types/transcription'

const MAJOR_PROFILE = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]
const MINOR_PROFILE = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17]
const PITCH_CLASSES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B']

/** Estimates the most likely tonal center from confidence-weighted note duration. */
export function estimateKey(notes: TranscriptionNote[]) {
  if (!notes.length) return null

  const histogram = Array.from({ length: 12 }, () => 0)
  for (const note of notes) {
    const pitchClass = ((note.pitchMidi % 12) + 12) % 12
    histogram[pitchClass] += Math.max(0.02, note.durationSeconds) * Math.max(0, note.confidence)
  }

  if (!histogram.some((value) => value > 0)) return null

  let best: { tonic: number; mode: 'major' | 'minor'; score: number } | null = null
  for (let tonic = 0; tonic < 12; tonic += 1) {
    for (const [mode, profile] of [['major', MAJOR_PROFILE], ['minor', MINOR_PROFILE]] as const) {
      const score = profile.reduce((total, weight, index) => total + weight * histogram[(index + tonic) % 12], 0)
      if (!best || score > best.score) best = { tonic, mode, score }
    }
  }

  return best ? `${PITCH_CLASSES[best.tonic]} ${best.mode}` : null
}
