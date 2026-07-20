import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { formatSongDate, lessonHref, type DashboardSong } from '@/lib/dashboard/data'
import { FlaticonMusicIcon } from '@/components/ui/flaticon-music-icon'

export function LessonCard({ song }: { song: DashboardSong }) {
  return <Link href={lessonHref(song.id)} className="group flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-blue-300/25 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-black/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/20"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-400/10"><FlaticonMusicIcon name="sheet" className="size-5" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-white/90">{song.title}</span><span className="mt-1 block truncate text-xs text-white/45">{song.difficulty ?? 'Difficulty pending'} · {formatSongDate(song.lessonGeneratedAt ?? song.createdAt)}</span><span className="mt-2 block text-xs text-blue-200/85">Personalized practice · {song.estimatedKey ?? 'Key pending'} · ~20 min</span></span><ArrowUpRight className="size-4 shrink-0 text-white/25 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-200" /></Link>
}
