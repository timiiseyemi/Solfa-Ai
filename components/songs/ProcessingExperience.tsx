'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Circle } from 'lucide-react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { transcribeSong, type TranscriptionStage } from '@/services/transcription/transcribeSong'
import { FlaticonMusicIcon } from '@/components/ui/flaticon-music-icon'

const stages = [
  'Upload Complete',
  'Downloading Audio',
  'Decoding Audio',
  'Loading Basic Pitch',
  'Detecting Notes',
  'Evaluating Pitch Confidence',
  'Generating MIDI',
  'Saving Transcription',
  'Finalizing Results',
]

function Waveform() {
  const bars = [32, 62, 46, 78, 58, 92, 40, 70, 50, 86, 55, 36, 76, 48, 64, 38, 82, 58, 44, 72]

  return (
    <div className="mt-8 flex h-20 items-center justify-center gap-1.5" aria-hidden="true">
      {bars.map((height, index) => (
        <motion.span
          key={index}
          className="w-1.5 rounded-full bg-gradient-to-t from-blue-600 to-sky-200"
          animate={{ height: [`${Math.max(14, height * 0.42)}%`, `${height}%`, `${Math.max(14, height * 0.58)}%`] }}
          transition={{ duration: 0.8 + (index % 4) * 0.12, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: index * 0.035 }}
        />
      ))}
    </div>
  )
}

