'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { SongCard } from '@/components/dashboard/song-card'
import type { DashboardSong } from '@/lib/dashboard/data'

export function SongsLibrary({ songs }: { songs: DashboardSong[] }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const filteredSongs = useMemo(() => songs.filter((song) => {
    const matchesQuery = song.title.toLowerCase().includes(query.trim().toLowerCase())
    const matchesStatus = status === 'all' || song.status === status
    return matchesQuery && matchesStatus
  }), [query, songs, status])

  if (!songs.length) return <DashboardEmptyState iconSrc="/icon/1.png" title="No songs analyzed yet" description="Your music library will grow here after you upload your first recording." action={{ href: '/dashboard#upload', label: 'Upload Song' }} />

  return <>
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <label className="flex h-11 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 text-white/50 focus-within:border-blue-300/35 focus-within:ring-4 focus-within:ring-blue-400/10"><Search className="size-4" /><span className="sr-only">Search songs</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your songs" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30" /></label>
      <label className="flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 text-sm text-white/60"><SlidersHorizontal className="size-4 text-blue-200" /><span className="sr-only">Filter by status</span><select value={status} onChange={(event) => setStatus(event.target.value)} className="bg-transparent text-sm text-white outline-none"><option value="all" className="bg-[#171722]">All statuses</option><option value="uploaded" className="bg-[#171722]">Uploaded</option><option value="transcribing" className="bg-[#171722]">Processing</option><option value="transcribed" className="bg-[#171722]">Ready</option><option value="failed" className="bg-[#171722]">Failed</option></select></label>
    </div>
    {filteredSongs.length ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{filteredSongs.map((song) => <SongCard key={song.id} song={song} />)}</div> : <DashboardEmptyState title="No matching songs" description="Try a different title or status filter to find what you need." />}
  </>
}
