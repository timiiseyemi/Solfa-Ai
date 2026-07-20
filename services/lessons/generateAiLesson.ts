import { aiLessonJsonSchema, parseAiLesson } from '@/lib/lessons/parseLesson'
import { buildLessonPrompt, lessonInstructions } from '@/lib/lessons/prompt'
import { generateDeterministicLesson } from '@/lib/lessons/generateDeterministicLesson'
import { getOpenAiClient, isOpenAiConfigured } from '@/services/openai/client'
import type { AiLesson, LessonPromptContext, LessonSource } from '@/types/lesson'

export async function generateGptLesson(context: LessonPromptContext): Promise<AiLesson> {
  const response = await getOpenAiClient().responses.create({
    model: process.env.OPENAI_LESSON_MODEL ?? 'gpt-5-mini',
    instructions: lessonInstructions,
    input: buildLessonPrompt(context),
    max_output_tokens: 1600,
    store: false,
    text: {
      format: {
        type: 'json_schema',
        name: 'solfaai_music_lesson',
        strict: true,
        schema: aiLessonJsonSchema,
      },
    },
  })

  if (!response.output_text) throw new Error('OpenAI returned an empty lesson response.')
  return parseAiLesson(response.output_text)
}

/** Uses GPT when configured, but always returns a complete offline lesson on failure. */
export async function generateLesson(context: LessonPromptContext): Promise<{ lesson: AiLesson; source: LessonSource }> {
  const fallbackLesson = generateDeterministicLesson(context)
  if (!isOpenAiConfigured()) return { lesson: fallbackLesson, source: 'fallback' }

  try {
    return { lesson: await generateGptLesson(context), source: 'gpt' }
  } catch (error) {
    console.error('[ai-lesson] GPT generation failed; using deterministic lesson', {
      message: error instanceof Error ? error.message : undefined,
      stack: error instanceof Error ? error.stack : undefined,
      error,
    })
    return { lesson: fallbackLesson, source: 'fallback' }
  }
}
