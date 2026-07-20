'use client'

import { useState } from 'react'
import { Check, Clipboard, Download } from 'lucide-react'
import { motion } from 'motion/react'
import { FlaticonMusicIcon } from '@/components/ui/flaticon-music-icon'

type Props = {
  notation: string | null
  estimatedKey: string | null
  state: 'ready' | 'loading' | 'empty' | 'error'
  songTitle: string
}

export function TonicSolfaCard({ notation, estimatedKey, state, songTitle }: Props) {
  const [copied, setCopied] = useState(false)

  const copyNotation = async () => {
    if (!notation) return
    try {
      await navigator.clipboard.writeText(notation)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const downloadNotation = () => {
    if (!notation) return
    const filename = `${songTitle.replace(/\.[^.]+$/, '').replace(/[\\/:*?"<>|\r\n]/g, '') || 'solfaai-song'}-solfa.txt`
    const url = URL.createObjectURL(new Blob([notation], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-300/25 bg-blue-500/10"><img src="/icon/piano.png" alt="" aria-hidden="true" className="size-6 object-contain" /></span>
          <div>
            <p className="kicker text-blue-300">Movable-do notation</p>
            <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-white">Tonic Sol-fa</h2>
            <p className="mt-1.5 text-sm text-white/50">{estimatedKey ? `Estimated key: ${estimatedKey}` : 'Estimated key: Unknown'}</p>
          </div>
        </div>

        {state === 'ready' && notation && <div className="flex shrink-0 gap-2">
          <ActionButton label={copied ? 'Copied' : 'Copy'} onClick={copyNotation} icon={copied ? <Check className="size-4" /> : <Clipboard className="size-4" />} />
          <ActionButton label="Download Sol-fa (.txt)" onClick={downloadNotation} icon={<Download className="size-4" />} />
        </div>}
      </div>

      {state === 'ready' && notation && <pre className="mt-6 max-h-[34rem] overflow-auto rounded-2xl border border-white/10 bg-black/20 p-5 font-mono text-[0.925rem] leading-9 whitespace-pre-wrap text-white/85 sm:p-7">{notation}</pre>}
      {state === 'loading' && <SolfaMessage icon={<FlaticonMusicIcon name="ai" className="size-7 animate-pulse" />} title="Preparing tonic sol-fa" description="We&apos;re mapping your transcribed notes to their relative syllables." tone="blue" />}
      {state === 'empty' && <SolfaMessage icon={<FlaticonMusicIcon name="note" className="size-7" />} title="Tonic sol-fa is not available yet" description="This song needs more detected notes before a reliable sol-fa line can be prepared." tone="muted" />}
      {state === 'error' && <SolfaMessage icon={<FlaticonMusicIcon name="note" className="size-7" />} title="Tonic sol-fa could not be generated." description="Your MIDI and sheet music remain available. Try processing the song again to generate this notation." tone="error" />}
    </motion.section>
  )
}

function ActionButton({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return <button type="button" aria-label={label} onClick={onClick} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-medium text-white transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/20 sm:px-4 sm:text-sm">{icon}<span className="hidden sm:inline">{label}</span></button>
}

function SolfaMessage({ icon, title, description, tone }: { icon: React.ReactNode; title: string; description: string; tone: 'blue' | 'muted' | 'error' }) {
  const styles = tone === 'error'
    ? 'border-red-300/15 bg-red-300/[0.045] text-red-200'
    : tone === 'blue'
      ? 'border-blue-300/20 bg-blue-500/[0.07] text-blue-200'
      : 'border-white/10 bg-white/[0.025] text-white/55'

  return <div className={`mt-6 flex min-h-36 items-center gap-4 rounded-2xl border p-5 ${styles}`}><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">{icon}</span><div><p className="text-sm font-medium text-white">{title}</p><p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/55">{description}</p></div></div>
}
