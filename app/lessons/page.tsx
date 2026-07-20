import { BookOpen } from 'lucide-react'
import { redirect } from 'next/navigation'
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state'
import { DashboardPageLayout } from '@/components/dashboard/dashboard-page-layout'
import { LessonCard } from '@/components/dashboard/lesson-card'
import { dashboardUserFromAuth, loadDashboardSongs } from '@/lib/dashboard/data'
import { createClient } from '@/lib/supabase/server'

export default async function LessonsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')
  const lessons = (await loadDashboardSongs(supabase, user.id)).filter((song) => song.hasLesson)
  return <DashboardPageLayout user={dashboardUserFromAuth(user)}><header className="mb-8"><p className="kicker text-blue-200">Guided practice</p><div className="mt-3 flex items-end justify-between gap-4"><div><h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">AI Lessons</h1><p className="mt-3 text-sm text-white/50">Personalized practice paths built from your completed analyses.</p></div><BookOpen className="mb-1 size-5 text-white/25" /></div></header>{lessons.length ? <div className="grid gap-3 md:grid-cols-2">{lessons.map((song) => <LessonCard key={song.id} song={song} />)}</div> : <DashboardEmptyState iconSrc="/icon/2.png" title="Your first AI lesson will appear here" description="Upload a recording and SolfaAI will turn its melody into a focused practice plan." action={{ href: '/dashboard#upload', label: 'Upload a recording' }} />}</DashboardPageLayout>
}
