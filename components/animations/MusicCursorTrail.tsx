'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const MUSIC_ASSETS = [
  '/music/clef.png',
  '/music/grand-piano.png',
  '/music/guitar.png',
  '/music/headphone.png',
  '/music/mic.png',
  '/music/puzzle.png',
  '/music/sheet.png',
  '/music/vinyl.png',
  '/music/tape.png',
  '/music/trump.png',
]

const MAX_ACTIVE_ITEMS = 12
const SPAWN_INTERVAL = 60
const DESKTOP_QUERY = '(pointer: fine) and (min-width: 768px)'

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min)

/**
 * A pointer trail intended to be rendered as a direct child of a positioned hero.
 * Its event listener and generated elements are limited to that parent section.
 */
export default function MusicCursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const hero = container?.parentElement

    if (!container || !hero || !window.matchMedia(DESKTOP_QUERY).matches) return

    const activeItems = new Set<HTMLImageElement>()
    const timelines = new Set<gsap.core.Timeline>()
    const preloadedAssets = MUSIC_ASSETS.map((src) => {
      const image = new Image()
      image.src = src
      void image.decode?.().catch(() => undefined)
      return image
    })
    let lastSpawnTime = 0
    let animationFrame: number | null = null
    let pendingPointer: { x: number; y: number } | null = null
    let heroBounds = hero.getBoundingClientRect()

    const updateHeroBounds = () => {
      heroBounds = hero.getBoundingClientRect()
    }

    const removeItem = (item: HTMLImageElement) => {
      gsap.killTweensOf(item)
      activeItems.delete(item)
      item.remove()
    }

    const spawnItem = (clientX: number, clientY: number, timestamp: number) => {
      if (timestamp - lastSpawnTime < SPAWN_INTERVAL || activeItems.size >= MAX_ACTIVE_ITEMS) return

      lastSpawnTime = timestamp
      const scale = randomBetween(0.8, 1.3)
      const rotation = randomBetween(-25, 25)
      const duration = randomBetween(1.2, 1.8)
      const item = document.createElement('img')

      item.src = MUSIC_ASSETS[Math.floor(Math.random() * MUSIC_ASSETS.length)]
      item.alt = ''
      item.setAttribute('aria-hidden', 'true')
      item.draggable = false
      item.className = 'absolute h-auto w-12 select-none will-change-transform sm:w-14'

      container.appendChild(item)
      activeItems.add(item)

      gsap.set(item, {
        x: clientX - heroBounds.left + randomBetween(-20, 20),
        y: clientY - heroBounds.top + randomBetween(-20, 20),
        xPercent: -50,
        yPercent: -50,
        autoAlpha: 0,
        scale: scale * 0.7,
        rotation: rotation * 0.35,
      })

      const driftX = randomBetween(-75, 75)
      const driftY = randomBetween(-135, -75)

      const timeline = gsap.timeline({
        onComplete: () => {
          timelines.delete(timeline)
          removeItem(item)
        },
      })

      timelines.add(timeline)
      timeline
        .to(item, { autoAlpha: 1, scale, duration: 0.16, ease: 'power2.out' })
        .to(item, {
          x: `+=${driftX}`,
          y: `+=${driftY}`,
          rotation,
          autoAlpha: 0,
          duration: duration - 0.16,
          ease: 'power1.out',
        })
    }

    const handleMove = (e: PointerEvent) => {
      const coalescedEvents = e.getCoalescedEvents?.()
      const latestEvent = coalescedEvents?.[coalescedEvents.length - 1] ?? e
      pendingPointer = { x: latestEvent.clientX, y: latestEvent.clientY }

      if (animationFrame !== null) return

      animationFrame = window.requestAnimationFrame((timestamp) => {
        animationFrame = null
        if (!pendingPointer) return

        spawnItem(pendingPointer.x, pendingPointer.y, timestamp)
        pendingPointer = null
      })
    }

    const resizeObserver = new ResizeObserver(updateHeroBounds)
    resizeObserver.observe(hero)
    window.addEventListener('scroll', updateHeroBounds, { passive: true })
    hero.addEventListener('pointermove', handleMove, { passive: true })

    return () => {
      hero.removeEventListener('pointermove', handleMove)
      window.removeEventListener('scroll', updateHeroBounds)
      resizeObserver.disconnect()
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame)
      timelines.forEach((timeline) => timeline.kill())
      activeItems.forEach(removeItem)
      preloadedAssets.length = 0
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    />
  )
}
