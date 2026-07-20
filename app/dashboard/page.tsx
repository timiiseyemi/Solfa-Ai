import Link from 'next/link'
import { ArrowRight, BookOpen, FileMusic, Music2, Sparkles } from 'lucide-react'
import { redirect } from 'next/navigation'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { GreetingHeader } from '@/components/dashboard/greeting-header'
import { DashboardPageLayout } from '@/components/dashboard/dashboard-page-layout'
import { DashboardStat } from '@/components/dashboard/dashboard-stat'
import { SongCard } from '@/components/dashboard/song-card'
import { DashboardUploadCard } from '@/components/upload/DashboardUploadCard'
import { FlaticonMusicIcon } from '@/components/ui/flaticon-music-icon'
import { calculateDashboardMetrics, dashboardUserFromAuth, lessonHref, loadDashboardSongs } from '@/lib/dashboard/data'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const [songs] = await Promise.all([loadDashboardSongs(supabase, user.id)])
  const dashboardUser = dashboardUserFromAuth(user)
  const recentSongs = songs.slice(0, 3)
  const latestLesson = songs.find((song) => song.hasLesson)
  const metrics = calculateDashboardMetrics(songs)

  return (
    <DashboardPageLayout user={dashboardUser}>
          <GreetingHeader firstName={dashboardUser.firstName} />

          <div id="upload"><DashboardUploadCard /></div>

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <section id="songs">
              <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold tracking-tight text-white">Recent Songs</h2>{recentSongs.length > 0 ? <Link href="/songs" className="text-xs font-medium text-blue-200 transition hover:text-white">View all</Link> : <FlaticonMusicIcon name="note" className="size-5 opacity-60" />}</div>
              {recentSongs.length > 0 ? <div className="space-y-3">{recentSongs.map((song) => <SongCard key={song.id} song={song} compact />)}</div> : <DashboardEmptyState iconSrc="/icon/1.png" title="No songs yet" description="Upload your first recording to begin building your music library." highlights={[{ icon: FileMusic, label: 'Staff notation' }, { icon: Music2, label: 'Tonic sol-fa' }]} action={{ href: '#upload', label: 'Upload Song' }} />}
            </section>
            <section id="learn">
              <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold tracking-tight text-white">Continue Learning</h2><FlaticonMusicIcon name="sheet" className="size-5 opacity-70" /></div>
              {latestLesson ? <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><p className="kicker text-blue-200">Latest lesson</p><h3 className="mt-2 truncate text-lg font-semibold tracking-tight text-white">{latestLesson.title}</h3><p className="mt-2 text-sm text-white/50">{latestLesson.difficulty ?? 'Difficulty pending'} · Your lesson is ready to continue.</p><div className="mt-5 flex items-center justify-between"><span className="text-xs text-white/40">Progress · Ready to begin</span><Link href={lessonHref(latestLesson.id)} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#2563eb] px-3.5 text-xs font-medium text-white transition hover:scale-[1.02] hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/20">Resume <ArrowRight className="size-3.5" /></Link></div></div> : <DashboardEmptyState iconSrc="/icon/2.png" title="Your next lesson starts here" description="Complete an analysis to unlock a tailored practice plan for your song." highlights={[{ icon: Sparkles, label: 'Personalized lessons' }, { icon: BookOpen, label: 'Guided practice' }]} action={{ href: '#upload', label: 'Upload a recording' }} />}
            </section>
          </div>

          <section className="mt-12">
            <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold tracking-tight text-white">Progress</h2><FlaticonMusicIcon name="streak" className="size-5 opacity-80" /></div>
            <div className="grid gap-4 sm:grid-cols-3">
              <DashboardStat iconSrc="/icon/4.png" label="Songs analyzed" value={String(metrics.songsAnalyzed)} detail={metrics.songsAnalyzed ? 'Transcriptions ready' : 'Upload a recording to begin'} />
              <DashboardStat iconSrc="/icon/3.png" label="Lessons completed" value={String(metrics.lessonsCompleted)} detail={metrics.lessonsCompleted ? 'Personalized lessons ready' : 'Your first lesson will appear here'} />
              <DashboardStat iconSrc="/icon/5.png" label="Practice streak" value={metrics.practiceStreak} detail="Practice tracking coming soon" />
              <DashboardStat iconSrc="/icon/frequency.png" label="Average BPM" value={metrics.averageBpm} detail="Across analyzed songs" />
              <DashboardStat iconSrc="/icon/sol.png" label="Most common key" value={metrics.mostCommonKey} detail="Across analyzed songs" />
              <DashboardStat iconSrc="/icon/speedometer.png" label="Average difficulty" value={metrics.averageDifficulty} detail="Based on completed analyses" />
            </div>
          </section>
    </DashboardPageLayout>
  )
}
