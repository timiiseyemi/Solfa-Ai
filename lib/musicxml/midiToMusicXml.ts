import { Midi } from '@tonejs/midi'
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

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
  <work><work-title>${escapeXml(title)}</work-title></work>
  <identification><encoding><software>SolfaAI</software><encoding-date>${new Date().toISOString().slice(0, 10)}</encoding-date></encoding></identification>
  <part-list><score-part id="P1"><part-name>Transcription</part-name></score-part></part-list>
  <part id="P1">
${measures.map((measure, index) => serializeMeasure(measure, index, { divisions, beats, beatType, tempo, ticksPerMeasure })).join('\n')}
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

function serializeMeasure(notes: MusicXmlNote[], index: number, config: { divisions: number; beats: number; beatType: number; tempo: number; ticksPerMeasure: number }) {
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
    group.forEach((note, noteIndex) => contents.push(noteXml(note, duration, noteIndex > 0, config.divisions)))
    cursor = Math.max(cursor, start + duration)
  }
  if (cursor < measureStart + config.ticksPerMeasure) contents.push(restXml(measureStart + config.ticksPerMeasure - cursor, config.divisions))

  const attributes = index === 0
    ? `<attributes><divisions>${config.divisions}</divisions><key><fifths>0</fifths></key><time><beats>${config.beats}</beats><beat-type>${config.beatType}</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes><direction placement="above"><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>${config.tempo}</per-minute></metronome></direction-type><sound tempo="${config.tempo}"/></direction>`
    : ''

  return `    <measure number="${index + 1}">${attributes}${contents.join('')}</measure>`
}

function noteXml(note: MusicXmlNote, duration: number, chord: boolean, divisions: number) {
  const { step, alter, octave } = pitchToXml(note.midi)
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

function pitchToXml(midi: number) {
  const pitchClasses = [
    ['C', 0], ['C', 1], ['D', 0], ['D', 1], ['E', 0], ['F', 0],
    ['F', 1], ['G', 0], ['G', 1], ['A', 0], ['A', 1], ['B', 0],
  ] as const
  const [step, alter] = pitchClasses[((midi % 12) + 12) % 12]
  return { step, alter, octave: Math.floor(midi / 12) - 1 }
}

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character]!)
}
