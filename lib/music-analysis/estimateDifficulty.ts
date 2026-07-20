import type { DifficultyRating } from '@/types/music-analysis'

export function estimateDifficulty(complexityScore: number | null): DifficultyRating | null {
  if (complexityScore === null) return null
  if (complexityScore < 35) return 'Easy'
  if (complexityScore < 65) return 'Intermediate'
  return 'Advanced'
}
