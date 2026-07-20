import type { SupabaseClient } from '@supabase/supabase-js'
import { midiToMusicXml } from '@/lib/musicxml/midiToMusicXml'
import type { TranscriptionNote } from '@/types/transcription'

export async function generateAndStoreMusicXml({
  supabase,
  songId,
  userId,
  originalFilename,
  midi,
  simplifiedMelody,
  estimatedKey,
}: {
  supabase: SupabaseClient
  songId: string
  userId: string
  originalFilename: string
  midi: Blob
  simplifiedMelody: TranscriptionNote[]
  estimatedKey: string | null
}) {
  let step = 'marking notation as generating'
  try {
    await updateNotationStatus(supabase, songId, { notation_status: 'generating' })
    // Storage RLS scopes this bucket by its first path segment, matching the
    // original audio, MIDI, and note-event upload convention.
    const musicXmlPath = `${userId}/transcriptions/${songId}/sheet.musicxml`

    step = 'reading generated MIDI data'
    const midiData = await midi.arrayBuffer()

    // midiToMusicXml performs both Standard MIDI parsing and MusicXML serialization.
    step = 'parsing MIDI and generating MusicXML'
    const musicXml = midiToMusicXml(
      midiData,
      originalFilename.replace(/\.[^.]+$/, ''),
      simplifiedMelody,
      estimatedKey,
    )

    step = 'uploading MusicXML to Supabase Storage'
    const { error: uploadError } = await supabase.storage.from('songs').upload(
      musicXmlPath,
      new Blob([musicXml], { type: 'application/vnd.recordare.musicxml+xml' }),
      { contentType: 'application/vnd.recordare.musicxml+xml', upsert: true },
    )
    if (uploadError) throw uploadError

    step = 'saving MusicXML path and ready status'
    await updateNotationStatus(supabase, songId, {
      notation_status: 'ready',
      musicxml_path: musicXmlPath,
    })
    return { musicXmlPath }
  } catch (error) {
    logMusicXmlError('generation failed', { songId, step, error })
    try {
      await updateNotationStatus(supabase, songId, { notation_status: 'failed' })
    } catch (statusError) {
      logMusicXmlError('failed to persist notation failure', {
        songId,
        step: 'saving failed notation status',
        error: statusError,
      })
    }
    return null
  }
}

async function updateNotationStatus(supabase: SupabaseClient, songId: string, values: Record<string, string>) {
  const { error } = await supabase
    .from('songs')
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq('id', songId)
  if (error) throw error
}

function logMusicXmlError(
  event: string,
  { songId, step, error }: { songId: string; step: string; error: unknown },
) {
  const details = error instanceof Error
    ? { message: error.message, stack: error.stack, error }
    : { message: undefined, stack: undefined, error }

  console.error(`[musicxml] ${event}`, { songId, step, ...details })
}
