'use client'

import { Moon, Sun } from 'lucide-react'
import { LayoutGroup, motion } from 'motion/react'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'

const options = [
  { value: 'light' as const, label: 'Use light mode', icon: Sun },
  { value: 'dark' as const, label: 'Use dark mode', icon: Moon },
]

/** A compact two-theme control for the public site header. */
export function LandingThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <LayoutGroup>
      <div className={cn('flex items-center gap-1 rounded-full border border-border/70 bg-card/75 p-1 shadow-sm backdrop-blur-md', className)} aria-label="Color theme">
        {options.map(({ value, label, icon: Icon }) => {
          const active = resolvedTheme === value
          return (
            <motion.button
              key={value}
              type="button"
              whileTap={{ scale: 0.92 }}
              aria-label={label}
              aria-pressed={active}
              onClick={() => setTheme(value)}
              className="relative flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {active && <motion.span layoutId="landing-theme-indicator" className="absolute inset-0 rounded-full bg-primary shadow-sm" transition={{ type: 'spring', stiffness: 460, damping: 32 }} />}
              <motion.span animate={{ scale: active ? 1 : 0.82, opacity: active ? 1 : 0.7 }} transition={{ duration: 0.18 }} className={cn('relative size-2.5 rounded-full', value === 'light' ? 'bg-white ring-1 ring-black/10' : 'bg-[#151638] ring-1 ring-white/20')} />
              <Icon className="sr-only" />
            </motion.button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
