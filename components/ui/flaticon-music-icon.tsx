import { cn } from '@/lib/utils'

const icons = {
  songs: '/icon/1.png',
  ai: '/icon/2.png',
  sheet: '/icon/3.png',
  note: '/icon/4.png',
  streak: '/icon/5.png',
} as const

export type FlaticonMusicIconName = keyof typeof icons

/** Decorative icons from the supplied Flaticon asset set. */
export function FlaticonMusicIcon({ name, className }: { name: FlaticonMusicIconName; className?: string }) {
  return <img src={icons[name]} alt="" aria-hidden="true" className={cn('size-5 object-contain', className)} />
}
