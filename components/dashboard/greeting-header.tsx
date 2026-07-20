'use client'

import { useEffect, useState } from 'react'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function GreetingHeader({ firstName }: { firstName: string }) {
  const [greeting, setGreeting] = useState('Good morning')

  useEffect(() => setGreeting(getGreeting()), [])

  return (
    <header>
      <p className="kicker text-blue-200">{greeting}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Welcome back, {firstName} <span aria-hidden="true">👋</span>
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-white/50">
        Your next musical breakthrough is one song away.
      </p>
    </header>
  )
}
