'use server'

import { createClient } from '@/lib/supabase/server'
import { generateLessonForSong } from '@/services/lessons/generateLessonForSong'

/** Runs the shared, server-only lesson pipeline after browser-side Basic Pitch completes. */
export async function generateLessonAfterTranscription(songId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Your session has expired. Please sign in and try again.')

  const result = await generateLessonForSong({ supabase, songId, userId: user.id })
  if (!result) throw new Error('We could not find this song.')
  return result
}
