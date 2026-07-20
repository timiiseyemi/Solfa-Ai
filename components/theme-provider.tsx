'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = Exclude<Theme, 'system'>

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const storageKey = 'solfaai-theme'

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(resolvedTheme)
  root.dataset.theme = theme
  root.classList.add('theme-transition')
  window.setTimeout(() => root.classList.remove('theme-transition'), 260)
  return resolvedTheme
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark')

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(storageKey)
    const nextTheme: Theme = savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system'
      ? savedTheme
      : 'system'
    setThemeState(nextTheme)
    setResolvedTheme(applyTheme(nextTheme))
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const syncSystemTheme = () => {
      if (theme === 'system') setResolvedTheme(applyTheme('system'))
    }
    mediaQuery.addEventListener('change', syncSystemTheme)
    return () => mediaQuery.removeEventListener('change', syncSystemTheme)
  }, [theme])

  const setTheme = (nextTheme: Theme) => {
    window.localStorage.setItem(storageKey, nextTheme)
    setThemeState(nextTheme)
    setResolvedTheme(applyTheme(nextTheme))
  }

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}

export const themeInitScript = `(() => { try { const key = '${storageKey}'; const stored = localStorage.getItem(key); const theme = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'; const resolved = theme === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme; const root = document.documentElement; root.classList.remove('light', 'dark'); root.classList.add(resolved); root.dataset.theme = theme; } catch {} })()`
