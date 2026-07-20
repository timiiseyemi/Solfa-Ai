'use client'

import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import Image from 'next/image'
import { Reveal } from '@/components/visuals'

const points = [
  'Instant pitch, rhythm, and tone feedback as you sing',
  'Guided sol-fa exercises for audiobooks of repertoire',
  'Adaptive coaching for students, teachers, and choirs',
]

export function Benefits() {
  return (
    <section id="benefits" className="relative bg-background py-24 text-white sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-6 sm:p-10 lg:p-14">
            <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[5/4] overflow-hidden rounded-3xl"
              >
                <Image
                  src="/studio/vocal-booth-v2.png"
                  alt="Vocalist wearing headphones singing from a music stand in an acoustic recording booth"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 560px"
                />
              </motion.div>

              {/* Content */}
              <div>
                <h2 className="font-display text-4xl leading-[1.05] text-white sm:text-5xl">
                  feedback that feels{' '}
                  <span className="italic text-gold">human</span>
                </h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-white/55">
                  Realistic AI listening that hears tone, pitch, and nuance just like a patient
                  teacher sitting right beside you.
                </p>

                {/* Button with gradient glow */}
                <div className="relative mt-8 inline-block">
                  <span
                    aria-hidden
                    className="absolute -inset-x-6 -bottom-3 top-1/2 rounded-full opacity-70 blur-xl"
                    style={{
                      background:
                        'linear-gradient(90deg, oklch(0.6 0.18 20), oklch(0.55 0.16 300), oklch(0.6 0.14 240))',
                    }}
                  />
                  <a
                    href="/signin"
                    className="relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-[oklch(0.16_0.01_60)] px-7 py-3.5 font-mono text-xs uppercase tracking-widest text-white transition-colors hover:bg-[oklch(0.2_0.01_60)]"
                  >
                    Listen now
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </a>
                </div>

                {/* Checklist pills */}
                <ul className="mt-12 space-y-3">
                  {points.map((p, i) => (
                    <motion.li
                      key={p}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                      className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3"
                    >
                      <span
                        className="flex size-6 shrink-0 items-center justify-center rounded-full text-white"
                        style={{
                          background:
                            'linear-gradient(135deg, oklch(0.72 0.16 350), oklch(0.6 0.16 300))',
                        }}
                      >
                        <Check className="size-3.5" strokeWidth={3} />
                      </span>
                      <span className="text-sm leading-relaxed text-white/75">{p}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
