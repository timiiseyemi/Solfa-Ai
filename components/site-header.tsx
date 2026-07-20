'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LandingThemeToggle } from '@/components/landing-theme-toggle'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Preview', href: '#preview' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <img src="/brand/solfaai-app-icon.svg" alt="" aria-hidden="true" className="size-full rounded-[inherit] object-cover" />
      </span>
      <span className="font-serif text-xl tracking-tight text-foreground">
        Solfa<span className="text-gold">AI</span>
      </span>
    </a>
  )
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      data-site-header
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <div
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 sm:px-5',
          scrolled ? 'glass border border-border/60 shadow-sm' : 'border border-transparent',
        )}
      >
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LandingThemeToggle />
          <Button render={<Link href="/signin" />} variant="ghost" className="rounded-full text-sm">
            Sign in
          </Button>
          <Button render={<Link href="/signin" />} className="rounded-full bg-primary text-sm text-primary-foreground hover:bg-primary/90">
            Start free
          </Button>
        </div>

        <button
          className="flex size-9 items-center justify-center rounded-full text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mx-auto mt-2 max-w-6xl rounded-3xl border border-border/60 p-4 md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm text-foreground hover:bg-accent"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex justify-center py-1"><LandingThemeToggle /></div>
              <Button render={<Link href="/signin" />} variant="outline" className="rounded-full">
                Sign in
              </Button>
              <Button render={<Link href="/signin" />} className="rounded-full bg-primary text-primary-foreground">Start free</Button>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  )
}
