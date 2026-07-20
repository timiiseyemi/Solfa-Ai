'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTheme, type Theme } from './theme-provider'
import { cn } from '@/lib/utils'

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export function ThemeSwitcher() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const ActiveIcon = resolvedTheme === 'dark' ? Moon : Sun

  return (
    <div className="theme-switcher px-1.5 py-1" aria-label="Theme preference">
      <div className="flex items-center justify-between px-1.5 pb-1.5 text-xs">
        <span>Theme</span>
        <span className="theme-switcher-icon relative flex size-4 items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={resolvedTheme} initial={{ opacity: 0, rotate: -35, scale: 0.7 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 35, scale: 0.7 }} transition={{ duration: 0.18 }}><ActiveIcon className="size-3.5" /></motion.span>
          </AnimatePresence>
        </span>
      </div>
      <div className="theme-switcher-options grid grid-cols-3 gap-1 rounded-lg p-1">
        {options.map(({ value, label, icon: Icon }) => (
          <button key={value} type="button" onClick={() => setTheme(value)} aria-pressed={theme === value} data-active={theme === value} className="theme-switcher-option flex min-h-8 items-center justify-center gap-1 rounded-md px-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
            <Icon className="size-3" />{label}
          </button>
        ))}
      </div>
    </div>
  )
}
