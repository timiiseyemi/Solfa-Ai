import { estimateComplexity } from '@/lib/music-analysis/estimateComplexity'
import { estimateDifficulty } from '@/lib/music-analysis/estimateDifficulty'
import { estimateKey } from '@/lib/music-analysis/estimateKey'
import { readMidiMetadata } from '@/lib/music-analysis/midiMetadata'
import { estimateTempo } from '@/lib/music-analysis/estimateTempo'
import type { SongAnalysis, StoredSongAnalysis } from '@/types/music-analysis'
import type { TranscriptionNote } from '@/types/transcription'

export function analyzeSong(notes: TranscriptionNote[], midiData?: ArrayBuffer): SongAnalysis {
  const midiMetadata = midiData ? readMidiMetadata(midiData) : { bpm: null, timeSignature: null }
  const complexityScore = estimateComplexity(notes)
  const pitchAccuracy = notes.length
    ? Math.round((notes.reduce((sum, note) => sum + note.confidence, 0) / notes.length) * 100)
    : null

  return {
    estimatedKey: estimateKey(notes),
    estimatedBpm: estimateTempo(notes, midiMetadata.bpm),
    estimatedTimeSignature: midiMetadata.timeSignature,
    difficulty: estimateDifficulty(complexityScore),
    pitchAccuracy: pitchAccuracy === null ? null : Math.max(0, Math.min(100, pitchAccuracy)),
    complexityScore,
  }
}

export function toStoredSongAnalysis(analysis: SongAnalysis): StoredSongAnalysis {
  return {
    estimated_key: analysis.estimatedKey,
    estimated_bpm: analysis.estimatedBpm,
    estimated_time_signature: analysis.estimatedTimeSignature,
    difficulty: analysis.difficulty,
    pitch_accuracy: analysis.pitchAccuracy,
    complexity_score: analysis.complexityScore,
  }
}
