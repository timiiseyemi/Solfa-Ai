import type { LucideIcon } from 'lucide-react'

export function DashboardStat({
  icon: Icon,
  iconSrc,
  label,
  value,
  detail,
}: {
  icon?: LucideIcon
  iconSrc?: string
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/50">{label}</p>
        <span className="flex size-8 items-center justify-center rounded-lg bg-blue-400/10 text-blue-200">
          {iconSrc ? <img src={iconSrc} alt="" aria-hidden="true" className="size-[1.125rem] object-contain" /> : Icon && <Icon className="size-[1.125rem]" strokeWidth={1.7} />}
        </span>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-1.5 text-xs text-white/40">{detail}</p>
    </div>
  )
}
