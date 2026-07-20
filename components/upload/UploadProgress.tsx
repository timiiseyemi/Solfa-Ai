'use client'

import { motion } from 'motion/react'

export function UploadProgress({ percentage, fileName }: { percentage: number; fileName: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-x-7 bottom-6 z-30 rounded-xl border border-white/15 bg-[#11122a]/85 px-4 py-3 shadow-xl shadow-black/25 backdrop-blur-md sm:inset-x-10 sm:bottom-8">
      <div className="flex items-center justify-between gap-4 text-xs">
        <span className="truncate text-white/80">Uploading {fileName}</span>
        <span className="shrink-0 font-medium text-white">{percentage}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full rounded-full bg-blue-400" animate={{ width: `${percentage}%` }} transition={{ duration: 0.25, ease: 'easeOut' }} />
      </div>
    </motion.div>
  )
}
