'use client'

import { LogOut } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOutLocally } from '@/lib/supabase/auth'
import { cn } from '@/lib/utils'
import { getInitials, type DashboardUser } from './dashboard-user'
import { ThemeSwitcher } from '@/components/theme-switcher'

export function ProfileDropdown({ user, collapsed }: { user: DashboardUser; collapsed: boolean }) {
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const signOut = async () => {
    setSigningOut(true)
    setLogoutError(null)
    const result = await signOutLocally()
    if (result.error) {
      setLogoutError(result.error)
      setSigningOut(false)
      return
    }
    router.replace('/')
    router.refresh()
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn('group flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400', collapsed && 'justify-center')}
      >
        <Avatar user={user} />
        <span className={cn('min-w-0 flex-1 transition-all duration-200', collapsed ? 'w-0 opacity-0' : 'opacity-100')}>
          <span className="block truncate text-sm font-medium text-white/85">{user.fullName}</span>
          <span className="mt-0.5 block truncate text-xs text-white/40">{user.email}</span>
        </span>
        {collapsed && <span className="pointer-events-none absolute bottom-1 left-[calc(100%+0.75rem)] z-30 rounded-md border border-white/10 bg-[#171722] px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">Profile</span>}
      </button>

      {open && (
        <div role="menu" aria-label="Profile menu" className={cn('absolute bottom-full z-40 mb-2 w-56 rounded-xl border border-white/10 bg-[#171722] p-1.5 shadow-2xl shadow-black/35', collapsed ? 'left-0' : 'inset-x-0')}>
          <ThemeSwitcher />
          <div className="my-1 border-t border-white/10" />
          <button role="menuitem" type="button" onClick={signOut} disabled={signingOut} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-200 transition-colors hover:bg-red-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/50 disabled:opacity-50"><LogOut className="size-4" />{signingOut ? 'Logging out…' : 'Logout'}</button>
          {logoutError && <p role="alert" className="px-3 pb-1 pt-2 text-xs text-red-200">{logoutError}</p>}
        </div>
      )}
    </div>
  )
}

function Avatar({ user }: { user: DashboardUser }) {
  if (user.avatarUrl) return <img src={user.avatarUrl} alt="" className="size-9 shrink-0 rounded-full object-cover" />
  return <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-400/15 text-xs font-semibold text-blue-100">{getInitials(user.fullName)}</span>
}
