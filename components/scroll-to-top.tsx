'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { motion } from 'motion/react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.88, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: 8 }}
      transition={{ duration: 0.2 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-5 right-5 z-40 flex size-10 items-center justify-center rounded-full border border-border/70 bg-card/85 text-foreground shadow-lg shadow-black/10 backdrop-blur-md transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:bottom-6 sm:right-6"
    >
      <ArrowUp className="size-4" />
    </motion.button>
  )
}
