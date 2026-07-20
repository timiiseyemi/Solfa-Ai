import { estimateKey } from '@/lib/music-analysis/estimateKey'
import type { TranscriptionNote } from '@/types/transcription'
import type { SolfaKey, SolfaMode } from './types'

const NATURAL_PITCH_CLASSES: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
}

/** Prefers stored key metadata and otherwise derives an estimated key from note events. */
export function detectSolfaKey(notes: TranscriptionNote[], existingKey?: string | null): SolfaKey | null {
  const stored = existingKey ? parseKey(existingKey, 'existing') : null
  if (stored) return stored

  const estimatedKey = estimateKey(notes)
  return estimatedKey ? parseKey(estimatedKey, 'estimated') : null
}

export function parseKey(value: string, source: SolfaKey['source']): SolfaKey | null {
  const normalized = value
    .trim()
    .replace(/♯/g, '#')
    .replace(/♭/g, 'b')
    .replace(/\s+/g, ' ')
  const match = /^([A-Ga-g])([#b]?)(?:\s+)(major|minor|maj|min)$/i.exec(normalized)
  if (!match) return null

  const letter = match[1].toUpperCase()
  const accidental = match[2]
  const mode = normalizeMode(match[3])
  const naturalPitch = NATURAL_PITCH_CLASSES[letter]
  if (naturalPitch === undefined || !mode) return null

  const pitchClass = (naturalPitch + (accidental === '#' ? 1 : accidental === 'b' ? -1 : 0) + 12) % 12
  return { tonic: `${letter}${accidental}`, pitchClass, mode, source }
}

function normalizeMode(value: string): SolfaMode | null {
  if (value === 'major' || value === 'maj') return 'major'
  if (value === 'minor' || value === 'min') return 'minor'
  return null
}
