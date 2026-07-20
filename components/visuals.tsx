'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/* ---------------------------------------------------------------- */
/* Scroll reveal wrapper                                            */
/* ---------------------------------------------------------------- */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduce || !ref.current) return

    let cancelled = false
    let revert: (() => void) | undefined

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled || !ref.current) return

      gsap.registerPlugin(ScrollTrigger)
      const element = ref.current
      const context = gsap.context(() => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              once: true,
            },
          },
        )
      }, element)
      revert = () => context.revert()
    })()

    return () => {
      cancelled = true
      revert?.()
    }
  }, [delay, reduce, y])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* Editorial section header — index number + hairline + kicker      */
/* ---------------------------------------------------------------- */
export function SectionHeader({
  index,
  kicker,
  title,
  lede,
  align = 'left',
  className,
}: {
  index: string
  kicker: string
  title: React.ReactNode
  lede?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl',
        className,
      )}
    >
      <Reveal>
        <div
          className={cn(
            'flex items-center gap-4',
            align === 'center' && 'justify-center',
          )}
        >
          <span className="font-mono text-xs tabular-nums text-gold">{index}</span>
          <span className="kicker text-muted-foreground">{kicker}</span>
          {align === 'left' && <span className="hairline hidden flex-1 sm:block" />}
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="font-display mt-5 text-4xl leading-[1.02] text-foreground sm:text-[2.9rem] md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {lede && (
        <Reveal delay={0.1}>
          <p className="mt-5 text-lg leading-relaxed text-pretty text-muted-foreground">
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* Animated live waveform (equalizer bars)                          */
/* ---------------------------------------------------------------- */
export function Waveform({
  bars = 48,
  className,
}: {
  bars?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduce || !ref.current) return

    let cancelled = false
    let cleanup: (() => void) | undefined

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled || !ref.current) return

      gsap.registerPlugin(ScrollTrigger)
      const element = ref.current
      const bars = Array.from(element.querySelectorAll<HTMLElement>('[data-waveform-bar]'))
      const context = gsap.context(() => {
        const animation = gsap.to(bars, {
          scaleY: (index) => 0.45 + ((index * 17) % 45) / 100,
          duration: (index) => 1.7 + (index % 5) * 0.16,
          ease: 'sine.inOut',
          repeat: -1,
          repeatRefresh: true,
          yoyo: true,
          stagger: { each: 0.035, from: 'center' },
          paused: true,
        })

        ScrollTrigger.create({
          trigger: element,
          start: 'top 85%',
          end: 'bottom 15%',
          onEnter: () => animation.play(),
          onEnterBack: () => animation.play(),
          onLeave: () => animation.pause(),
          onLeaveBack: () => animation.pause(),
        })
      }, element)
      cleanup = () => context.revert()
    })()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [bars, reduce])

  return (
    <div
      ref={ref}
      className={cn('flex h-full w-full items-center justify-center gap-[3px]', className)}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => {
        const seed = (Math.sin(i * 1.7) + 1) / 2
        const height = Math.round((12 + seed * 76) * 100) / 100
        return (
          <span
            key={i}
            data-waveform-bar
            className="w-[3px] rounded-full bg-gold/70"
            style={{ height: `${height}%`, transformOrigin: 'center' }}
          />
        )
      })}
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* Animated staff notation (five lines + notes drawing in)          */
/* ---------------------------------------------------------------- */
export function StaffNotation({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  const lineY = [20, 34, 48, 62, 76]
  const notes = [
    { x: 70, y: 62, label: 'd' },
    { x: 118, y: 55, label: 'r' },
    { x: 166, y: 48, label: 'm' },
    { x: 214, y: 41, label: 'f' },
    { x: 262, y: 34, label: 's' },
    { x: 310, y: 27, label: 'l' },
    { x: 358, y: 34, label: 't' },
    { x: 406, y: 20, label: 'd' },
  ]

  return (
    <svg
      viewBox="0 0 460 110"
      className={cn('w-full', className)}
      role="img"
      aria-label="Animated musical staff with sol-fa notes"
    >
      {/* staff lines */}
      {lineY.map((y, i) => (
        <motion.line
          key={y}
          x1="12"
          x2="448"
          y1={y}
          y2={y}
          stroke="currentColor"
          strokeOpacity="0.28"
          strokeWidth="1"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: i * 0.08, ease: 'easeInOut' }}
        />
      ))}

      {/* treble-ish clef mark */}
      <motion.path
        d="M28 84 C 18 60, 40 48, 40 34 C 40 22, 30 20, 28 30 C 26 40, 40 52, 44 70 C 47 84, 34 92, 30 84"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
      />

      {/* notes */}
      {notes.map((n, i) => (
        <motion.g
          key={i}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 + i * 0.12, ease: 'easeOut' }}
        >
          <ellipse cx={n.x} cy={n.y} rx="7.5" ry="5.5" fill="currentColor" transform={`rotate(-18 ${n.x} ${n.y})`} />
          <line x1={n.x + 6.5} x2={n.x + 6.5} y1={n.y - 2} y2={n.y - 30} stroke="currentColor" strokeWidth="1.6" />
          <text
            x={n.x}
            y={100}
            textAnchor="middle"
            className="fill-gold font-serif"
            fontSize="12"
            fontStyle="italic"
          >
            {n.label}
          </text>
        </motion.g>
      ))}
    </svg>
  )
}
