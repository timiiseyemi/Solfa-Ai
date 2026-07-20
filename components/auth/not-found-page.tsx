'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'

export function AuthNotFoundPage() {
  return <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a10] px-4 text-white"><div aria-hidden="true" className="absolute size-[38rem] rounded-full bg-blue-600/15 blur-[150px]" /><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="relative max-w-md text-center"><img src="/brand/solfaai-app-icon.svg" alt="SolfaAI" className="mx-auto size-12 rounded-2xl object-cover" /><p className="mt-9 kicker text-blue-300">404 · Lost in the score</p><h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">This page missed its cue.</h1><p className="mt-5 leading-relaxed text-white/55">The page you’re looking for isn’t part of this arrangement. Let’s get you back to the music.</p><Link href="/" className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-[#0a0a10] transition hover:bg-white/90"><ArrowLeft className="size-4" />Back to home</Link></motion.div></main>
}
