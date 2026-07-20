'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { Check, Zap } from 'lucide-react'
import { Reveal } from '@/components/visuals'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Student',
    tagline: 'Best for individual learners',
    monthly: 8,
    yearly: 7,
    featured: false,
    features: [
      'Access to core music tools',
      'Up to 5 song uploads',
      'Staff notation & tonic sol-fa',
      'Real-time pitch feedback',
      'Community forum access',
      'Basic practice analytics',
    ],
  },
  {
    name: 'Educator',
    tagline: 'Best for teachers & tutors',
    monthly: 24,
    yearly: 20,
    featured: true,
    features: [
      'Unlimited uploads & projects',
      'Full lesson-plan generation',
      'Student assignments & review',
      'Projectable score exports',
      'Priority processing',
      'Onboarding & training',
    ],
  },
  {
    name: 'Institution',
    tagline: 'Best for choirs & schools',
    monthly: 79,
    yearly: 65,
    featured: false,
    features: [
      'Everything in Educator, plus:',
      'Unlimited seats & sections',
      'Per-voice choral parts',
      'Shared repertoire library',
      'Custom workflows & permissions',
      'Dedicated onboarding',
    ],
  },
]

export function Pricing() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" className="relative overflow-hidden bg-[#0a0a10] py-24 text-white sm:py-32">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* heading */}
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-balance text-center font-sans text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            Choose the right plan for your ensemble
          </h2>
        </Reveal>

        {/* toggle */}
        <div className="mt-10 flex justify-center">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              {(['monthly', 'yearly'] as const).map((m) => {
                const on = (m === 'yearly') === yearly
                return (
                  <button
                    key={m}
                    onClick={() => setYearly(m === 'yearly')}
                    className={cn(
                      'relative rounded-full px-5 py-2 text-sm font-medium capitalize transition-colors',
                      on ? 'text-[#0a0a10]' : 'text-white/60 hover:text-white',
                    )}
                  >
                    {on && (
                      <motion.span
                        layoutId="billing-toggle"
                        className="absolute inset-0 -z-10 rounded-full bg-white"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    {m}
                  </button>
                )
              })}
            </div>
          </Reveal>
        </div>

        {/* plans */}
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((p, i) => {
            const price = yearly ? p.yearly : p.monthly
            return (
              <Reveal key={p.name} delay={i * 0.12}>
                <div
                  className={cn(
                    'pricing-plan relative flex h-full flex-col overflow-hidden rounded-3xl p-8 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-xl hover:shadow-black/15',
                    p.featured
                      ? 'pricing-plan-featured lg:-mt-8 lg:mb-0 border border-white/15 shadow-2xl'
                      : 'border border-white/10',
                  )}
                  style={
                    p.featured
                      ? {
                          background:
                            'radial-gradient(120% 90% at 70% 15%, rgba(37,99,235,0.42), rgba(30,64,175,0.22) 45%, rgba(20,20,32,0.6) 80%)',
                        }
                      : { background: 'rgba(255,255,255,0.015)' }
                  }
                >
                  {/* icon */}
                  <span className="flex size-12 items-center justify-center rounded-full border border-white/20 text-white">
                    <Zap className="size-5" />
                  </span>

                  {/* name + tagline */}
                  <h3 className="mt-6 text-3xl font-medium tracking-tight">{p.name}</h3>
                  <p className="mt-2 text-sm text-white/55">{p.tagline}</p>

                  {/* price */}
                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-4xl font-semibold tracking-tight">${price}</span>
                    <span className="mb-1 text-sm text-white/50">/mo</span>
                  </div>

                  {/* divider */}
                  <div className="my-7 h-px w-full bg-white/10" />

                  {/* features */}
                  <ul className="space-y-4">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-white/70" />
                        <span className="text-white/80">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* cta */}
                  <Link
                    href="/signin"
                    className={cn(
                      'pricing-cta mt-8 flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold transition-[background-color,color,transform,box-shadow] duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/25',
                      p.featured
                        ? 'pricing-cta-featured bg-blue-600 text-white shadow-lg shadow-blue-950/20 hover:bg-blue-500'
                        : 'border border-white/20 bg-white/[0.035] text-white hover:border-white/35 hover:bg-white/[0.09]',
                    )}
                  >
                    Get started
                  </Link>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
