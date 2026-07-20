import type { SupabaseClient } from '@supabase/supabase-js'
import { transcribeWithBasicPitch, transcriptionStoragePaths } from '@/lib/ai/transcription/basicPitch'
import { analyzeSong, toStoredSongAnalysis } from '@/lib/music-analysis'
import { simplifyMelody } from '@/lib/music-simplification'
import { generateLessonAfterTranscription } from '@/app/actions/generateLessonAfterTranscription'
import { generateAndStoreMusicXml } from '@/services/musicxml/generateMusicXml'
import { generateTonicSolfa } from '@/lib/tonic-solfa'
import type { TranscriptionResult } from '@/types/transcription'

export type TranscriptionStage = 'downloading' | 'decoding' | 'loading' | 'transcribing' | 'saving' | 'finalizing'

export async function transcribeSong({
  supabase,
  songId,
  storagePath,
  originalFilename,
  onStage,
  onProgress,
}: {
  supabase: SupabaseClient
  songId: string
  storagePath: string
  originalFilename: string
  onStage?: (stage: TranscriptionStage) => void
  onProgress?: (percentage: number) => void
}): Promise<TranscriptionResult> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Your session has expired. Please sign in and try again.')

  await updateSongStatus(supabase, songId, 'transcribing')

  try {
    onStage?.('downloading')
    const { data: audio, error: downloadError } = await supabase.storage.from('songs').download(storagePath)
    if (downloadError || !audio) throw new Error('We could not retrieve your uploaded audio.')

    onStage?.('decoding')
    const { midi, notes, summary } = await transcribeWithBasicPitch({
      audio: await audio.arrayBuffer(),
      onModelLoading: () => onStage?.('loading'),
      onProgress: (percentage) => {
        onStage?.('transcribing')
        onProgress?.(percentage)
      },
    })

    onStage?.('saving')
    const { midiPath, noteEventsPath } = transcriptionStoragePaths(user.id, songId)
    const [midiUpload, noteUpload] = await Promise.all([
      supabase.storage.from('songs').upload(midiPath, midi, { contentType: 'audio/midi', upsert: true }),
      supabase.storage.from('songs').upload(noteEventsPath, JSON.stringify(notes), { contentType: 'application/json', upsert: true }),
    ])
    if (midiUpload.error || noteUpload.error) throw new Error('We could not save the transcription output.')

    // Keep the raw Basic Pitch result for MIDI download and future processing.
    // Only notation-oriented outputs use this simplified top-line melody.
    const simplifiedMelody = simplifyMelody(notes)

    // Analysis enhances the result but must never turn a completed MIDI transcription
    // into a failure. The migration makes these fields nullable for older records.
    let calculatedKey: string | null = null
    try {
      const analysis = analyzeSong(notes, await midi.arrayBuffer())
      calculatedKey = analysis.estimatedKey
      const { error: analysisError } = await supabase
        .from('songs')
        .update({ ...toStoredSongAnalysis(analysis), updated_at: new Date().toISOString() })
        .eq('id', songId)
      if (analysisError) throw analysisError
    } catch (analysisError) {
      console.error('[music-analysis] unable to persist song analysis', { songId, error: analysisError })
    }

    // MusicXML is supplementary: its own failure is persisted as notation_status
    // and must never prevent the successfully generated MIDI from being available.
    await generateAndStoreMusicXml({ supabase, songId, userId: user.id, originalFilename, midi, simplifiedMelody })

    // Tonic sol-fa is derived only from the structured transcription result.
    // Like MusicXML, it is an enhancement and never changes MIDI success/failure.
    try {
      const { data: metadata, error: metadataError } = await supabase
        .from('songs')
        .select('estimated_key')
        .eq('id', songId)
        .maybeSingle()
      if (metadataError) throw metadataError

      const storedKey = typeof metadata?.estimated_key === 'string' ? metadata.estimated_key : calculatedKey
      const solfa = generateTonicSolfa(simplifiedMelody, storedKey)
      if (!solfa) throw new Error('No tonic sol-fa notation could be derived from this transcription.')

      const { error: solfaError } = await supabase
        .from('songs')
        .update({ tonic_solfa: solfa.notation, lesson_status: 'ready', updated_at: new Date().toISOString() })
        .eq('id', songId)
      if (solfaError) throw solfaError
    } catch (solfaError) {
      console.error('[tonic-solfa] unable to generate or persist tonic sol-fa', { songId, error: solfaError })
    }

    onStage?.('finalizing')
    await updateSongStatus(supabase, songId, 'transcribed')
    try {
      // Basic Pitch runs in the browser, so this server action is the safe
      // boundary for OpenAI and lesson persistence. It does not self-fetch.
      await generateLessonAfterTranscription(songId)
    } catch (lessonError) {
      // A lesson is supplementary to a successful MIDI transcription.
      console.error('[ai-lesson] automatic generation failed', { songId, error: lessonError })
    }
    return { midiPath, noteEventsPath, notes, summary }
  } catch (error) {
    await updateSongStatus(supabase, songId, 'failed')
    throw error instanceof Error ? error : new Error('Transcription failed. Please try again.')
  }
}

async function updateSongStatus(supabase: SupabaseClient, songId: string, status: 'transcribing' | 'transcribed' | 'failed') {
  const { error } = await supabase.from('songs').update({ status, updated_at: new Date().toISOString() }).eq('id', songId)
  if (error) throw new Error('We could not update the transcription status.')
}
