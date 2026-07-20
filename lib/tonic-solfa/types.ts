import type { TranscriptionNote } from '@/types/transcription'

export type SolfaMode = 'major' | 'minor'

export type SolfaKey = {
  tonic: string
  pitchClass: number
  mode: SolfaMode
  source: 'existing' | 'estimated'
}

export type TonicSolfaResult = {
  notation: string
  key: SolfaKey
  notes: TranscriptionNote[]
}
