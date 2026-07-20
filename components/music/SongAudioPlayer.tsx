'use client'

import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const speeds = [0.75, 1, 1.25] as const

export function SongAudioPlayer({ storagePath }: { storagePath: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const frameRef = useRef<number | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.85)
  const [speed, setSpeed] = useState<(typeof speeds)[number]>(1)

  const stopProgressLoop = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = null
  }, [])

  const startProgressLoop = useCallback(() => {
    stopProgressLoop()
    const update = () => {
      const audio = audioRef.current
      if (!audio) return
      setCurrentTime(audio.currentTime)
      frameRef.current = requestAnimationFrame(update)
    }
    frameRef.current = requestAnimationFrame(update)
  }, [stopProgressLoop])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    let objectUrl: string | null = null
    let active = true

    const prepareAudio = async () => {
      setState('loading')
      const { data, error } = await createClient().storage.from('songs').download(storagePath)
      if (!active) return
      if (error || !data) {
        setState('error')
        return
      }
      objectUrl = URL.createObjectURL(data)
      audio.src = objectUrl
      audio.load()
    }

    const onReady = () => {
      if (!active) return
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
      setState('ready')
    }
    const onPlay = () => {
      setIsPlaying(true)
      startProgressLoop()
    }
    const onPause = () => {
      setIsPlaying(false)
      stopProgressLoop()
      setCurrentTime(audio.currentTime)
    }
    const onEnded = () => {
      setIsPlaying(false)
      stopProgressLoop()
      setCurrentTime(audio.duration)
    }
    const onError = () => {
      if (active) setState('error')
    }

    audio.addEventListener('loadedmetadata', onReady)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    void prepareAudio()

    return () => {
      active = false
      stopProgressLoop()
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      audio.removeEventListener('loadedmetadata', onReady)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [startProgressLoop, stopProgressLoop, storagePath])

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio || state !== 'ready') return
    if (audio.paused) {
      try {
        await audio.play()
      } catch {
        setState('error')
      }
      return
    }
    audio.pause()
  }

  const seek = (value: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value
    setCurrentTime(value)
  }

  const changeVolume = (value: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = value
    setVolume(value)
  }

  const changeSpeed = (value: (typeof speeds)[number]) => {
    const audio = audioRef.current
    if (!audio) return
    audio.playbackRate = value
    setSpeed(value)
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const volumeProgress = volume * 100

  return (
    <div className="rounded-2xl border border-white/12 bg-[#071a33]/35 p-3.5 shadow-lg shadow-black/10 backdrop-blur-sm sm:p-4" aria-busy={state === 'loading'}>
      <audio ref={audioRef} preload="metadata" />
      {state === 'error' ? (
        <p className="px-1 py-2 text-sm text-white/65">This recording can’t be played in this browser. You can still download the generated MIDI below.</p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <motion.button
            type="button"
            onClick={togglePlayback}
            disabled={state !== 'ready'}
            whileHover={{ scale: state === 'ready' ? 1.04 : 1 }}
            whileTap={{ scale: state === 'ready' ? 0.94 : 1 }}
            aria-label={isPlaying ? 'Pause recording' : 'Play recording'}
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#0c2d5a] shadow-lg shadow-black/20 transition-opacity disabled:cursor-wait disabled:opacity-60"
          >
            {state === 'loading' ? <span className="size-4 animate-spin rounded-full border-2 border-blue-700/25 border-t-blue-700" /> : <AnimatePresence mode="wait" initial={false}>{isPlaying ? <motion.span key="pause" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}><Pause className="size-4 fill-current" /></motion.span> : <motion.span key="play" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}><Play className="ml-0.5 size-4 fill-current" /></motion.span>}</AnimatePresence>}
          </motion.button>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="w-10 text-right font-mono text-xs tabular-nums text-white/55">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 1}
              step="0.01"
              value={Math.min(currentTime, duration || 0)}
              onChange={(event) => seek(Number(event.target.value))}
              aria-label="Seek through recording"
              disabled={state !== 'ready'}
              style={{ background: `linear-gradient(to right, #60a5fa ${progress}%, rgba(255,255,255,0.18) ${progress}%)` }}
              className="solfa-range h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full disabled:cursor-wait"
            />
            <span className="w-10 font-mono text-xs tabular-nums text-white/55">{duration ? formatTime(duration) : '–:–'}</span>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 sm:justify-end sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
            <div className="hidden items-center gap-2 md:flex">
              {volume === 0 ? <VolumeX className="size-4 text-white/55" /> : <Volume2 className="size-4 text-white/55" />}
              <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => changeVolume(Number(event.target.value))} aria-label="Volume" style={{ background: `linear-gradient(to right, #60a5fa ${volumeProgress}%, rgba(255,255,255,0.18) ${volumeProgress}%)` }} className="solfa-range h-1.5 w-20 cursor-pointer appearance-none rounded-full" />
            </div>
            <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.05] p-0.5" aria-label="Playback speed">
              {speeds.map((option) => <button key={option} type="button" onClick={() => changeSpeed(option)} className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${speed === option ? 'bg-white text-[#0c2d5a]' : 'text-white/55 hover:text-white'}`}>{option}×</button>)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return '0:00'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}
