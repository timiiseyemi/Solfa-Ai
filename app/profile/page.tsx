import { CircleUserRound } from 'lucide-react'
import { redirect } from 'next/navigation'
import { DashboardPageLayout } from '@/components/dashboard/dashboard-page-layout'
import { ProfileEditor } from '@/components/dashboard/profile-editor'
import { calculateDashboardMetrics, dashboardUserFromAuth, loadDashboardSongs } from '@/lib/dashboard/data'
import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')
  const songs = await loadDashboardSongs(supabase, user.id)
  const dashboardUser = dashboardUserFromAuth(user)
  const metrics = calculateDashboardMetrics(songs)
  const joined = dashboardUser.joinedAt ? new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(dashboardUser.joinedAt)) : 'Recently'
  return <DashboardPageLayout user={dashboardUser}><header className="mb-8"><p className="kicker text-blue-200">Account</p><div className="mt-3 flex items-end justify-between gap-4"><div><h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Your profile</h1><p className="mt-3 text-sm text-white/50">A member of SolfaAI since {joined}.</p></div><CircleUserRound className="mb-1 size-5 text-white/25" /></div></header><ProfileEditor user={dashboardUser} songsAnalyzed={metrics.songsAnalyzed} lessonsCompleted={metrics.lessonsCompleted} practiceStreak={metrics.practiceStreak} /></DashboardPageLayout>
}
