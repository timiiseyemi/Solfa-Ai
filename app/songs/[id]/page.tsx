import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SongResultsTabs } from '@/components/music/SongResultsTabs'
import { transcriptionStoragePaths } from '@/lib/ai/transcription/basicPitch'
import { readNoteEvents } from '@/lib/ai/transcription/midi'
import { summarizeNoteEvents } from '@/lib/ai/transcription/noteParser'
import { analyzeSong } from '@/lib/music-analysis'
import { safeParseAiLesson } from '@/lib/lessons/parseLesson'
import { createClient } from '@/lib/supabase/server'
import type { DifficultyRating, SongAnalysis as SongAnalysisData } from '@/types/music-analysis'
import type { LessonSource } from '@/types/lesson'
import type { TranscriptionNote } from '@/types/transcription'

export default async function SongPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { id } = await params
  const { tab } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: song } = await supabase
    .from('songs')
    .select('id, original_filename, storage_path, status, notation_status, musicxml_path, estimated_key, estimated_bpm, estimated_time_signature, difficulty, pitch_accuracy, complexity_score, tonic_solfa, ai_lesson, lesson_source')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()
  if (!song) notFound()

  const { midiPath, noteEventsPath } = transcriptionStoragePaths(user.id, id)
  const [{ data: noteFile }, { data: midiFile }] = await Promise.all([
    supabase.storage.from('songs').download(noteEventsPath),
    supabase.storage.from('songs').download(midiPath),
  ])
  const notes = await readStoredNotes(noteFile)
  const summary = notes.length ? summarizeNoteEvents(notes) : null
  const hasMidi = song.status === 'transcribed' && summary !== null
  const notationStatus = stringValue(song.notation_status) ?? 'pending'
  const musicXmlPath = stringValue(song.musicxml_path)
  const tonicSolfa = stringValue(song.tonic_solfa)
  const lesson = safeParseAiLesson(song.ai_lesson)
  const lessonSource: LessonSource = song.lesson_source === 'gpt' ? 'gpt' : 'fallback'
  const derivedAnalysis = notes.length ? analyzeSong(notes, midiFile ? await midiFile.arrayBuffer() : undefined) : null
  const analysis: SongAnalysisData = {
    estimatedKey: stringValue(song.estimated_key) ?? derivedAnalysis?.estimatedKey ?? null,
    estimatedBpm: nullableNumber(song.estimated_bpm) ?? derivedAnalysis?.estimatedBpm ?? null,
    estimatedTimeSignature: stringValue(song.estimated_time_signature) ?? derivedAnalysis?.estimatedTimeSignature ?? null,
    difficulty: storedDifficulty(song.difficulty) ?? derivedAnalysis?.difficulty ?? null,
    pitchAccuracy: nullableNumber(song.pitch_accuracy) ?? derivedAnalysis?.pitchAccuracy ?? null,
    complexityScore: nullableNumber(song.complexity_score) ?? derivedAnalysis?.complexityScore ?? null,
  }
  const solfaState = tonicSolfa ? 'ready' : song.status !== 'transcribed' ? 'loading' : notes.length ? 'error' : 'empty'

  return (
    <main className="min-h-screen bg-[#0a0a10] px-4 py-7 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/dashboard" className="inline-flex text-sm text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">&larr; Dashboard</Link>
        <SongResultsTabs songId={song.id} songTitle={song.original_filename} songStatus={song.status} storagePath={song.storage_path} hasMidi={hasMidi} durationSeconds={summary?.durationSeconds ?? null} detectedNotes={summary?.noteCount ?? null} notationStatus={notationStatus} musicXmlPath={musicXmlPath} tonicSolfa={tonicSolfa} solfaState={solfaState} analysis={analysis} lesson={lesson} lessonSource={lessonSource} initialTab={tab === 'lesson' ? 'lesson' : 'overview'} />
      </div>
    </main>
  )
}

async function readStoredNotes(file: Blob | null): Promise<TranscriptionNote[]> {
  if (!file) return []
  try {
    return readNoteEvents(await file.text())
  } catch {
    return []
  }
}

function nullableNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function stringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : null
}

function storedDifficulty(value: unknown): DifficultyRating | null {
  return value === 'Easy' || value === 'Intermediate' || value === 'Advanced' ? value : null
}
