import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { formatSongDate, type DashboardSong } from '@/lib/dashboard/data'

export function SongCard({ song, compact = false }: { song: DashboardSong; compact?: boolean }) {
  return <Link href={`/songs/${song.id}`} className="group flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-300/25 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-black/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/20"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-400/10"><img src="/icon/music.png" alt="" aria-hidden="true" className="size-5 object-contain" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-white/90">{song.title}</span><span className="mt-1 block truncate text-xs text-white/45">{formatSongDate(song.createdAt)} · {statusLabel(song.status)}</span>{!compact && <span className="mt-2 flex flex-wrap gap-1.5">{song.difficulty && <Tag>{song.difficulty}</Tag>}{song.estimatedKey && <Tag>{song.estimatedKey}</Tag>}{song.estimatedBpm && <Tag>{song.estimatedBpm} BPM</Tag>}</span>}</span><ChevronRight className="size-4 shrink-0 text-white/25 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-200" /></Link>
}

export function SongStatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase()
  const tone = normalized === 'transcribed' || normalized === 'ready' ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100' : normalized === 'failed' ? 'border-red-300/20 bg-red-300/10 text-red-100' : 'border-white/10 bg-white/[0.05] text-white/60'
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[0.68rem] font-medium ${tone}`}>{statusLabel(status)}</span>
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[0.65rem] text-white/50">{children}</span>
}

function statusLabel(status: string) {
  if (status === 'transcribed' || status === 'ready') return 'Ready'
  return status.charAt(0).toUpperCase() + status.slice(1)
}
