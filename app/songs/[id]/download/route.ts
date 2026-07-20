import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { transcriptionStoragePaths } from '@/lib/ai/transcription/basicPitch'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const { data: song } = await supabase.from('songs').select('id, original_filename').eq('id', id).eq('user_id', user.id).maybeSingle()
  if (!song) return new NextResponse('Not found', { status: 404 })

  const { midiPath } = transcriptionStoragePaths(user.id, id)
  const { data, error } = await supabase.storage.from('songs').download(midiPath)
  if (error || !data) return new NextResponse('MIDI is not available yet.', { status: 404 })

  const filename = song.original_filename.replace(/\.[^.]+$/, '') || 'solfaai-transcription'
  return new NextResponse(await data.arrayBuffer(), {
    headers: {
      'Content-Type': 'audio/midi',
      'Content-Disposition': `attachment; filename="${filename}.mid"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
