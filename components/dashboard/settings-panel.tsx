'use client'

import Link from 'next/link'
import { Info, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ThemeSwitcher } from '@/components/theme-switcher'

type Preferences = { notation: 'sheet' | 'solfa'; autoOpenLesson: boolean; animations: boolean }
const defaultPreferences: Preferences = { notation: 'sheet', autoOpenLesson: true, animations: true }

export function SettingsPanel({ email }: { email: string }) {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences)
  useEffect(() => {
    const stored = window.localStorage.getItem('solfaai-preferences')
    if (!stored) return
    try { setPreferences({ ...defaultPreferences, ...JSON.parse(stored) }) } catch { /* Keep defaults. */ }
  }, [])
  const update = (next: Preferences) => { setPreferences(next); window.localStorage.setItem('solfaai-preferences', JSON.stringify(next)) }

  return <div className="space-y-5"><SettingsCard title="Appearance" description="Choose the look that feels right in your workspace."><ThemeSwitcher /></SettingsCard><SettingsCard title="Account" description="Your sign-in and recovery details."><div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3.5"><span className="flex min-w-0 items-center gap-3"><Mail className="size-4 shrink-0 text-blue-200" /><span className="min-w-0"><span className="block text-sm text-white/85">{email}</span><span className="mt-0.5 block text-xs text-white/40">Account email</span></span></span><Link href="/forgot-password" className="shrink-0 text-xs font-medium text-blue-200 transition hover:text-white">Reset password</Link></div></SettingsCard><SettingsCard title="Preferences" description="Saved on this device so your workspace opens the way you prefer."><div className="space-y-4"><label className="block text-sm text-white/70">Default notation view<select value={preferences.notation} onChange={(event) => update({ ...preferences, notation: event.target.value as Preferences['notation'] })} className="mt-2 block h-10 w-full rounded-xl border border-white/10 bg-[#171722] px-3 text-sm text-white outline-none focus:border-blue-300/40"><option value="sheet">Sheet music</option><option value="solfa">Tonic sol-fa</option></select></label><Toggle label="Auto-open AI Lesson after transcription" checked={preferences.autoOpenLesson} onChange={(value) => update({ ...preferences, autoOpenLesson: value })} /><Toggle label="Enable interface animations" checked={preferences.animations} onChange={(value) => update({ ...preferences, animations: value })} /></div></SettingsCard><SettingsCard title="About" description="SolfaAI for thoughtful music learning."><div className="flex items-center gap-3 text-sm text-white/60"><Info className="size-4 text-blue-200" />Version 0.1.0 <span className="text-white/20">·</span><a href="#" className="transition hover:text-white">Privacy Policy</a><span className="text-white/20">·</span><a href="#" className="transition hover:text-white">Terms</a></div></SettingsCard></div>
}

function SettingsCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 sm:p-7"><div className="mb-5"><h2 className="text-base font-semibold tracking-tight text-white">{title}</h2><p className="mt-1.5 text-sm text-white/45">{description}</p></div>{children}</section> }
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) { return <label className="flex cursor-pointer items-center justify-between gap-4"><span className="text-sm text-white/70">{label}</span><button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="theme-toggle relative h-6 w-11 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/20" data-state={checked ? 'on' : 'off'}><span className={`absolute top-1 size-4 rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} /></button></label> }
