'use client'

import { Camera, Check, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile } from '@/app/actions/updateProfile'
import { getInitials, type DashboardUser } from '@/components/dashboard/dashboard-user'

export function ProfileEditor({ user, songsAnalyzed, lessonsCompleted, practiceStreak }: { user: DashboardUser; songsAnalyzed: number; lessonsCompleted: number; practiceStreak: string }) {
  const router = useRouter()
  const [fullName, setFullName] = useState(user.fullName)
  const [bio, setBio] = useState(user.bio ?? '')
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState('saving')
    try {
      await updateProfile({ fullName, bio })
      setState('saved')
      router.refresh()
      window.setTimeout(() => setState('idle'), 2200)
    } catch {
      setState('error')
    }
  }

  return <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]"><section className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 sm:p-7"><form onSubmit={save} className="space-y-5"><div><label htmlFor="display-name" className="text-sm font-medium text-white/85">Display name</label><input id="display-name" value={fullName} onChange={(event) => setFullName(event.target.value)} required minLength={2} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white outline-none transition focus:border-blue-300/40 focus:ring-4 focus:ring-blue-400/10" /></div><div><label htmlFor="bio" className="text-sm font-medium text-white/85">Bio <span className="text-white/35">(optional)</span></label><textarea id="bio" value={bio} onChange={(event) => setBio(event.target.value)} rows={4} maxLength={280} placeholder="Tell us a little about your musical goals." className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-blue-300/40 focus:ring-4 focus:ring-blue-400/10" /></div>{state === 'error' && <p role="alert" className="text-sm text-red-200">We could not save those changes. Please try again.</p>}<button type="submit" disabled={state === 'saving'} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2563eb] px-4 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/20 disabled:opacity-60">{state === 'saving' ? <Loader2 className="size-4 animate-spin" /> : state === 'saved' ? <Check className="size-4" /> : null}{state === 'saving' ? 'Saving' : state === 'saved' ? 'Saved' : 'Save changes'}</button></form></section><aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5"><div className="relative mx-auto flex size-20 items-center justify-center rounded-full border border-blue-300/20 bg-blue-400/10 text-lg font-semibold text-blue-100">{user.avatarUrl ? <img src={user.avatarUrl} alt="" className="size-full rounded-full object-cover" /> : getInitials(fullName)}<span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border border-white/15 bg-[#171722] text-white/65"><Camera className="size-3.5" /></span></div><p className="mt-4 text-center text-sm font-medium text-white/90">{fullName}</p><p className="mt-1 text-center text-xs text-white/45">{user.email}</p><p className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-xs text-white/45">Avatar uploads will be available soon.</p><dl className="mt-5 space-y-3 border-t border-white/10 pt-5 text-sm"><Metric label="Songs analyzed" value={String(songsAnalyzed)} /><Metric label="Lessons completed" value={String(lessonsCompleted)} /><Metric label="Practice streak" value={practiceStreak} /></dl></aside></div>
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between"><dt className="text-white/45">{label}</dt><dd className="font-medium text-white/85">{value}</dd></div>
}
