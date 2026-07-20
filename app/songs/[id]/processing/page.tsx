import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProcessingExperience } from '@/components/songs/ProcessingExperience'

export default async function SongProcessingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) notFound()

  const { data: song } = await supabase
    .from('songs')
    .select('id, original_filename, storage_path, status')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!song) notFound()

  return <ProcessingExperience songId={song.id} fileName={song.original_filename} storagePath={song.storage_path} />
}
