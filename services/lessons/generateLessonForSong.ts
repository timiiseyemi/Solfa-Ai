import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'
import { transcriptionStoragePaths } from '@/lib/ai/transcription/basicPitch'
import { readNoteEvents } from '@/lib/ai/transcription/midi'
import { safeParseAiLesson } from '@/lib/lessons/parseLesson'
import { formatSimplifiedMelody } from '@/lib/lessons/prompt'
import { simplifyMelody } from '@/lib/music-simplification'
import { generateLesson } from '@/services/lessons/generateAiLesson'
import type { AiLesson, LessonSource } from '@/types/lesson'
import type { TranscriptionNote } from '@/types/transcription'

type LessonSong = {
  id: string
  original_filename: string
  status: string
  lesson_status: unknown
  lesson_source: unknown
  ai_lesson: unknown
  estimated_key: unknown
  estimated_bpm: unknown
  estimated_time_signature: unknown
  difficulty: unknown
  complexity_score: unknown
  pitch_accuracy: unknown
  tonic_solfa: unknown
}

export type GeneratedSongLesson = {
  lesson: AiLesson | null
  source: LessonSource
  status: 'ready' | 'pending'
  cached: boolean
}

/**
 * Generates and caches a song lesson without crossing an HTTP boundary.
 * This is shared by the authenticated route and the post-transcription server action.
 */
export async function generateLessonForSong({
  supabase,
  songId,
  userId,
}: {
  supabase: SupabaseClient
  songId: string
  userId: string
}): Promise<GeneratedSongLesson | null> {
  const song = await getOwnedLessonSong(supabase, songId, userId)
  if (!song) return null

  if (song.status !== 'transcribed') {
    return { lesson: null, source: lessonSource(song.lesson_source), status: 'pending', cached: false }
  }

  const cachedLesson = safeParseAiLesson(song.ai_lesson)
  if (cachedLesson) {
    return { lesson: cachedLesson, source: lessonSource(song.lesson_source), status: 'ready', cached: true }
  }

  await setGeneratingStatus(supabase, songId)

  const notes = await readSongNotes(supabase, userId, songId)
  const simplifiedMelody = simplifyMelody(notes)
  const { lesson, source } = await generateLesson({
    songTitle: song.original_filename,
    estimatedKey: stringValue(song.estimated_key),
    estimatedBpm: nullableNumber(song.estimated_bpm),
    estimatedTimeSignature: stringValue(song.estimated_time_signature),
    difficulty: stringValue(song.difficulty),
    complexityScore: nullableNumber(song.complexity_score),
    pitchAccuracy: nullableNumber(song.pitch_accuracy),
    detectedNotes: notes.length || null,
    simplifiedMelody: formatSimplifiedMelody(simplifiedMelody),
    tonicSolfa: stringValue(song.tonic_solfa),
    simplifiedMelodyNoteCount: simplifiedMelody.length,
  })

  await cacheLesson(supabase, songId, lesson, source)
  return { lesson, source, status: 'ready', cached: false }
}

async function getOwnedLessonSong(supabase: SupabaseClient, songId: string, userId: string): Promise<LessonSong | null> {
  const { data: song, error } = await supabase
    .from('songs')
    .select('id, original_filename, status, lesson_status, lesson_source, ai_lesson, estimated_key, estimated_bpm, estimated_time_signature, difficulty, complexity_score, pitch_accuracy, tonic_solfa')
    .eq('id', songId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return song as LessonSong | null
}

async function setGeneratingStatus(supabase: SupabaseClient, songId: string) {
  const { error } = await supabase
    .from('songs')
    .update({ lesson_status: 'generating', updated_at: new Date().toISOString() })
    .eq('id', songId)

  if (error) console.error('[ai-lesson] could not set generating status', { songId, error })
}

async function cacheLesson(supabase: SupabaseClient, songId: string, lesson: AiLesson, source: LessonSource) {
  const { error } = await supabase
    .from('songs')
    .update({
      ai_lesson: lesson,
      lesson_source: source,
      lesson_status: 'ready',
      lesson_generated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', songId)

  if (error) {
    // The generated lesson is still returned to the active caller. A later
    // request can safely regenerate it if the cache is temporarily unavailable.
    console.error('[ai-lesson] could not cache generated lesson', { songId, source, error })
  }
}

async function readSongNotes(supabase: SupabaseClient, userId: string, songId: string): Promise<TranscriptionNote[]> {
  const { noteEventsPath } = transcriptionStoragePaths(userId, songId)
  const { data: file, error } = await supabase.storage.from('songs').download(noteEventsPath)
  if (error || !file) {
    if (error) console.error('[ai-lesson] could not read note events', { songId, error })
    return []
  }

  try {
    return readNoteEvents(await file.text())
  } catch (error) {
    console.error('[ai-lesson] could not parse note events', { songId, error })
    return []
  }
}

function stringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : null
}

function nullableNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function lessonSource(value: unknown): LessonSource {
  return value === 'gpt' ? 'gpt' : 'fallback'
}
