'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Music4, ScrollText, GraduationCap, AudioLines } from 'lucide-react'
import { Reveal, SectionHeader, StaffNotation, Waveform } from '@/components/visuals'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'notation', label: 'Staff notation', icon: Music4 },
  { id: 'solfa', label: 'Tonic sol-fa', icon: ScrollText },
  { id: 'lesson', label: 'AI lesson', icon: GraduationCap },
  { id: 'feedback', label: 'Live feedback', icon: AudioLines },
] as const

type TabId = (typeof tabs)[number]['id']

const solfa = [
  ['d', 'r', 'm', 'f', 's', 'l', 't', 'd'],
  ['s', 'm', 'd', 'r', 'm', 'r', 'd', '—'],
]

export function ProductPreview() {
  const [active, setActive] = useState<TabId>('notation')

  return (
    <section id="preview" className="relative overflow-hidden py-24 sm:py-32">
      {/* soft ambient accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/4 size-96 rounded-full opacity-[0.12] blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in oklch, var(--gold) 80%, transparent), transparent)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          index="02"
          kicker="The output"
          title={
            <>
              One upload, <span className="italic text-gold">four</span> beautiful outputs
            </>
          }
          lede="Explore what SolfaAI produces from a single recording. Switch between views the same way your students will."
        />

        <Reveal delay={0.1}>
          <div className="mt-12 overflow-hidden rounded-[28px] border border-border/60 bg-card/70 shadow-2xl shadow-foreground/[0.06] backdrop-blur">
            {/* window chrome */}
            <div className="flex items-center gap-2 border-b border-border/60 bg-secondary/40 px-5 py-3">
              <span className="size-3 rounded-full bg-destructive/40" />
              <span className="size-3 rounded-full bg-gold/50" />
              <span className="size-3 rounded-full bg-sage/50" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">
                ave_maria.mp3 — transcribed
              </span>
            </div>

            {/* tab bar */}
            <div className="flex flex-wrap gap-1 border-b border-border/60 bg-secondary/20 p-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={cn(
                    'relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    active === t.id
                      ? 'text-gold-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {active === t.id && (
                    <motion.span
                      layoutId="preview-tab"
                      className="absolute inset-0 -z-10 rounded-full bg-gold"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <t.icon className="size-4" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* panels */}
            <div className="min-h-[340px] p-6 sm:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {active === 'notation' && (
                    <div className="rounded-2xl border border-border/50 bg-background/70 p-6 text-foreground">
                      <StaffNotation />
                      <StaffNotation className="mt-2" />
                    </div>
                  )}

                  {active === 'solfa' && (
                    <div className="space-y-4">
                      {solfa.map((line, li) => (
                        <div key={li} className="flex flex-wrap gap-2">
                          {line.map((s, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: (li * 8 + i) * 0.03 }}
                              className="flex size-12 items-center justify-center rounded-xl border border-gold/25 bg-gold/5 text-xl font-semibold italic text-gold"
                            >
                              {s}
                            </motion.span>
                          ))}
                        </div>
                      ))}
                      <p className="pt-2 text-sm text-muted-foreground">
                        Movable-do notation, ready to project for your choir.
                      </p>
                    </div>
                  )}

                  {active === 'lesson' && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        { step: 'Warm-up', body: 'Sing the tonic triad d–m–s ascending and descending.' },
                        { step: 'Interval drill', body: 'Isolate the leap from s up to d′ at bar 3.' },
                        { step: 'Phrasing', body: 'Breathe before "gratia" to sustain the long line.' },
                        { step: 'Performance', body: 'Full run at 72 BPM with dynamic swell to mf.' },
                      ].map((c, i) => (
                        <div
                          key={i}
                          className="rounded-2xl border border-border/50 bg-background/70 p-5 transition-colors hover:border-gold/40"
                        >
                          <span className="text-xs font-medium uppercase tracking-wide text-gold">
                            Step {i + 1}
                          </span>
                          <h4 className="mt-1 text-xl font-semibold text-foreground">{c.step}</h4>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                            {c.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {active === 'feedback' && (
                    <div className="space-y-6">
                      <div className="relative h-28 overflow-hidden rounded-2xl border border-border/50 bg-background/70 px-4">
                        <Waveform bars={52} />
                      </div>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {[
                          { k: 'Pitch accuracy', v: '96%' },
                          { k: 'Timing', v: 'On beat' },
                          { k: 'Breath control', v: 'Strong' },
                          { k: 'Vibrato', v: 'Balanced' },
                        ].map((m) => (
                          <div
                            key={m.k}
                            className="rounded-2xl border border-border/50 bg-background/70 p-4 text-center"
                          >
                            <p className="text-2xl font-semibold text-foreground">{m.v}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{m.k}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
