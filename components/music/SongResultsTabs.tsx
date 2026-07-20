'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Check, Clock3, Download, Music2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { AiLessonPanel } from '@/components/music/AiLessonPanel'
import { SongAnalysis } from '@/components/music/SongAnalysis'
import { SheetMusicViewer } from '@/components/music/SheetMusicViewer'
import { TonicSolfaCard } from '@/components/music/TonicSolfaCard'
import { SongAudioPlayer } from '@/components/music/SongAudioPlayer'
import { FlaticonMusicIcon } from '@/components/ui/flaticon-music-icon'
import type { SongAnalysis as SongAnalysisData } from '@/types/music-analysis'
import type { AiLesson, LessonSource } from '@/types/lesson'

type TabId = 'overview' | 'sheet-music' | 'tonic-solfa' | 'lesson'

type Props = {
  songId: string
  songTitle: string
  songStatus: string
  storagePath: string
  hasMidi: boolean
  durationSeconds: number | null
  detectedNotes: number | null
  notationStatus: string
  musicXmlPath: string | null
  tonicSolfa: string | null
  solfaState: 'ready' | 'loading' | 'empty' | 'error'
  analysis: SongAnalysisData
  lesson: AiLesson | null
  lessonSource: LessonSource
  initialTab?: TabId
}

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'sheet-music', label: 'Sheet Music' },
  { id: 'tonic-solfa', label: 'Tonic Sol-fa' },
  { id: 'lesson', label: 'AI Lesson' },
]

