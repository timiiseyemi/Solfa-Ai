'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { AudioLines, ChevronRight } from 'lucide-react'
import { Reveal, Waveform } from '@/components/visuals'

type Card = {
  title: string
  image?: string
  featured?: boolean
}

const cards: Card[] = [
  { title: 'Instant staff notation.' },
  { title: 'Tonic sol-fa transcription.', image: '/studio/solfa-featured.png', featured: true },
  { title: 'Personalized AI lessons.' },
  { title: 'Real-time singing feedback.', image: '/studio/solfa-dark.png' },
]

/* Thin geometric line mark, echoing the reference's abstract icons */
function GlyphMark({ variant }: { variant: number }) {
  const common = {
    width: 40,
    height: 40,
    viewBox: '0 0 40 40',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1,
    strokeLinejoin: 'round' as const,
    strokeLinecap: 'round' as const,
  }
  if (variant === 0) {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M20 4 L34 12 V28 L20 36 L6 28 V12 Z" />
        <path d="M20 4 V20 M20 20 L34 12 M20 20 L6 12 M20 20 V36" />
      </svg>
    )
  }
  if (variant === 1) {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M20 5 L33 12.5 V27.5 L20 35 L7 27.5 V12.5 Z" />
        <circle cx="20" cy="20" r="6" />
      </svg>
    )
  }
  if (variant === 2) {
    return (
      <svg {...common} aria-hidden="true">
        <rect x="7" y="7" width="26" height="26" rx="2" transform="rotate(45 20 20)" />
        <path d="M20 9 V31 M9 20 H31" />
      </svg>
    )
  }
  return (
    <svg {...common} aria-hidden="true">
      <path d="M8 14 L20 7 L32 14 L20 21 Z" />
      <path d="M8 14 V26 L20 33 M32 14 V26 L20 33 M20 21 V33" />
    </svg>
  )
}

export function Features() {
  return (
    <section id="features" className="relative bg-[#0a0a10] py-24 text-white sm:py-32">
      {/* ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/3 mx-auto h-72 max-w-3xl rounded-full opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in oklch, var(--gold) 40%, transparent), transparent)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Two-tone centered heading */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="font-display text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-[3.4rem]">
              Tailored to your ear.{' '}
              <span className="text-white/40">Proven in rehearsal.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pretty text-white/55">
              SolfaAI works across staff notation, tonic sol-fa, guided lessons, and live vocal
              feedback — a complete music studio the moment your audio finishes uploading.
            </p>
          </Reveal>
        </div>

        {/* Four tall cards */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={[
                  'group relative flex h-[26rem] flex-col justify-between overflow-hidden rounded-2xl border p-6 transition-[border-color,box-shadow] duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10',
                  c.image && 'theme-on-artwork',
                  c.featured
                    ? 'border-white/10 shadow-[0_0_60px_-15px] shadow-gold/40'
                    : 'border-white/8 bg-white/[0.03]',
                ].join(' ')}
              >
                {/* Background media */}
                {c.image && (
                  <>
                    <Image
                      src={c.image || '/placeholder.svg'}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className={[
                        'scale-[1.08] object-cover transition-transform duration-700 group-hover:scale-[1.13]',
                        c.featured ? 'opacity-90' : 'opacity-60',
                      ].join(' ')}
                    />
                    <div
                      aria-hidden="true"
                      className={[
                        'absolute inset-0',
                        c.featured
                          ? 'bg-gradient-to-t from-[#0c4a6e]/80 via-[#0c4a6e]/10 to-transparent mix-blend-normal'
                          : 'bg-gradient-to-t from-black/90 via-black/40 to-black/20',
                      ].join(' ')}
                    />
                    {c.featured && (
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-sky-500/30 mix-blend-color"
                      />
                    )}
                  </>
                )}

                {/* Icon top-left */}
                <div className="relative z-10 text-white/85">
                  <GlyphMark variant={i} />
                </div>

                {/* Title bottom-left */}
                <h3 className="relative z-10 font-display text-2xl leading-tight tracking-tight text-white">
                  {c.title}
                </h3>
              </motion.article>
            </Reveal>
          ))}
        </div>

        {/* Glowing pill button */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex justify-center">
            <Link
              href="/signin"
              className="group relative inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium tracking-wide text-[#0a0a10] transition-transform hover:scale-[1.03]"
            >
              <span
                aria-hidden="true"
                className="absolute -inset-3 -z-10 rounded-full opacity-60 blur-xl"
                style={{
                  background:
                    'radial-gradient(closest-side, color-mix(in oklch, var(--gold) 70%, white), transparent)',
                }}
              />
              View features
              <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        {/* Studio-grade audio engine — refined banner */}
        <Reveal delay={0.1}>
          <div className="relative mt-16 grid grid-cols-1 items-center gap-10 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-8 sm:p-12 lg:grid-cols-[1fr_1.2fr]">
            {/* ambient corner glows */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full opacity-40 blur-3xl"
              style={{
                background:
                  'radial-gradient(closest-side, color-mix(in oklch, var(--gold) 55%, transparent), transparent)',
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -right-16 size-64 rounded-full opacity-30 blur-3xl"
              style={{
                background:
                  'radial-gradient(closest-side, color-mix(in oklch, #0284c7 45%, transparent), transparent)',
              }}
            />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-gold">
                <AudioLines className="size-3.5" />
                Audio engine
              </span>
              <h3 className="mt-5 font-display text-3xl leading-tight tracking-tight text-white sm:text-4xl">
                Studio-grade listening
              </h3>
              <p className="mt-3 max-w-md leading-relaxed text-white/60">
                Our multi-track model separates voices, detects harmony, and follows tempo changes —
                so even complex choral arrangements are transcribed faithfully.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Voice separation', 'Harmony detection', 'Tempo tracking'].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* waveform panel */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background:
                    'radial-gradient(120% 80% at 50% 120%, color-mix(in oklch, var(--gold) 22%, transparent), transparent)',
                }}
              />
              <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-3 text-xs text-white/45">
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 animate-pulse rounded-full bg-gold" />
                  Analyzing
                </span>
                <span className="font-mono tabular-nums">00:42 / 03:18</span>
              </div>
              <div className="relative h-40 px-5">
                <Waveform bars={56} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
