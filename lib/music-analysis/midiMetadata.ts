import { Midi } from '@tonejs/midi'
import type { MidiMetadata } from '@/types/music-analysis'

/** Extracts only explicit MIDI header metadata. Missing header values remain unknown. */
export function readMidiMetadata(midiData: ArrayBuffer): MidiMetadata {
  try {
    const midi = new Midi(midiData)
    const bpm = midi.header.tempos[0]?.bpm
    const signature = midi.header.timeSignatures[0]?.timeSignature

    return {
      bpm: bpm && Number.isFinite(bpm) ? Math.round(bpm) : null,
      timeSignature: signature ? `${signature[0]}/${signature[1]}` : null,
    }
  } catch (error) {
    console.warn('[music-analysis] unable to read MIDI metadata', error)
    return { bpm: null, timeSignature: null }
  }
}
