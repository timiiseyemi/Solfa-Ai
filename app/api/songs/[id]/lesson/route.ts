import { NextResponse } from 'next/server'
import { safeParseAiLesson } from '@/lib/lessons/parseLesson'
import { createClient } from '@/lib/supabase/server'
import { generateLessonForSong } from '@/services/lessons/generateLessonForSong'
import type { LessonSource } from '@/types/lesson'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await getOwnedSong(params)
  if ('response' in result) return result.response

  return NextResponse.json({
    lesson: safeParseAiLesson(result.song.ai_lesson),
    status: stringValue(result.song.lesson_status) ?? 'pending',
    source: lessonSource(result.song.lesson_source),
  })
}

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await getOwnedSong(params)
  if ('response' in result) return result.response

  const { supabase, song, user, id } = result
  if (song.status !== 'transcribed') {
    return NextResponse.json({ error: 'The lesson will be available after transcription finishes.' }, { status: 409 })
  }

  const generated = await generateLessonForSong({ supabase, songId: id, userId: user.id })
  if (!generated) return new NextResponse('Not found', { status: 404 })

  return NextResponse.json(generated)
}

async function getOwnedSong(params: Promise<{ id: string }>) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { response: new NextResponse('Unauthorized', { status: 401 }) }

  const { data: song } = await supabase
    .from('songs')
    .select('id, original_filename, status, lesson_status, lesson_source, ai_lesson, estimated_key, estimated_bpm, estimated_time_signature, difficulty, complexity_score, pitch_accuracy, tonic_solfa')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()
  if (!song) return { response: new NextResponse('Not found', { status: 404 }) }

  return { supabase, song, user, id }
}

function stringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : null
}

function lessonSource(value: unknown): LessonSource {
  return value === 'gpt' ? 'gpt' : 'fallback'
}
