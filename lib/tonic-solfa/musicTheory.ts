import type { SolfaKey } from './types'

const MAJOR_SYLLABLES = ['do', 'di', 're', 'ri', 'mi', 'fa', 'fi', 'sol', 'si', 'la', 'li', 'ti']
const NATURAL_MINOR_SYLLABLES = ['do', 'di', 're', 'me', 'mi', 'fa', 'fi', 'sol', 'le', 'la', 'te', 'ti']

/** Maps a MIDI pitch to movable-do tonic sol-fa, retaining octave displacement. */
export function midiToSolfa(midi: number, key: SolfaKey) {
  const relativePitch = ((midi - key.pitchClass) % 12 + 12) % 12
  const syllable = (key.mode === 'major' ? MAJOR_SYLLABLES : NATURAL_MINOR_SYLLABLES)[relativePitch]
  return `${syllable}${octaveMarker(midi)}`
}

function octaveMarker(midi: number) {
  const octave = Math.floor(midi / 12) - 1
  if (octave > 4) return "'".repeat(octave - 4)
  if (octave < 4) return ','.repeat(4 - octave)
  return ''
}
