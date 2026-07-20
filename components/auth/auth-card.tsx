'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function AuthCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn('glass w-full max-w-[29rem] rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/25 sm:p-8', className)}
    >
      {children}
    </motion.div>
  )
}
