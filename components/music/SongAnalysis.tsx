'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { SongAnalysis as SongAnalysisData } from '@/types/music-analysis'
import { FlaticonMusicIcon, type FlaticonMusicIconName } from '@/components/ui/flaticon-music-icon'

type Props = {
  songTitle: string
  durationSeconds: number | null
  detectedNotes: number | null
  midiStatus: string
  musicXmlStatus: string | null
  analysis: SongAnalysisData
  showHeader?: boolean
}

type AnalysisMetric = {
  label: string
  value: React.ReactNode
  icon?: FlaticonMusicIconName
  iconSrc?: string
}

export function SongAnalysis({ songTitle, durationSeconds, detectedNotes, midiStatus, musicXmlStatus, analysis, showHeader = true }: Props) {
  const overview = [
    { label: 'Duration', value: durationSeconds === null ? 'Unknown' : formatDuration(durationSeconds) },
    { label: 'Detected notes', value: <CountUp value={detectedNotes} /> },
    { label: 'MIDI status', value: <StatusBadge status={midiStatus} /> },
    { label: 'MusicXML status', value: <StatusBadge status={musicXmlStatus ?? 'pending'} /> },
  ]

  const metrics: AnalysisMetric[] = [
    { label: 'Estimated key', value: analysis.estimatedKey ?? 'Unknown', iconSrc: '/icon/sol.png' },
    { label: 'Estimated tempo', value: <CountUp value={analysis.estimatedBpm} suffix=" BPM" />, iconSrc: '/icon/frequency.png' },
    { label: 'Time signature', value: analysis.estimatedTimeSignature ?? 'Unknown', icon: 'sheet' as const },
    { label: 'Difficulty rating', value: analysis.difficulty ?? 'Unknown', iconSrc: '/icon/speedometer.png' },
    { label: 'Pitch accuracy', value: <CountUp value={analysis.pitchAccuracy} suffix="%" />, icon: 'ai' as const },
    { label: 'Complexity score', value: <CountUp value={analysis.complexityScore} suffix=" / 100" />, icon: 'songs' as const },
  ]

  return (
    <section className={showHeader ? 'mt-8' : ''} aria-labelledby={showHeader ? 'song-analysis-title' : undefined}>
      {showHeader && <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="kicker text-blue-300">AI music analysis</p>
          <h2 id="song-analysis-title" className="mt-2 text-2xl font-semibold tracking-tight text-white">Song Analysis</h2>
          <p className="mt-1.5 truncate text-sm text-white/50">{songTitle}</p>
        </div>
        <p className="text-sm text-white/45">Generated from your MIDI transcription</p>
      </motion.div>}

      <div className={`${showHeader ? 'mt-5' : ''} grid gap-3 sm:grid-cols-2 xl:grid-cols-4`}>
        {overview.map(({ label, value }, index) => <OverviewCard key={label} label={label} value={value} delay={index * 0.045} />)}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map(({ label, value, icon, iconSrc }, index) => <AnalysisCard key={label} label={label} value={value} icon={icon} iconSrc={iconSrc} delay={0.18 + index * 0.045} />)}
      </div>
    </section>
  )
}

function OverviewCard({ label, value, delay }: { label: string; value: React.ReactNode; delay: number }) {
  return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36, delay, ease: [0.22, 1, 0.36, 1] }} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 shadow-lg shadow-black/10 transition-colors hover:bg-white/[0.055]"><p className="text-xs text-white/45">{label}</p><div className="mt-2 min-h-5 text-sm font-medium text-white">{value}</div></motion.div>
}

function AnalysisCard({ label, value, icon, iconSrc, delay }: { label: string; value: React.ReactNode; icon?: FlaticonMusicIconName; iconSrc?: string; delay: number }) {
  return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36, delay, ease: [0.22, 1, 0.36, 1] }} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-lg shadow-black/10 transition-colors hover:bg-white/[0.055]"><span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10">{iconSrc ? <img src={iconSrc} alt="" aria-hidden="true" className="size-5 object-contain" /> : icon && <FlaticonMusicIcon name={icon} className="size-5" />}</span><p className="mt-5 text-xs text-white/45">{label}</p><div className="mt-1.5 text-lg font-medium tracking-tight text-white">{value}</div></motion.div>
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase()
  const tone = normalized === 'ready' || normalized === 'transcribed'
    ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200'
    : normalized === 'failed'
      ? 'border-red-300/20 bg-red-300/10 text-red-200'
      : 'border-blue-300/25 bg-blue-500/10 text-blue-200'

  return <motion.span initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 24 }} className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs capitalize ${tone}`}><span className="size-1.5 rounded-full bg-current" />{statusLabel(normalized)}</motion.span>
}

function CountUp({ value, suffix = '' }: { value: number | null; suffix?: string }) {
  const reduceMotion = useReducedMotion()
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (value === null) return
    if (reduceMotion) {
      setDisplayValue(value)
      return
    }

    const start = performance.now()
    const duration = 480
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      setDisplayValue(Math.round(value * (1 - (1 - progress) ** 3)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduceMotion, value])

  return value === null ? <>Unknown</> : <>{displayValue}{suffix}</>
}

function statusLabel(status: string) {
  if (status === 'transcribed') return 'Ready'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.round(seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${remainder}`
}
