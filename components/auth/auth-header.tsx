import Link from 'next/link'

export function AuthHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center">
      <Link href="/" aria-label="Back to SolfaAI home" className="mx-auto flex w-fit items-center gap-2.5">
        <img src="/brand/solfaai-app-icon.svg" alt="" aria-hidden="true" className="size-9 rounded-xl object-cover shadow-lg shadow-white/10" />
        <span className="font-serif text-xl tracking-tight text-white">Solfa<span className="text-blue-400">AI</span></span>
      </Link>
      <h1 className="mt-7 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{description}</p>
    </div>
  )
}
