'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { AuthShell } from './auth-shell'

const authPaths = new Set([
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/email-sent',
])

export function AuthRouteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (!authPaths.has(pathname)) return <>{children}</>

  return <AuthShell mode={pathname === '/signup' ? 'signup' : 'signin'}>{children}</AuthShell>
}
