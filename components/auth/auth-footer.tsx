import Link from 'next/link'

export function AuthFooter({ question, href, linkLabel }: { question: string; href: string; linkLabel: string }) {
  return <p className="mt-6 text-center text-sm text-white/50">{question} <Link href={href} className="font-medium text-white transition-colors hover:text-blue-300">{linkLabel}</Link></p>
}
