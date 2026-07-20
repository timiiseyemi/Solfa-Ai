'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { Star, ChevronRight } from 'lucide-react'
import { Reveal } from '@/components/visuals'

const testimonials = [
  {
    quote:
      'SolfaAI transcribed our entire Advent program overnight. What used to take a week of manual sol-fa now takes minutes.',
    name: 'Margaret Osei',
    role: 'Choir Director, Grace Cathedral',
    avatar: '/avatars/margaret.png',
  },
  {
    quote:
      'My students finally hear when they drift flat. The real-time feedback turned sight-singing into a game they love.',
    name: 'David Chen',
    role: 'Music Teacher, Harmony Academy',
    avatar: '/avatars/david.png',
  },
  {
    quote:
      'As a self-taught singer, the personalized lessons feel like having a conservatory tutor in my pocket. Worth every cent.',
    name: 'Amara Nwosu',
    role: 'Vocalist & Worship Leader',
    avatar: '/avatars/amara.png',
  },
  {
    quote:
      'We onboarded twelve new choristers with per-voice sol-fa parts in a single rehearsal. Extraordinary time saver.',
    name: 'Thomas Reilly',
    role: "St. Cecilia's Choir",
    avatar: '/avatars/thomas.png',
  },
  {
    quote:
      'The notation accuracy on complex four-part harmony genuinely surprised me. It reads music the way a trained ear does.',
    name: 'Elena Petrova',
    role: 'Professor, Trinity Conservatory',
    avatar: '/avatars/elena.png',
  },
  {
    quote:
      'Our whole music department standardized on SolfaAI this term. Lesson prep dropped by half across every classroom.',
    name: 'James Whitfield',
    role: 'Head of Music, Riverside School',
    avatar: '/avatars/james.png',
  },
]

function Card({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <figure className="flex w-[320px] shrink-0 flex-col rounded-2xl border border-border/60 bg-card px-8 py-9 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex justify-center gap-1 text-foreground" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, s) => (
          <Star key={s} className="size-4 fill-current" />
        ))}
      </div>
      <blockquote className="mt-6 text-pretty text-[0.95rem] leading-relaxed text-muted-foreground">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-8 flex flex-col items-center">
        <span className="relative size-14 overflow-hidden rounded-full">
          <Image
            src={t.avatar || '/placeholder.svg'}
            alt={`Portrait of ${t.name}`}
            fill
            sizes="56px"
            className="object-cover"
          />
        </span>
        <span className="mt-4 font-serif text-lg tracking-tight text-foreground">{t.name}</span>
        <span className="mt-1 text-xs text-muted-foreground">{t.role}</span>
      </figcaption>
    </figure>
  )
}

export function Testimonials() {
  const loop = [...testimonials, ...testimonials]
  const marqueeRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce || !marqueeRef.current) return

    let cancelled = false
    let cleanup: (() => void) | undefined

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled || !marqueeRef.current) return

      gsap.registerPlugin(ScrollTrigger)
      const track = marqueeRef.current
      const viewport = track.parentElement
      if (!viewport) return

      let inView = false
      let hovered = false
      const animation = gsap.to(track, {
        xPercent: -50,
        duration: 42,
        ease: 'none',
        repeat: -1,
        paused: true,
      })
      const updatePlayback = () => (inView && !hovered ? animation.play() : animation.pause())
      const onEnter = () => {
        hovered = true
        updatePlayback()
      }
      const onLeave = () => {
        hovered = false
        updatePlayback()
      }
      viewport.addEventListener('pointerenter', onEnter)
      viewport.addEventListener('pointerleave', onLeave)
      const trigger = ScrollTrigger.create({
        trigger: viewport,
        start: 'top 88%',
        end: 'bottom 12%',
        onEnter: () => {
          inView = true
          updatePlayback()
        },
        onEnterBack: () => {
          inView = true
          updatePlayback()
        },
        onLeave: () => {
          inView = false
          updatePlayback()
        },
        onLeaveBack: () => {
          inView = false
          updatePlayback()
        },
      })

      cleanup = () => {
        viewport.removeEventListener('pointerenter', onEnter)
        viewport.removeEventListener('pointerleave', onLeave)
        trigger.kill()
        animation.kill()
      }
    })()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [reduce])

  return (
    <section id="testimonials" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="font-display text-center text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-[3.4rem]">
            See what musicians <span className="italic text-muted-foreground">are saying</span>
          </h2>
        </Reveal>
      </div>

      {/* Marquee */}
      <div className="group relative mt-16">
        {/* edge fades */}
        <div className="light-no-fade pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="light-no-fade pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div ref={marqueeRef} className="flex w-max gap-6 px-3" style={{ willChange: 'transform' }}>
          {loop.map((t, i) => (
            <Card key={`${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-6xl justify-center px-4 sm:px-6">
        <Reveal>
          <a
            href="/signin"
            className="group inline-flex items-center gap-3 rounded-full border border-border bg-card px-7 py-3.5 text-xs font-medium tracking-[0.2em] text-foreground uppercase transition-colors hover:bg-secondary"
          >
            Read more success stories
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </div>

      {/* Blend the light testimonial canvas into the dark pricing section below. */}
      <div
        aria-hidden="true"
        className="dark-only-fade pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#0a0a10] sm:h-48"
      />
    </section>
  )
}
