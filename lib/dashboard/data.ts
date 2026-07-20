import type { SupabaseClient, User } from '@supabase/supabase-js'
import { safeParseAiLesson } from '@/lib/lessons/parseLesson'

export type DashboardSong = {
  id: string
  title: string
  createdAt: string | null
  status: string
  difficulty: string | null
  estimatedKey: string | null
  estimatedBpm: number | null
  lessonGeneratedAt: string | null
  hasLesson: boolean
}

export type DashboardMetrics = {
  songsAnalyzed: number
  lessonsCompleted: number
  practiceStreak: string
  averageBpm: string
  mostCommonKey: string
  averageDifficulty: string
}

type SongRow = {
  id: string
  original_filename: string
  created_at: unknown
  status: unknown
  difficulty: unknown
  estimated_key: unknown
  estimated_bpm: unknown
  lesson_generated_at: unknown
  ai_lesson: unknown
}

export function dashboardUserFromAuth(user: User) {
  const metadata = user.user_metadata ?? {}
  const fullName = stringValue(metadata.full_name) ?? user.email?.split('@')[0] ?? 'Musician'

  return {
    fullName,
    firstName: fullName.split(/\s+/)[0] || 'Musician',
    email: user.email ?? '',
    avatarUrl: stringValue(metadata.avatar_url) ?? undefined,
    bio: stringValue(metadata.bio) ?? '',
    joinedAt: user.created_at ?? null,
  }
}

export function mapDashboardSongs(rows: SongRow[] | null | undefined): DashboardSong[] {
  return (rows ?? []).map((song) => ({
    id: song.id,
    title: song.original_filename,
    createdAt: stringValue(song.created_at),
    status: stringValue(song.status) ?? 'uploaded',
    difficulty: stringValue(song.difficulty),
    estimatedKey: stringValue(song.estimated_key),
    estimatedBpm: finiteNumber(song.estimated_bpm),
    lessonGeneratedAt: stringValue(song.lesson_generated_at),
    hasLesson: safeParseAiLesson(song.ai_lesson) !== null,
  }))
}

export async function loadDashboardSongs(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('songs')
    .select('id, original_filename, created_at, status, difficulty, estimated_key, estimated_bpm, lesson_generated_at, ai_lesson')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return mapDashboardSongs(data as SongRow[] | null)
}

export function calculateDashboardMetrics(songs: DashboardSong[]): DashboardMetrics {
  const analyzedSongs = songs.filter((song) => song.status === 'transcribed')
  const lessons = songs.filter((song) => song.hasLesson)
  const bpms = songs.flatMap((song) => song.estimatedBpm === null ? [] : [song.estimatedBpm])
  const difficulties = songs.flatMap((song) => song.difficulty ? [song.difficulty] : [])

  return {
    songsAnalyzed: analyzedSongs.length,
    lessonsCompleted: lessons.length,
    // There is no practice-event table yet, so a numeric streak would be invented.
    practiceStreak: '—',
    averageBpm: bpms.length ? `${Math.round(bpms.reduce((total, bpm) => total + bpm, 0) / bpms.length)} BPM` : '—',
    mostCommonKey: mostCommon(songs.flatMap((song) => song.estimatedKey ? [song.estimatedKey] : [])) ?? '—',
    averageDifficulty: averageDifficulty(difficulties) ?? '—',
  }
}

export function formatSongDate(value: string | null) {
  if (!value) return 'Recently uploaded'
  const date = new Date(value)
  if (Number.isNaN(date.valueOf())) return 'Recently uploaded'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export function lessonHref(songId: string) {
  return `/songs/${songId}?tab=lesson`
}

function stringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function finiteNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function mostCommon(values: string[]) {
  const counts = new Map<string, number>()
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1))
  return [...counts.entries()].sort(([, left], [, right]) => right - left)[0]?.[0] ?? null
}

function averageDifficulty(values: string[]) {
  const scores: Record<string, number> = { Easy: 1, Intermediate: 2, Advanced: 3 }
  const known = values.flatMap((value) => scores[value] ? [scores[value]] : [])
  if (!known.length) return null
  const average = known.reduce((total, value) => total + value, 0) / known.length
  return average < 1.5 ? 'Easy' : average < 2.5 ? 'Intermediate' : 'Advanced'
}
