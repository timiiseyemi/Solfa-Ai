'use client'

import { useCallback, useEffect, useState } from 'react'
import { CircleAlert, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { requestAiLessonGeneration } from '@/lib/lessons/requestLesson'
import { safeParseAiLesson } from '@/lib/lessons/parseLesson'
import type { AiLesson, LessonSource } from '@/types/lesson'
import { FlaticonMusicIcon } from '@/components/ui/flaticon-music-icon'

type Props = {
  songId: string
  initialLesson: AiLesson | null
  initialSource: LessonSource
}

export function AiLessonPanel({ songId, initialLesson, initialSource }: Props) {
  const [lesson, setLesson] = useState(initialLesson)
  const [source, setSource] = useState<LessonSource>(initialSource)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>(initialLesson ? 'ready' : 'loading')
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async () => {
    setState('loading')
    setError(null)
    try {
      const result = await requestAiLessonGeneration(songId)
      const generated = safeParseAiLesson(result.lesson)
      if (generated) {
        setLesson(generated)
        setSource(result.source === 'gpt' ? 'gpt' : 'fallback')
        setState('ready')
        return
      }

      if (result.status === 'generating') {
        const polled = await pollForLesson(songId)
        setLesson(polled.lesson)
        setSource(polled.source)
        setState('ready')
        return
      }
      throw new Error('The lesson response was unavailable.')
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : 'We could not generate your AI lesson.')
      setState('error')
    }
  }, [songId])

  useEffect(() => {
    if (initialLesson) return
    void generate()
  }, [generate, initialLesson])

  if (state === 'loading') return <LessonSkeleton />
  if (state === 'error' || !lesson) return <LessonError message={error} onRetry={() => void generate()} />
  return <LessonContent lesson={lesson} source={source} />
}

function LessonContent({ lesson, source }: { lesson: AiLesson; source: LessonSource }) {
  return <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }} className="space-y-4">
    <LessonCard icon={<FlaticonMusicIcon name="ai" className="size-6" />} kicker={source === 'gpt' ? '✨ AI Personalized Lesson' : '🧠 Smart Lesson (Offline)'} title="Your learning focus" className="ai-lesson-summary bg-gradient-to-br from-[#1e3a8a] via-[#172554] to-[#0b1120]">
      <p className="max-w-3xl text-sm leading-7 text-white/70 sm:text-base">{lesson.summary}</p>
    </LessonCard>

    <LessonCard icon={<FlaticonMusicIcon name="songs" className="size-6" />} kicker="Why this song is challenging" title="What to pay attention to">
      <p className="max-w-3xl text-sm leading-7 text-white/65">{lesson.difficultyExplanation}</p>
    </LessonCard>

    <div className="grid gap-4 lg:grid-cols-2">
      <LessonListCard icon={<FlaticonMusicIcon name="sheet" className="size-6" />} kicker="What this song teaches" title="Skills to build" items={lesson.whatThisSongTeaches} />
      <LessonListCard icon={<FlaticonMusicIcon name="ai" className="size-6" />} kicker="Warm-up Exercises" title="Prepare your voice and ear" items={lesson.warmupExercises} />
      <LessonListCard icon={<FlaticonMusicIcon name="sheet" className="size-6" />} kicker="Practice Plan" title="Build the song step by step" items={lesson.practicePlan} />
      <LessonListCard icon={<FlaticonMusicIcon name="note" className="size-6" />} kicker="Common Mistakes" title="Avoid these habits" items={lesson.commonMistakes} />
      <LessonListCard icon={<FlaticonMusicIcon name="note" className="size-6" />} kicker="Practice Tips" title="Make each session count" items={lesson.practiceTips} />
      <LessonListCard icon={<FlaticonMusicIcon name="streak" className="size-6" />} kicker="Daily Practice Routine" title="A focused 20-minute session" items={lesson.dailyPracticeRoutine} />
    </div>

    <LessonCard icon={<FlaticonMusicIcon name="streak" className="size-6" />} kicker="Next Goal" title="Your next milestone" className="border-blue-300/20 bg-blue-500/[0.08]">
      <p className="max-w-3xl text-sm leading-7 text-white/75 sm:text-base">{lesson.nextGoal}</p>
    </LessonCard>
  </motion.section>
}

