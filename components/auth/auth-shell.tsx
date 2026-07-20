import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { FeaturePanel } from './feature-panel'

export function AuthShell({ children, mode }: { children: ReactNode; mode: 'signin' | 'signup' }) {
  const isSignUp = mode === 'signup'
  const transition = { type: 'spring' as const, stiffness: 170, damping: 24, mass: 0.8 }

  return <main className={cn('min-h-screen bg-[#0a0a10] text-white lg:flex', isSignUp && 'lg:flex-row-reverse')}>
    <motion.div layout transition={transition} className={cn('hidden border-white/10 lg:block lg:w-[47%]', isSignUp ? 'lg:border-l' : 'lg:border-r')}>
      <FeaturePanel />
    </motion.div>
    <motion.section layout transition={transition} className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      <div className="relative w-full max-w-[29rem]">{children}</div>
    </motion.section>
  </main>
}
