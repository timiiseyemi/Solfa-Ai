export type AiLesson = {
  summary: string
  difficultyExplanation: string
  whatThisSongTeaches: string[]
  practicePlan: string[]
  warmupExercises: string[]
  commonMistakes: string[]
  practiceTips: string[]
  dailyPracticeRoutine: string[]
  nextGoal: string
}

export type LessonSource = 'gpt' | 'fallback'

export type LessonPromptContext = {
  songTitle: string
  estimatedKey: string | null
  estimatedBpm: number | null
  estimatedTimeSignature: string | null
  difficulty: string | null
  complexityScore: number | null
  pitchAccuracy: number | null
  detectedNotes: number | null
  simplifiedMelody: string
  tonicSolfa: string | null
  simplifiedMelodyNoteCount: number
}
