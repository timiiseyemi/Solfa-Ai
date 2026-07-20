import { Midi } from '@tonejs/midi'
import { parseKey } from '@/lib/tonic-solfa/keyDetection'
import type { TranscriptionNote } from '@/types/transcription'

type MusicXmlNote = {
  ticks: number
  durationTicks: number
  midi: number
  velocity: number
}

/**
 * Converts a Standard MIDI file into a compact MusicXML 4.0 score.
 * Tone.js MIDI is compatible with Node and browser runtimes and provides the
 * normalized timing data required for a valid interchange document.
 */
export function midiToMusicXml(
  midiData: ArrayBuffer,
  title = 'SolfaAI Transcription',
  simplifiedMelody?: readonly TranscriptionNote[],
  estimatedKey?: string | null,
) {
  const midi = new Midi(midiData)
  const divisions = midi.header.ppq || 480
  const [beats, beatType] = midi.header.timeSignatures[0]?.timeSignature ?? [4, 4]
  const tempo = Math.round(midi.header.tempos[0]?.bpm ?? 120)
  const notes = simplifiedMelody === undefined
    ? midi.tracks.flatMap((track) => track.notes.map((note) => ({
      ticks: note.ticks,
      durationTicks: Math.max(1, note.durationTicks),
      midi: note.midi,
      velocity: note.velocity,
    } satisfies MusicXmlNote))).sort((a, b) => a.ticks - b.ticks || a.midi - b.midi)
    : transcriptionNotesToMusicXmlNotes(simplifiedMelody, divisions, tempo)
  const ticksPerMeasure = Math.max(1, divisions * beats * (4 / beatType))
  const measures = buildMeasures(notes, ticksPerMeasure)
  const key = musicXmlKey(estimatedKey)

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
  <work><work-title>${escapeXml(title)}</work-title></work>
  <identification><encoding><software>SolfaAI</software><encoding-date>${new Date().toISOString().slice(0, 10)}</encoding-date></encoding></identification>
  <part-list><score-part id="P1"><part-name>Transcription</part-name></score-part></part-list>
  <part id="P1">
${measures.map((measure, index) => serializeMeasure(measure, index, { divisions, beats, beatType, tempo, ticksPerMeasure, key })).join('\n')}
  </part>
</score-partwise>`
}

function transcriptionNotesToMusicXmlNotes(notes: readonly TranscriptionNote[], divisions: number, bpm: number) {
  const ticksPerSecond = (divisions * bpm) / 60
  return notes.map((note) => ({
    ticks: Math.max(0, Math.round(note.startTimeSeconds * ticksPerSecond)),
    durationTicks: Math.max(1, Math.round(note.durationSeconds * ticksPerSecond)),
    midi: Math.round(note.pitchMidi),
    velocity: Math.max(0, Math.min(1, note.confidence)),
  } satisfies MusicXmlNote)).sort((left, right) => left.ticks - right.ticks || left.midi - right.midi)
}

function buildMeasures(notes: MusicXmlNote[], ticksPerMeasure: number) {
  const measureCount = Math.max(1, ...notes.map((note) => Math.floor(note.ticks / ticksPerMeasure) + 1))
  return Array.from({ length: measureCount }, (_, index) => notes.filter((note) => Math.floor(note.ticks / ticksPerMeasure) === index))
}

function serializeMeasure(notes: MusicXmlNote[], index: number, config: { divisions: number; beats: number; beatType: number; tempo: number; ticksPerMeasure: number; key: MusicXmlKey }) {
  const measureStart = index * config.ticksPerMeasure
  const byStart = new Map<number, MusicXmlNote[]>()
  notes.forEach((note) => {
    const group = byStart.get(note.ticks) ?? []
    group.push(note)
    byStart.set(note.ticks, group)
  })

  let cursor = measureStart
  const contents: string[] = []
  for (const [start, group] of [...byStart.entries()].sort(([a], [b]) => a - b)) {
    if (start > cursor) contents.push(restXml(Math.min(start - cursor, measureStart + config.ticksPerMeasure - cursor), config.divisions))
    const duration = Math.min(Math.max(...group.map((note) => note.durationTicks)), measureStart + config.ticksPerMeasure - start)
    group.forEach((note, noteIndex) => contents.push(noteXml(note, duration, noteIndex > 0, config.divisions, config.key)))
    cursor = Math.max(cursor, start + duration)
  }
  if (cursor < measureStart + config.ticksPerMeasure) contents.push(restXml(measureStart + config.ticksPerMeasure - cursor, config.divisions))

  const attributes = index === 0
    ? `<attributes><divisions>${config.divisions}</divisions><key><fifths>${config.key.fifths}</fifths></key><time><beats>${config.beats}</beats><beat-type>${config.beatType}</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes><direction placement="above"><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>${config.tempo}</per-minute></metronome></direction-type><sound tempo="${config.tempo}"/></direction>`
    : ''

  return `    <measure number="${index + 1}">${attributes}${contents.join('')}</measure>`
}

function noteXml(note: MusicXmlNote, duration: number, chord: boolean, divisions: number, key: MusicXmlKey) {
  const { step, alter, octave } = pitchToXml(note.midi, key)
  const velocity = Math.max(1, Math.round(note.velocity * 127))
  return `<note>${chord ? '<chord/>' : ''}<pitch><step>${step}</step>${alter ? `<alter>${alter}</alter>` : ''}<octave>${octave}</octave></pitch><duration>${duration}</duration><voice>1</voice><type>${durationType(duration, divisions)}</type><velocity>${velocity}</velocity></note>`
}

function restXml(duration: number, divisions: number) {
  const rounded = Math.max(1, Math.round(duration))
  return `<note><rest/><duration>${rounded}</duration><voice>1</voice><type>${durationType(rounded, divisions)}</type></note>`
}

function durationType(duration: number, divisions: number) {
  const ratio = duration / divisions
  if (ratio >= 3.5) return 'whole'
  if (ratio >= 1.75) return 'half'
  if (ratio >= 0.75) return 'quarter'
  if (ratio >= 0.375) return 'eighth'
  if (ratio >= 0.1875) return '16th'
  return '32nd'
}

function pitchToXml(midi: number, key: MusicXmlKey) {
  const pitchClass = ((midi % 12) + 12) % 12
  const diatonicPitch = DIATONIC_STEPS.find((step) => (NATURAL_PITCH_CLASSES[step] + key.accidentals[step] + 12) % 12 === pitchClass)
  if (diatonicPitch) {
    return {
      step: diatonicPitch,
      alter: key.accidentals[diatonicPitch],
      octave: Math.floor(midi / 12) - 1,
    }
  }

  const pitchClasses = [
    ['C', 0], ['C', 1], ['D', 0], ['D', 1], ['E', 0], ['F', 0],
    ['F', 1], ['G', 0], ['G', 1], ['A', 0], ['A', 1], ['B', 0],
  ] as const
  const [step, alter] = pitchClasses[pitchClass]
  return { step, alter, octave: Math.floor(midi / 12) - 1 }
}

type MusicXmlKey = {
  fifths: number
  accidentals: Record<MusicXmlStep, number>
}

type MusicXmlStep = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

const DIATONIC_STEPS: MusicXmlStep[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const NATURAL_PITCH_CLASSES: Record<MusicXmlStep, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
}
const SHARP_ORDER: MusicXmlStep[] = ['F', 'C', 'G', 'D', 'A', 'E', 'B']
const FLAT_ORDER: MusicXmlStep[] = ['B', 'E', 'A', 'D', 'G', 'C', 'F']
const KEY_FIFTHS: Record<string, number> = {
  'C major': 0, 'G major': 1, 'D major': 2, 'A major': 3, 'E major': 4, 'B major': 5, 'F# major': 6, 'C# major': 7,
  'F major': -1, 'Bb major': -2, 'Eb major': -3, 'Ab major': -4, 'Db major': -5, 'Gb major': -6, 'Cb major': -7,
  'A minor': 0, 'E minor': 1, 'B minor': 2, 'F# minor': 3, 'C# minor': 4, 'G# minor': 5, 'D# minor': 6, 'A# minor': 7,
  'D minor': -1, 'G minor': -2, 'C minor': -3, 'F minor': -4, 'Bb minor': -5, 'Eb minor': -6, 'Ab minor': -7,
}

function musicXmlKey(estimatedKey?: string | null): MusicXmlKey {
  const parsed = estimatedKey ? parseKey(estimatedKey, 'existing') : null
  const label = parsed ? `${parsed.tonic} ${parsed.mode}` : 'C major'
  const fifths = KEY_FIFTHS[label] ?? 0
  const accidentals = Object.fromEntries(DIATONIC_STEPS.map((step) => [step, 0])) as Record<MusicXmlStep, number>
  const order = fifths >= 0 ? SHARP_ORDER : FLAT_ORDER
  for (const step of order.slice(0, Math.abs(fifths))) accidentals[step] = fifths >= 0 ? 1 : -1
  return { fifths, accidentals }
}

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character]!)
}
