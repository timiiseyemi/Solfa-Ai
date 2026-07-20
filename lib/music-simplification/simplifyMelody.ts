import type { TranscriptionNote } from '@/types/transcription'

const ONSET_TOLERANCE_SECONDS = 0.04
const MIN_NOTE_DURATION_SECONDS = 0.08
const SUSTAIN_MERGE_GAP_SECONDS = 0.12

/**
 * Extracts a single, learning-friendly top-line melody from Basic Pitch note
 * events. The original events are never mutated or persisted differently.
 */
export function simplifyMelody(notes: readonly TranscriptionNote[]): TranscriptionNote[] {
  const audibleNotes = notes
    .filter((note) => Number.isFinite(note.startTimeSeconds)
      && Number.isFinite(note.durationSeconds)
      && Number.isFinite(note.pitchMidi)
      && note.durationSeconds >= MIN_NOTE_DURATION_SECONDS)
    .sort((left, right) => left.startTimeSeconds - right.startTimeSeconds || right.pitchMidi - left.pitchMidi)

  const melody = groupOnsets(audibleNotes).map(selectTopVoice)
  return mergeImmediateRepeats(melody)
}

function groupOnsets(notes: TranscriptionNote[]) {
  const groups: TranscriptionNote[][] = []
  for (const note of notes) {
    const group = groups[groups.length - 1]
    const groupOnset = group?.[0]?.startTimeSeconds
    if (group && groupOnset !== undefined && note.startTimeSeconds - groupOnset <= ONSET_TOLERANCE_SECONDS) {
      group.push(note)
    } else {
      groups.push([note])
    }
  }
  return groups
}

function selectTopVoice(group: TranscriptionNote[]) {
  const highest = group.reduce((selected, note) => {
    if (note.pitchMidi !== selected.pitchMidi) return note.pitchMidi > selected.pitchMidi ? note : selected
    return note.confidence > selected.confidence ? note : selected
  })

  return { ...highest, pitchBends: highest.pitchBends ? [...highest.pitchBends] : undefined }
}

function mergeImmediateRepeats(notes: TranscriptionNote[]) {
  const merged: TranscriptionNote[] = []

  for (const note of notes) {
    const previous = merged[merged.length - 1]
    const previousEnd = previous ? previous.startTimeSeconds + previous.durationSeconds : 0
    const isImmediateRepeat = previous
      && previous.pitchMidi === note.pitchMidi
      && note.startTimeSeconds <= previousEnd + SUSTAIN_MERGE_GAP_SECONDS

    if (isImmediateRepeat) {
      previous.durationSeconds = Math.max(previous.durationSeconds, note.startTimeSeconds + note.durationSeconds - previous.startTimeSeconds)
      previous.confidence = Math.max(previous.confidence, note.confidence)
      continue
    }

    merged.push({ ...note, pitchBends: note.pitchBends ? [...note.pitchBends] : undefined })
  }

  return merged
}