export function SongResultsTabs({
  songId,
  songTitle,
  songStatus,
  storagePath,
  hasMidi,
  durationSeconds,
  detectedNotes,
  notationStatus,
  musicXmlPath,
  tonicSolfa,
  solfaState,
  analysis,
  lesson,
  lessonSource,
  initialTab = 'overview',
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)
  const notationReady = notationStatus === 'ready' && Boolean(musicXmlPath)

  useEffect(() => {
    if (initialTab !== 'overview') return
    try {
      const stored = window.localStorage.getItem('solfaai-preferences')
      const preferences = stored ? JSON.parse(stored) as { notation?: unknown } : null
      if (preferences?.notation === 'solfa') setActiveTab('tonic-solfa')
    } catch {
      // Keep the overview when local preferences are unavailable.
    }
  }, [initialTab])

  return (
    <div className="mt-7">
      <div role="tablist" aria-label="Song results" className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.035] p-1.5 shadow-xl shadow-black/10">
        {tabs.map((tab) => {
          const active = activeTab === tab.id
          return <button key={tab.id} type="button" role="tab" id={`song-tab-${tab.id}`} aria-selected={active} aria-controls={`song-panel-${tab.id}`} onClick={() => setActiveTab(tab.id)} className="relative shrink-0 rounded-xl px-3.5 py-2 text-sm font-medium text-white/50 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:px-5">
            {active && <motion.span layoutId="song-results-tab" className="absolute inset-0 rounded-xl border border-white/10 bg-white/[0.09] shadow-sm shadow-black/20" transition={{ type: 'spring', stiffness: 460, damping: 34 }} />}
            <span className="relative">{tab.label}</span>
          </button>
        })}
      </div>

      {/* Keep the overview (and its audio element) mounted while another tab is open. */}
      <div hidden={activeTab !== 'overview'} className="mt-6" role="tabpanel" id="song-panel-overview" aria-labelledby="song-tab-overview">
        <OverviewTab songId={songId} songTitle={songTitle} songStatus={songStatus} storagePath={storagePath} hasMidi={hasMidi} durationSeconds={durationSeconds} detectedNotes={detectedNotes} notationStatus={notationStatus} notationReady={notationReady} analysis={analysis} />
      </div>

      <AnimatePresence mode="wait">
        {activeTab !== 'overview' && <motion.div key={activeTab} role="tabpanel" id={`song-panel-${activeTab}`} aria-labelledby={`song-tab-${activeTab}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="mt-6">
          {activeTab === 'sheet-music' && <SheetMusicTab songId={songId} title={songTitle} notationStatus={notationStatus} musicXmlPath={musicXmlPath} />}
          {activeTab === 'tonic-solfa' && <TonicSolfaCard notation={tonicSolfa} estimatedKey={analysis.estimatedKey} state={solfaState} songTitle={songTitle} />}
          {activeTab === 'lesson' && <AiLessonPanel songId={songId} initialLesson={lesson} initialSource={lessonSource} />}
        </motion.div>}
      </AnimatePresence>
    </div>
  )
}

function OverviewTab({ songId, songTitle, songStatus, storagePath, hasMidi, durationSeconds, detectedNotes, notationStatus, notationReady, analysis }: Omit<Props, 'musicXmlPath' | 'tonicSolfa' | 'solfaState' | 'lesson' | 'lessonSource'> & { notationReady: boolean }) {
  return <div className="mx-auto max-w-6xl">
    <section className="theme-on-artwork relative overflow-hidden rounded-[1.75rem] border border-blue-300/20 bg-gradient-to-br from-[#1e3a8a] via-[#172554] to-[#0b1120] p-6 shadow-2xl shadow-blue-950/30 sm:p-9">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden"><img src="/song-analysis/piano-ai-hero.png" alt="" className="size-full object-cover object-right opacity-[0.18] blur-[1.5px]" /><div className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a]/95 via-[#172554]/65 to-transparent" /></div>
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <span className="flex size-12 items-center justify-center rounded-2xl border border-white/20 bg-white/[0.12] shadow-lg shadow-blue-950/20"><img src="/icon/disk.png" alt="" aria-hidden="true" className="size-8 object-contain" /></span>
          <p className="mt-7 kicker text-white/60">Song results</p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">{songTitle}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-2.5"><StatusBadge status={songStatus} /><span className="text-sm text-white/55">Your transcription and learning materials are organized below.</span></div>
        </div>

        {hasMidi && <div className="flex flex-wrap gap-3">
          <a href={`/songs/${songId}/download`} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-[#151638] transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25"><Download className="size-4" />Download MIDI</a>
          {notationReady && <a href={`/songs/${songId}/musicxml/download`} className="song-musicxml-download inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.09] px-5 text-sm font-medium text-white transition-colors hover:bg-white/[0.15] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"><Download className="size-4" />Download MusicXML</a>}
        </div>}
      </div>

      <div className="relative mt-7 max-w-3xl"><SongAudioPlayer storagePath={storagePath} /></div>

      <div className="relative mt-8 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
        <ProcessingItem icon={<Check className="size-3.5" strokeWidth={3} />} label="Processing status" value={statusLabel(songStatus)} complete={songStatus === 'transcribed'} />
        <ProcessingItem icon={<FlaticonMusicIcon name="sheet" className="size-4" />} label="Notation status" value={statusLabel(notationStatus)} complete={notationStatus === 'ready'} />
      </div>
    </section>

    <section className="mt-7" aria-labelledby="analysis-summary-title">
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="kicker text-blue-300">Analysis summary</p><h2 id="analysis-summary-title" className="mt-2 text-2xl font-semibold tracking-tight text-white">A clearer view of your song</h2></div>
        <p className="text-sm text-white/45">Derived from your transcription</p>
      </div>
      <SongAnalysis songTitle={songTitle} durationSeconds={durationSeconds} detectedNotes={detectedNotes} midiStatus={hasMidi ? 'ready' : songStatus} musicXmlStatus={notationStatus} analysis={analysis} showHeader={false} />
    </section>
  </div>
}

function SheetMusicTab({ songId, title, notationStatus, musicXmlPath }: { songId: string; title: string; notationStatus: string; musicXmlPath: string | null }) {
  if (notationStatus === 'ready' && musicXmlPath) return <SheetMusicViewer storagePath={musicXmlPath} title={title} />

  const failed = notationStatus === 'failed'
  return <section className={`rounded-[1.75rem] border p-7 shadow-2xl shadow-black/20 sm:p-10 ${failed ? 'border-red-300/15 bg-red-300/[0.045]' : 'border-white/10 bg-white/[0.035]'}`}><div className="flex items-start gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-blue-300/25 bg-blue-500/10 text-blue-200">{failed ? <Music2 className="size-5" /> : <Clock3 className="size-5 animate-pulse" />}</span><div><p className="text-sm font-medium text-white">{failed ? 'Sheet music is unavailable' : 'Preparing your sheet music'}</p><p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">{failed ? 'Your MIDI transcription is still available. You can retry processing whenever you are ready.' : 'We’re engraving your simplified melody into readable notation.'}</p>{failed && <Link href={`/songs/${songId}/processing`} className="mt-5 inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/20">Retry processing</Link>}</div></div></section>
}

function ProcessingItem({ icon, label, value, complete }: { icon: React.ReactNode; label: string; value: string; complete: boolean }) {
  return <div className="song-processing-item flex items-center gap-3 rounded-2xl bg-white/[0.05] px-4 py-3"><span className={`flex size-7 items-center justify-center rounded-full ${complete ? 'bg-emerald-300 text-[#102016]' : 'bg-white/10 text-white/70'}`}>{icon}</span><div><p className="song-processing-label text-xs text-white/45">{label}</p><p className="song-processing-value mt-0.5 text-sm font-medium text-white/90">{value}</p></div></div>
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase()
  const tone = normalized === 'transcribed' || normalized === 'ready'
    ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100'
    : normalized === 'failed'
      ? 'border-red-300/20 bg-red-300/10 text-red-100'
      : 'border-white/15 bg-white/[0.08] text-white/80'
  return <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${tone}`}><span className="size-1.5 rounded-full bg-current" />{statusLabel(normalized)}</span>
}

function statusLabel(status: string) {
  if (status === 'transcribed' || status === 'ready') return 'Ready'
  return status.charAt(0).toUpperCase() + status.slice(1)
}
