export function SocialButton() {
  return (
    <button type="button" onClick={() => undefined} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] text-sm font-medium text-white/85 transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/20">
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path fill="#4285F4" d="M21.8 12.23c0-.71-.06-1.22-.2-1.75H12v3.55h5.64c-.11.88-.72 2.2-2.08 3.09l-.02.12 3.02 2.34.21.02c1.94-1.79 3.03-4.42 3.03-7.37Z" />
        <path fill="#34A853" d="M12 22c2.76 0 5.08-.91 6.77-2.48l-3.22-2.48c-.86.6-2.01 1.02-3.55 1.02a6.14 6.14 0 0 1-5.8-4.24l-.11.01-3.14 2.43-.04.1A10.22 10.22 0 0 0 12 22Z" />
        <path fill="#FBBC05" d="M6.2 13.82A6.2 6.2 0 0 1 5.86 12c0-.63.12-1.24.33-1.82l-.01-.12-3.17-2.47-.1.05A10.02 10.02 0 0 0 1.8 12c0 1.57.37 3.06 1.1 4.36l3.3-2.54Z" />
        <path fill="#EA4335" d="M12 5.94c1.94 0 3.25.84 4 1.54l2.92-2.85C17.07 2.9 14.76 2 12 2a10.22 10.22 0 0 0-9.09 5.64l3.29 2.54A6.15 6.15 0 0 1 12 5.94Z" />
      </svg>
      Continue with Google
    </button>
  )
}