function LessonCard({ icon, kicker, title, children, className = '' }: { icon: React.ReactNode; kicker: string; title: string; children: React.ReactNode; className?: string }) {
  return <section className={`overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/10 sm:p-7 ${className}`}><div className="flex items-start gap-3.5"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-300/20 bg-blue-500/10 text-blue-100">{icon}</span><div><p className="kicker text-blue-300">{kicker}</p><h2 className="mt-1.5 text-xl font-semibold tracking-tight text-white">{title}</h2></div></div><div className="mt-5">{children}</div></section>
}

function LessonListCard({ icon, kicker, title, items }: { icon: React.ReactNode; kicker: string; title: string; items: string[] }) {
  return <LessonCard icon={icon} kicker={kicker} title={title}><ol className="space-y-3">{items.map((item, index) => <li key={`${index}-${item}`} className="flex gap-3 text-sm leading-6 text-white/65"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-[0.65rem] font-medium text-blue-100">{index + 1}</span><span>{item}</span></li>)}</ol></LessonCard>
}

function LessonSkeleton() {
  return <section aria-live="polite" className="relative isolate overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 sm:p-10"><div aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/15 blur-[100px]" /><motion.div animate={{ y: [0, -7, 0], rotate: [0, 3, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }} className="mx-auto flex size-16 items-center justify-center rounded-3xl border border-blue-300/25 bg-blue-500/10"><FlaticonMusicIcon name="ai" className="size-10" /></motion.div><p className="mt-7 text-center kicker text-blue-300">AI Lesson</p><h2 className="mt-3 text-center text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">Generating your personalized AI lesson...</h2><p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-white/55">We&apos;re turning your transcription into a focused practice path.</p><div className="mx-auto mt-10 max-w-2xl space-y-3"><div className="h-4 w-2/5 animate-pulse rounded-full bg-white/[0.08]" /><div className="h-4 w-full animate-pulse rounded-full bg-white/[0.06]" /><div className="h-4 w-5/6 animate-pulse rounded-full bg-white/[0.06]" /><div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="h-28 animate-pulse rounded-2xl bg-white/[0.04]" /><div className="h-28 animate-pulse rounded-2xl bg-white/[0.04]" /></div></div></section>
}

function LessonError({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return <section className="rounded-[1.75rem] border border-red-300/15 bg-red-300/[0.045] p-7 shadow-2xl shadow-black/20 sm:p-10"><span className="flex size-12 items-center justify-center rounded-2xl border border-red-300/20 bg-red-300/10 text-red-200"><CircleAlert className="size-5" /></span><p className="mt-6 text-lg font-semibold tracking-tight text-white">Your AI lesson is taking a break</p><p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">{message ?? 'We could not generate your AI lesson. Your transcription and notation are still available.'}</p><button type="button" onClick={onRetry} className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm font-medium text-white transition-colors hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/20"><Sparkles className="size-4" />Try again</button></section>
}

async function pollForLesson(songId: string): Promise<{ lesson: AiLesson; source: LessonSource }> {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    await new Promise((resolve) => window.setTimeout(resolve, 1500))
    const response = await fetch(`/api/songs/${songId}/lesson`)
    if (!response.ok) continue
    const result = await response.json() as { lesson: unknown; status: string; source?: unknown }
    const lesson = safeParseAiLesson(result.lesson)
    if (lesson) return { lesson, source: result.source === 'gpt' ? 'gpt' : 'fallback' }
    if (result.status === 'failed') throw new Error('We could not generate your AI lesson.')
  }
  throw new Error('Your lesson is still generating. Please check back shortly.')
}
