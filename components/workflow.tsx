'use client'

import { motion } from 'motion/react'
import { Box, Boxes, PieChart, Hexagon } from 'lucide-react'
import { Reveal } from '@/components/visuals'

const steps = [
  {
    icon: Box,
    title: 'Upload your song',
    desc: 'Drag in an MP3, WAV, or a live recording from any device. Full arrangements welcome, no setup required.',
  },
  {
    icon: Boxes,
    title: 'AI listens & analyzes',
    desc: 'Our model detects key, tempo, harmony, and melodic lines with conservatory-grade precision in seconds.',
  },
  {
    icon: PieChart,
    title: 'Notation & sol-fa appear',
    desc: 'Staff notation and tonic sol-fa render instantly, fully editable and ready to export or print.',
  },
  {
    icon: Hexagon,
    title: 'Learn with feedback',
    desc: 'Follow a personalized lesson and sing along for real-time, note-by-note coaching as you practice.',
  },
]

export function Workflow() {
  return (
    <section id="workflow" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-center font-mono text-xs tracking-[0.24em] text-gold uppercase">
            The method
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display mx-auto mt-5 max-w-3xl text-balance text-center text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-[3.4rem]">
            From recording to rehearsal in four steps
          </h2>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.15}>
              <div className="flex flex-col items-center text-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/25 to-gold/5 text-gold"
                >
                  <s.icon className="size-8" strokeWidth={1.5} />
                </motion.div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-[15rem] leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
