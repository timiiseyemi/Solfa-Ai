import { detectSolfaKey } from './keyDetection'
import { midiToSolfa } from './musicTheory'
import type { TonicSolfaResult } from './types'
import type { TranscriptionNote } from '@/types/transcription'

/**
 * Generates movable-do notation from structured transcription notes. Lines are
 * split at audible gaps and regularly sized phrase groups; simultanous notes
 * remain grouped in brackets instead of being silently discarded.
 */
export function generateTonicSolfa(notes: TranscriptionNote[], existingKey?: string | null): TonicSolfaResult | null {
  const key = detectSolfaKey(notes, existingKey)
  if (!key || !notes.length) return null

  const groups = groupByOnset(notes)
  const lines: string[] = []
  let currentLine: string[] = []
  let previousOnset: number | null = null

  for (const group of groups) {
    const startsNewPhrase = previousOnset !== null && group.onset - previousOnset >= 0.8
    if (currentLine.length && (startsNewPhrase || currentLine.length >= 8)) {
      lines.push(currentLine.join(' '))
      currentLine = []
    }

    const syllables = group.notes
      .sort((left, right) => left.pitchMidi - right.pitchMidi)
      .map((note) => midiToSolfa(note.pitchMidi, key))
    currentLine.push(syllables.length > 1 ? `[${syllables.join(' ')}]` : syllables[0])
    previousOnset = group.onset
  }
  if (currentLine.length) lines.push(currentLine.join(' '))

  const notation = lines.join('\n').trim()
  return notation ? { notation, key, notes } : null
}

function groupByOnset(notes: TranscriptionNote[]) {
  const groups: Array<{ onset: number; notes: TranscriptionNote[] }> = []
  const sorted = [...notes].sort((left, right) => left.startTimeSeconds - right.startTimeSeconds || left.pitchMidi - right.pitchMidi)

  for (const note of sorted) {
    const current = groups[groups.length - 1]
    if (current && Math.abs(current.onset - note.startTimeSeconds) <= 0.03) {
      current.notes.push(note)
    } else {
      groups.push({ onset: note.startTimeSeconds, notes: [note] })
    }
  }
  return groups
}
