export type DifficultyRating = 'Easy' | 'Intermediate' | 'Advanced'

export type MidiMetadata = {
  bpm: number | null
  timeSignature: string | null
}

export type SongAnalysis = {
  estimatedKey: string | null
  estimatedBpm: number | null
  estimatedTimeSignature: string | null
  difficulty: DifficultyRating | null
  pitchAccuracy: number | null
  complexityScore: number | null
}

export type StoredSongAnalysis = {
  estimated_key: string | null
  estimated_bpm: number | null
  estimated_time_signature: string | null
  difficulty: string | null
  pitch_accuracy: number | null
  complexity_score: number | null
}
