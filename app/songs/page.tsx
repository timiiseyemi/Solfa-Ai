import { Music2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import { DashboardPageLayout } from '@/components/dashboard/dashboard-page-layout'
import { SongsLibrary } from '@/components/dashboard/songs-library'
import { dashboardUserFromAuth, loadDashboardSongs } from '@/lib/dashboard/data'
import { createClient } from '@/lib/supabase/server'

export default async function SongsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')
  const songs = await loadDashboardSongs(supabase, user.id)
  return <DashboardPageLayout user={dashboardUserFromAuth(user)}><header className="mb-8"><p className="kicker text-blue-200">Music library</p><div className="mt-3 flex items-end justify-between gap-4"><div><h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Your songs</h1><p className="mt-3 text-sm text-white/50">Every upload, analysis, and learning path in one place.</p></div><Music2 className="mb-1 size-5 text-white/25" /></div></header><SongsLibrary songs={songs} /></DashboardPageLayout>
}
