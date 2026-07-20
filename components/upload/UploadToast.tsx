'use client'

import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle } from 'lucide-react'

export function UploadToast({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} role="alert" className="fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-red-300/20 bg-[#21131a]/95 px-4 py-3.5 text-sm text-red-100 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-300" />
          <p className="leading-relaxed">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
