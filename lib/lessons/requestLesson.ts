import type { LessonSource } from '@/types/lesson'

export async function requestAiLessonGeneration(songId: string) {
  const response = await fetch(`/api/songs/${songId}/lesson`, { method: 'POST' })
  if (!response.ok) throw new Error('We could not generate your lesson right now.')
  return response.json() as Promise<{ lesson: unknown | null; status: string; source: LessonSource }>
}
