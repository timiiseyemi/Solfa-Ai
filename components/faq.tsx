'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { Reveal } from '@/components/visuals'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'What audio formats can I upload?',
    a: 'SolfaAI accepts MP3, WAV, M4A, and FLAC files, as well as direct recordings from your microphone. Full multi-part arrangements are supported.',
  },
  {
    q: 'How accurate is the notation?',
    a: 'Our audio engine achieves conservatory-grade accuracy on melody, key, and rhythm. Complex harmony is transcribed faithfully, and every score is fully editable if you want to fine-tune a passage.',
  },
  {
    q: 'Do I need to read music to use it?',
    a: 'Not at all. Tonic sol-fa and guided lessons make SolfaAI approachable for complete beginners, while staff notation and exports serve advanced musicians and educators.',
  },
  {
    q: 'Can my whole choir or class use one account?',
    a: 'Yes. The Institution plan includes unlimited seats and sections, shared repertoire libraries, and per-voice sol-fa parts so every member gets exactly what they need.',
  },
  {
    q: 'How does real-time feedback work?',
    a: 'Sing along in your browser and SolfaAI analyzes your pitch, timing, and breath in real time, highlighting each note as you sing and offering gentle corrections.',
  },
  {
    q: 'Is there a free plan?',
    a: 'Absolutely. The Student plan is free forever and includes five uploads per month with notation, sol-fa, and real-time pitch feedback.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      id="faq"
      className="relative overflow-hidden py-24 text-white sm:py-32"
    >
      <div
        aria-hidden="true"
        className="dark-only-fade pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#0a0a10] sm:h-48"
      />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-balance text-white sm:text-5xl">
              Everything you need to know about SolfaAI
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mx-auto mt-5 max-w-md text-pretty leading-relaxed text-white/55">
              Get clear, concise answers about notation, lessons, and how SolfaAI helps every
              musician move forward.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <div
                  className={cn(
                    'overflow-hidden rounded-xl border transition-colors',
                    isOpen
                      ? 'border-white/15 bg-white/[0.05]'
                      : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]',
                  )}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-medium text-white/90">{f.q}</span>
                    <span
                      className={cn(
                        'flex size-6 shrink-0 items-center justify-center text-white/50 transition-transform duration-300',
                        isOpen && 'rotate-45 text-white',
                      )}
                    >
                      <Plus className="size-5" strokeWidth={1.5} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-6 pb-5 leading-relaxed text-white/55">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
