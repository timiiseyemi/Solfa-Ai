'use client'

import Link from 'next/link'
import { BookOpen, CircleUserRound, LayoutGrid, Menu, Music2, Settings, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { ProfileDropdown } from './profile-dropdown'
import { SidebarToggle } from './sidebar-toggle'
import type { DashboardUser } from './dashboard-user'

const navigation = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { label: 'Songs', href: '/songs', icon: Music2 },
  { label: 'AI Lessons', href: '/lessons', icon: BookOpen },
  { label: 'Profile', href: '/profile', icon: CircleUserRound },
]

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function Navigation({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Dashboard navigation" className="flex flex-col gap-1">
      {navigation.map(({ label, href, icon: Icon }) => {
        const active = isActivePath(pathname, href)
        return (
          <Link key={label} href={href} onClick={onNavigate} aria-current={active ? 'page' : undefined} className={cn('group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200', collapsed && 'justify-center px-2', active ? 'bg-blue-400/10 text-blue-100 shadow-sm shadow-black/10' : 'text-white/50 hover:bg-white/[0.05] hover:text-white/85')}>
            <Icon className="size-4 shrink-0" />
            <span className={cn('origin-left overflow-hidden whitespace-nowrap transition-all duration-200', collapsed ? 'w-0 scale-95 opacity-0' : 'w-auto scale-100 opacity-100')}>{label}</span>
            {collapsed && <span className="pointer-events-none absolute left-[calc(100%+0.75rem)] z-30 rounded-md border border-white/10 bg-[#171722] px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">{label}</span>}
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarContent({ user, collapsed, onToggle, onNavigate, mobile = false }: { user: DashboardUser; collapsed: boolean; onToggle?: () => void; onNavigate?: () => void; mobile?: boolean }) {
  return <>
    <div className={cn('flex items-center', collapsed ? 'justify-center' : 'justify-between')}>
      <Link href="/" onClick={onNavigate} aria-label="SolfaAI home" className="group relative flex items-center gap-2.5 overflow-hidden">
        <img src="/brand/solfaai-app-icon.svg" alt="" className="size-9 shrink-0 rounded-xl object-cover" />
        <span className={cn('font-serif text-xl tracking-tight text-white transition-all duration-200', collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100')}>Solfa<span className="text-blue-400">AI</span></span>
      </Link>
      {onToggle && <SidebarToggle collapsed={collapsed} onClick={onToggle} />}
    </div>
    <div className="mt-10"><Navigation collapsed={collapsed && !mobile} onNavigate={onNavigate} /></div>
    <div className="mt-auto border-t border-white/10 pt-4">
      <Link href="/settings" onClick={onNavigate} className={cn('group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 transition-all duration-200 hover:bg-white/[0.05] hover:text-white/85', collapsed && !mobile && 'justify-center px-2')}><Settings className="size-4 shrink-0" /><span className={cn('overflow-hidden whitespace-nowrap transition-all duration-200', collapsed && !mobile ? 'w-0 opacity-0' : 'w-auto opacity-100')}>Settings</span></Link>
      <div className="mt-3"><ProfileDropdown user={user} collapsed={collapsed && !mobile} /></div>
    </div>
  </>
}

export function DashboardSidebar({ user }: { user: DashboardUser }) {
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [storageReady, setStorageReady] = useState(false)

  useEffect(() => {
    setCollapsed(window.localStorage.getItem('solfaai-sidebar-collapsed') === 'true')
    setStorageReady(true)
  }, [])

  useEffect(() => {
    if (!storageReady) return
    window.localStorage.setItem('solfaai-sidebar-collapsed', String(collapsed))
  }, [collapsed, storageReady])

  useEffect(() => {
    if (!drawerOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = originalOverflow }
  }, [drawerOpen])

  return <>
    <aside className={cn('hidden min-h-screen shrink-0 flex-col border-r border-white/10 bg-[#0c0c16] px-4 py-5 transition-[width] duration-300 ease-out xl:flex', collapsed ? 'w-20' : 'w-[260px]')}>
      <SidebarContent user={user} collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
    </aside>

    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0c0c16] px-4 xl:hidden">
      <Link href="/" className="flex items-center gap-2" aria-label="SolfaAI home"><img src="/brand/solfaai-app-icon.svg" alt="" className="size-8 rounded-lg object-cover" /><span className="font-serif text-lg tracking-tight text-white">Solfa<span className="text-blue-400">AI</span></span></Link>
      <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation" className="flex size-9 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"><Menu className="size-5" /></button>
    </header>

    <AnimatePresence>
      {drawerOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-50 xl:hidden"><button type="button" aria-label="Close navigation" onClick={() => setDrawerOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" /><motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 280, damping: 30 }} className="relative flex h-full w-[min(18rem,calc(100%-3rem))] flex-col bg-[#0c0c16] px-4 py-5 shadow-2xl shadow-black/50"><div className="absolute right-3 top-3"><button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close navigation" className="flex size-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"><X className="size-5" /></button></div><SidebarContent user={user} collapsed={false} mobile onNavigate={() => setDrawerOpen(false)} /></motion.aside></motion.div>}
    </AnimatePresence>
  </>
}
