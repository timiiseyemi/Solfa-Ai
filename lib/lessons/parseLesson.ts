import { z } from 'zod'
import type { AiLesson } from '@/types/lesson'

export const aiLessonSchema = z.object({
  summary: z.string().min(1),
  difficultyExplanation: z.string().min(1),
  whatThisSongTeaches: z.array(z.string().min(1)).min(1).max(5),
  practicePlan: z.array(z.string().min(1)).min(1).max(5),
  warmupExercises: z.array(z.string().min(1)).min(1).max(5),
  commonMistakes: z.array(z.string().min(1)).min(1).max(5),
  practiceTips: z.array(z.string().min(1)).min(1).max(5),
  dailyPracticeRoutine: z.array(z.string().min(1)).min(1).max(5),
  nextGoal: z.string().min(1),
}).strict()

export const aiLessonJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['summary', 'difficultyExplanation', 'whatThisSongTeaches', 'practicePlan', 'warmupExercises', 'commonMistakes', 'practiceTips', 'dailyPracticeRoutine', 'nextGoal'],
  properties: {
    summary: { type: 'string' },
    difficultyExplanation: { type: 'string' },
    whatThisSongTeaches: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 5 },
    practicePlan: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 5 },
    warmupExercises: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 5 },
    commonMistakes: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 5 },
    practiceTips: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 5 },
    dailyPracticeRoutine: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 5 },
    nextGoal: { type: 'string' },
  },
} as const

export function parseAiLesson(value: unknown): AiLesson {
  const parsed = typeof value === 'string' ? JSON.parse(value) : value
  return aiLessonSchema.parse(parsed)
}

export function safeParseAiLesson(value: unknown): AiLesson | null {
  try {
    return parseAiLesson(value)
  } catch {
    return null
  }
}
