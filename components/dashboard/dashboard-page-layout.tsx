import type { ReactNode } from 'react'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import type { DashboardUser } from '@/components/dashboard/dashboard-user'

export function DashboardPageLayout({ user, children, maxWidth = 'max-w-6xl' }: { user: DashboardUser; children: ReactNode; maxWidth?: string }) {
  return <main className="min-h-screen bg-[#0a0a10] text-white xl:flex"><DashboardSidebar user={user} /><section className="min-w-0 flex-1 px-4 py-10 sm:px-8 sm:py-12 lg:px-12"><div className={`mx-auto ${maxWidth}`}>{children}</div></section></main>
}
