'use client'

import Link from 'next/link'
import { ArrowUpRight, Music2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

const heroImages = [
  '/hero image/1.jpg',
  '/hero image/2.jpg',
  '/hero image/3.jpg',
  '/hero image/4.jpg',
]

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !heroRef.current) return

    let cancelled = false
    let revert: (() => void) | undefined
    let removeMagneticListeners: (() => void) | undefined

    void (async () => {
      const { gsap } = await import('gsap')
      if (cancelled || !heroRef.current) return

      const hero = heroRef.current
      const header = document.querySelector<HTMLElement>('[data-site-header]')
      const context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
        if (header) timeline.fromTo(header, { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: 0.7 })
        timeline
          .fromTo('.hero-badge', { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.55 }, header ? '-=0.34' : 0)
          .fromTo('.hero-heading-line', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 }, '-=0.18')
          .fromTo('.hero-cta', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 }, '-=0.3')
          .fromTo('.hero-image-strip', { autoAlpha: 0, scale: 0.97, y: 16 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.75 }, '-=0.22')
          .fromTo('.hero-wordmark', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.32')
      }, hero)
      revert = () => context.revert()

      if (window.matchMedia('(any-pointer: fine)').matches) {
        const removers = Array.from(hero.querySelectorAll<HTMLElement>('[data-hero-image]')).map((card) => {
          const image = card.querySelector('img')

          const onPointerMove = (event: PointerEvent) => {
            const bounds = card.getBoundingClientRect()
            const x = (event.clientX - bounds.left) / bounds.width - 0.5
            const y = (event.clientY - bounds.top) / bounds.height - 0.5

            gsap.to(card, {
              x: x * 18,
              y: y * 18,
              rotation: x * 3.5,
              scale: 1.025,
              duration: 0.62,
              ease: 'power3.out',
              overwrite: 'auto',
            })
            gsap.to(image, {
              x: x * 8,
              y: y * 8,
              scale: 1.1,
              duration: 0.68,
              ease: 'power3.out',
              overwrite: 'auto',
            })
          }

          const onPointerLeave = () => {
            gsap.to(card, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.42)', overwrite: 'auto' })
            gsap.to(image, { x: 0, y: 0, scale: 1, duration: 0.85, ease: 'elastic.out(1, 0.48)', overwrite: 'auto' })
          }

          card.addEventListener('pointermove', onPointerMove)
          card.addEventListener('pointerleave', onPointerLeave)
          return () => {
            card.removeEventListener('pointermove', onPointerMove)
            card.removeEventListener('pointerleave', onPointerLeave)
          }
        })
        removeMagneticListeners = () => removers.forEach((remove) => remove())
      }
    })()

    return () => {
      cancelled = true
      removeMagneticListeners?.()
      revert?.()
    }
  }, [])

  return (
    <section ref={heroRef} id="top" className="relative overflow-hidden bg-[#0a0a10] pb-10 pt-24 text-foreground sm:pb-14 sm:pt-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div aria-hidden="true" className="hero-badge pointer-events-none absolute left-5 top-60 hidden size-28 items-center justify-center lg:flex">
          <svg viewBox="0 0 120 120" className="size-full animate-[spin_20s_linear_infinite]">
            <defs>
              <path id="solfa-circle" d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" />
            </defs>
            <text className="fill-current text-[9px] font-semibold tracking-[0.22em]">
              <textPath href="#solfa-circle">SOLFAAI • EVERY NOTE MATTERS • </textPath>
            </text>
          </svg>
          <Music2 className="absolute size-5" />
        </div>

        <div className="mx-auto max-w-2xl lg:ml-[34%] lg:mr-0">
          <h1 className="font-display text-balance text-5xl leading-[0.98] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl">
            <span className="hero-heading-line block">Every song deserves</span>
            <span className="hero-heading-line block">a lesson of its own.</span>
          </h1>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <Link href="/signin" className="hero-cta group inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25">
              Explore SolfaAI
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link href="/signin" className="hero-cta group inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20">
              Start learning
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        <div className="hero-image-strip mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 lg:ml-[34%] lg:mr-0">
          {heroImages.map((src, index) => (
            <div data-hero-image key={src} className="group relative aspect-[1.2/1] overflow-hidden rounded-2xl border border-black/70 bg-muted shadow-sm will-change-transform dark:border-white/25">
              <img src={src} alt="" aria-hidden="true" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" loading={index > 1 ? 'lazy' : 'eager'} />
            </div>
          ))}
        </div>

        <div
          aria-hidden="true"
          className="hero-wordmark font-pally relative left-1/2 mt-8 w-[calc(100vw-2rem)] -translate-x-1/2 select-none text-center text-[clamp(5rem,17.5vw,19rem)] font-extrabold leading-[0.7] tracking-[-0.045em] text-foreground sm:mt-10 sm:w-[calc(100vw-4rem)]"
        >
          <span>SOLFA</span><span className="text-[#3b82f6]">AI</span>
        </div>
      </div>
    </section>
  )
}
