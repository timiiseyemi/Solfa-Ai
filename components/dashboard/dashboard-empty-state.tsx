import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

export function DashboardEmptyState({
  icon: Icon,
  iconSrc,
  title,
  description,
  highlights,
  action,
}: {
  icon?: LucideIcon
  iconSrc?: string
  title: string
  description: string
  highlights?: { icon: LucideIcon; label: string }[]
  action?: { href: string; label: string }
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 text-center">
      <span className="flex size-10 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-400/10 text-blue-200">
        {iconSrc ? <img src={iconSrc} alt="" aria-hidden="true" className="size-[1.375rem] object-contain" /> : Icon && <Icon className="size-[1.375rem]" strokeWidth={1.6} />}
      </span>
      <h3 className="mt-4 text-sm font-medium text-white/85">{title}</h3>
      <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-white/45">{description}</p>
      {highlights && <div className="mt-5 flex flex-wrap justify-center gap-2">{highlights.map(({ icon: HighlightIcon, label }) => <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-xs text-white/55"><HighlightIcon className="size-3 text-blue-200" />{label}</span>)}</div>}
      {action && <Link href={action.href} className="mt-5 inline-flex h-9 items-center justify-center rounded-lg bg-[#2563eb] px-3.5 text-xs font-medium text-white transition hover:scale-[1.02] hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/20">{action.label}</Link>}
    </div>
  )
}
