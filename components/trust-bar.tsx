'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { Reveal } from '@/components/visuals'

const brands = [
  { name: 'Spotify', src: '/brands/spotify.svg' },
  { name: 'Apple Music', src: '/brands/apple-music.svg' },
  { name: 'YouTube Music', src: '/brands/youtube-music.svg' },
  { name: 'SoundCloud', src: '/brands/soundcloud.svg' },
  { name: 'TIDAL', src: '/brands/tidal.svg' },
  { name: 'Deezer', src: '/brands/deezer.svg' },
  { name: 'Shazam', src: '/brands/shazam.svg' },
  { name: 'Bandcamp', src: '/brands/bandcamp.svg' },
  { name: 'Audacity', src: '/brands/audacity.svg' },
]

export function TrustBar() {
  const logosRef = useRef<HTMLUListElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce || !logosRef.current) return

    let cancelled = false
    let revert: (() => void) | undefined

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled || !logosRef.current) return

      gsap.registerPlugin(ScrollTrigger)
      const list = logosRef.current
      const context = gsap.context(() => {
        gsap.fromTo(
          Array.from(list.children),
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
            stagger: 0.07,
            scrollTrigger: { trigger: list, start: 'top 82%', once: true },
          },
        )
      }, list)
      revert = () => context.revert()
    })()

    return () => {
      cancelled = true
      revert?.()
    }
  }, [reduce])

  return (
    <section className="bg-[#0a0a10] py-20 text-white sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="font-display text-4xl tracking-tight text-white sm:text-5xl">
              Seamlessly Connected
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-4 text-pretty leading-relaxed text-white/50">
              SolfaAI works with the tools musicians already love — Spotify, Apple Music, YouTube
              Music, SoundCloud, and more.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <ul ref={logosRef} className="mt-16 flex flex-wrap items-center justify-center gap-10 sm:gap-14">
            {brands.map((b) => (
              <li key={b.name}>
                <div>
                  <Image
                    src={b.src || '/placeholder.svg'}
                    alt={b.name}
                    width={56}
                    height={56}
                    className={`size-11 object-contain opacity-90 transition-opacity hover:opacity-100 sm:size-14 ${b.name === 'SoundCloud' || b.name === 'TIDAL' ? 'brand-logo-black-in-light' : ''}`}
                  />
                  <span className="sr-only">{b.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
