'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertCircle, LoaderCircle } from 'lucide-react'
import { motion } from 'motion/react'
import { createClient } from '@/lib/supabase/client'
import { FlaticonMusicIcon } from '@/components/ui/flaticon-music-icon'

export function SheetMusicViewer({ storagePath, title }: { storagePath: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let resizeFrame: number | null = null
    let resizeObserver: ResizeObserver | null = null
    let renderScore: (() => void) | null = null
    const container = containerRef.current
    if (!container) return
    container.replaceChildren()
    setState('loading')
    setError(null)

    void (async () => {
      try {
        const { data, error: downloadError } = await createClient().storage.from('songs').download(storagePath)
        if (downloadError || !data) throw new Error('We could not retrieve this sheet music.')

        const { OpenSheetMusicDisplay } = await import('opensheetmusicdisplay')
        if (cancelled) return

        const osmd = new OpenSheetMusicDisplay(container, {
          autoResize: false,
          backend: 'svg',
          drawTitle: false,
          drawComposer: false,
          drawingParameters: 'compacttight',
        })
        await osmd.load(data, title)
        if (cancelled) return
        renderScore = () => osmd.render()
        renderScore()

        resizeObserver = new ResizeObserver(() => {
          if (resizeFrame !== null) cancelAnimationFrame(resizeFrame)
          resizeFrame = requestAnimationFrame(() => renderScore?.())
        })
        resizeObserver.observe(container)
        if (!cancelled) setState('ready')
      } catch (renderError) {
        if (cancelled) return
        console.error('[sheet-music] render failed', renderError)
        setError('We could not render this MusicXML file. You can still download the original file below.')
        setState('error')
      }
    })()

    return () => {
      cancelled = true
      resizeObserver?.disconnect()
      if (resizeFrame !== null) cancelAnimationFrame(resizeFrame)
      container.replaceChildren()
    }
  }, [storagePath, title])

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-3 shadow-2xl shadow-black/20 sm:p-4" aria-busy={state === 'loading'}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={state === 'ready' ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-72"
      >
        <div ref={containerRef} className="sheet-music-viewer overflow-x-auto rounded-2xl bg-white p-2 shadow-inner [&>div]:mx-auto sm:p-5" />
      </motion.div>
      {state === 'loading' && <div className="absolute inset-3 sm:inset-4"><LoadingState /></div>}
      {state === 'error' && <div className="absolute inset-3 sm:inset-4"><ErrorState message={error} /></div>}
    </section>
  )
}

function LoadingState() {
  return <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center"><span className="relative flex size-12 items-center justify-center rounded-2xl border border-blue-300/25 bg-blue-500/10"><FlaticonMusicIcon name="sheet" className="size-8" /><LoaderCircle className="absolute -bottom-1 -right-1 size-4 animate-spin text-blue-200" /></span><p className="mt-5 text-sm font-medium text-white">Preparing your sheet music</p><p className="mt-2 max-w-sm text-sm leading-relaxed text-white/50">Loading the generated MusicXML and engraving your score.</p></div>
}

function ErrorState({ message }: { message: string | null }) {
  return <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center"><span className="flex size-12 items-center justify-center rounded-2xl border border-red-300/20 bg-red-300/10 text-red-200"><AlertCircle className="size-5" /></span><p className="mt-5 text-sm font-medium text-white">Sheet music is unavailable</p><p className="mt-2 max-w-sm text-sm leading-relaxed text-white/50">{message}</p></div>
}