function FloatingNotes() {
  const notes = [
    { icon: '♪', left: '8%', top: '16%', delay: 0.2, size: 'text-2xl' },
    { icon: '♫', left: '18%', top: '75%', delay: 1.1, size: 'text-xl' },
    { icon: '♪', left: '84%', top: '15%', delay: 0.5, size: 'text-3xl' },
    { icon: '♩', left: '91%', top: '67%', delay: 1.6, size: 'text-2xl' },
    { icon: '♬', left: '76%', top: '86%', delay: 0.9, size: 'text-xl' },
  ]

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {notes.map((note) => (
        <motion.span
          key={`${note.left}-${note.top}`}
          className={`absolute text-blue-300/30 ${note.size}`}
          style={{ left: note.left, top: note.top }}
          animate={{ y: [0, -16, 0], rotate: [0, 7, -4, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 5.5, delay: note.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {note.icon}
        </motion.span>
      ))}
    </div>
  )
}

export function ProcessingExperience({ songId, fileName, storagePath }: { songId: string; fileName: string; storagePath: string }) {
  const router = useRouter()
  const [stageIndex, setStageIndex] = useState(0)
  const [stageProgress, setStageProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const started = useRef(false)
  const isMounted = useRef(false)
  const redirectTimer = useRef<number | null>(null)
  const complete = stageIndex >= stages.length
  const progress = complete ? 100 : ((stageIndex + stageProgress / 100) / stages.length) * 100
  const remainingSeconds = Math.max(5, Math.ceil((stages.length - stageIndex) * 4))

  useEffect(() => {
    isMounted.current = true

    const applyStage = (stage: TranscriptionStage) => {
      if (!isMounted.current) return
      const stageMap: Record<TranscriptionStage, number> = {
        downloading: 1,
        decoding: 2,
        loading: 3,
        transcribing: 4,
        saving: 7,
        finalizing: 8,
      }
      setStageIndex(stageMap[stage])
      setStageProgress(0)
    }

    if (!started.current) {
      started.current = true
      void transcribeSong({
        supabase: createClient(),
        songId,
        storagePath,
        originalFilename: fileName,
        onStage: applyStage,
        onProgress: (percentage) => {
          if (!isMounted.current) return
          const position = 4 + (percentage / 100) * 3
          const nextIndex = Math.min(6, Math.floor(position))
          setStageIndex(nextIndex)
          setStageProgress(nextIndex === 6 ? 100 : (position - nextIndex) * 100)
        },
      }).then(() => {
        if (!isMounted.current) return
        setStageProgress(0)
        setStageIndex(stages.length)
        const preferences = readPreferences()
        const destination = preferences.autoOpenLesson ? `/songs/${songId}?tab=lesson` : `/songs/${songId}`
        redirectTimer.current = window.setTimeout(() => router.replace(destination), 900)
      }).catch((transcriptionError) => {
        if (!isMounted.current) return
        setError(transcriptionError instanceof Error ? transcriptionError.message : 'Transcription failed. Please try again.')
      })
    }

    return () => {
      isMounted.current = false
      if (redirectTimer.current) window.clearTimeout(redirectTimer.current)
    }
  }, [router, songId, storagePath])

  const progressLabel = useMemo(() => `${Math.round(progress)}% complete`, [progress])

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a10] px-4 py-10 text-white sm:px-8 sm:py-12">
      <FloatingNotes />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/15 blur-[150px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 size-96 translate-x-1/3 translate-y-1/3 rounded-full bg-sky-500/10 blur-[120px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <motion.section initial={{ opacity: 0, y: 18, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="generation-card w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#11121d]/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="flex size-13 items-center justify-center rounded-2xl border border-blue-300/25 bg-blue-500/10 p-2.5 shadow-lg shadow-blue-950/20"><img src="/icon/piano.png" alt="" aria-hidden="true" className="size-full object-contain" /></span>
              <p className="mt-6 kicker text-blue-300">SolfaAI is thinking</p>
              <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Turning your song into a lesson.</h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">We&apos;re transcribing <span className="font-medium text-white/80">{fileName}</span> into structured MIDI note events.</p>
              {error && <p role="alert" className="mt-3 text-sm leading-relaxed text-red-300">{error}</p>}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-left sm:text-right">
              <p className="text-xs text-white/45">Estimated time left</p>
              <p className="mt-1 text-lg font-medium tabular-nums text-white">{complete ? 'Ready' : error ? 'Paused' : `~${remainingSeconds}s`}</p>
            </div>
          </div>

          <Waveform />

          <div className="mt-4" aria-live="polite">
            <div className="flex items-center justify-between gap-4 text-xs text-white/55">
              <span>{complete ? 'Results are ready' : stages[stageIndex]}</span>
              <span className="font-medium text-white/85">{progressLabel}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.07]">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-300" animate={{ width: `${progress}%` }} transition={{ duration: 0.18, ease: 'linear' }} />
            </div>
          </div>

          <div className="mt-9 space-y-1.5">
            {stages.map((stage, index) => {
              const isComplete = index < stageIndex || complete
              const isCurrent = index === stageIndex && !complete

              return (
                <motion.div key={stage} initial={{ opacity: 0, x: -8 }} animate={{ opacity: index <= stageIndex || complete ? 1 : 0.38, x: 0 }} transition={{ duration: 0.3, delay: Math.min(index, 4) * 0.04 }} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                  <span className="relative flex size-5 shrink-0 items-center justify-center">
                    {isComplete ? (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 20 }} className="flex size-5 items-center justify-center rounded-full bg-emerald-300 text-[#102016]"><Check className="size-3.5" strokeWidth={3} /></motion.span>
                    ) : isCurrent ? (
                      <><motion.span animate={{ scale: [1, 1.55, 1], opacity: [0.7, 0, 0.7] }} transition={{ duration: 1.35, repeat: Infinity }} className="absolute size-5 rounded-full bg-blue-400" /><span className="relative size-2 rounded-full bg-blue-200" /></>
                    ) : <Circle className="size-4 text-white/20" />}
                  </span>
                  <span className={isComplete ? 'text-sm text-white/60' : isCurrent ? 'text-sm font-medium text-white' : 'text-sm text-white/30'}>{stage}</span>
                  {isCurrent && <motion.span animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 1.1, repeat: Infinity }} className="ml-auto text-xs text-blue-200">Working</motion.span>}
                </motion.div>
              )
            })}
          </div>

          <div className="mt-8 flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-white/40"><FlaticonMusicIcon name="note" className="size-4" />Your recording is encrypted and securely processed.</div>
        </motion.section>
      </div>
    </main>
  )
}

function readPreferences() {
  try {
    const stored = window.localStorage.getItem('solfaai-preferences')
    if (!stored) return { autoOpenLesson: true }
    const value = JSON.parse(stored) as { autoOpenLesson?: unknown }
    return { autoOpenLesson: value.autoOpenLesson !== false }
  } catch {
    return { autoOpenLesson: true }
  }
}
