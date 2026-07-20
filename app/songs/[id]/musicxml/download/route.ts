import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const { data: song } = await supabase
    .from('songs')
    .select('original_filename, musicxml_path, notation_status')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!song || song.notation_status !== 'ready' || !song.musicxml_path) {
    return new NextResponse('MusicXML is not available yet.', { status: 404 })
  }

  const { data, error } = await supabase.storage.from('songs').download(song.musicxml_path)
  if (error || !data) return new NextResponse('MusicXML is not available yet.', { status: 404 })

  const baseName = song.original_filename.replace(/\.[^.]+$/, '') || 'solfaai-sheet-music'
  const filename = `${baseName.replace(/[\\"\r\n]/g, '')}.musicxml`
  return new NextResponse(await data.arrayBuffer(), {
    headers: {
      'Content-Type': 'application/vnd.recordare.musicxml+xml',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
