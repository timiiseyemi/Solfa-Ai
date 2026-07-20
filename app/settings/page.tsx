import { Settings } from 'lucide-react'
import { redirect } from 'next/navigation'
import { DashboardPageLayout } from '@/components/dashboard/dashboard-page-layout'
import { SettingsPanel } from '@/components/dashboard/settings-panel'
import { dashboardUserFromAuth } from '@/lib/dashboard/data'
import { createClient } from '@/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')
  const dashboardUser = dashboardUserFromAuth(user)
  return <DashboardPageLayout user={dashboardUser} maxWidth="max-w-4xl"><header className="mb-8"><p className="kicker text-blue-200">Workspace</p><div className="mt-3 flex items-end justify-between gap-4"><div><h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Settings</h1><p className="mt-3 text-sm text-white/50">Shape SolfaAI around the way you learn and practice.</p></div><Settings className="mb-1 size-5 text-white/25" /></div></header><SettingsPanel email={dashboardUser.email} /></DashboardPageLayout>
}
