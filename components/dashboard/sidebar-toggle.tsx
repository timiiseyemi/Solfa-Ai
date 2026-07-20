import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

export function SidebarToggle({ collapsed, onClick }: { collapsed: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      className="flex size-8 items-center justify-center rounded-lg text-white/45 transition-colors hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    >
      {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
    </button>
  )
}
