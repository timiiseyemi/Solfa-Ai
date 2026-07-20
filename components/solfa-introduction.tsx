import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/visuals'

function InlineMusicImage({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="mx-1 inline-flex size-9 translate-y-1 items-center justify-center align-baseline sm:mx-1.5 sm:size-11">
      <Image src={src} alt={alt} width={44} height={44} className="size-full object-cover" />
    </span>
  )
}

export function SolfaIntroduction() {
  return (
    <section className="bg-[#0a0a10] px-4 py-28 text-white sm:px-6 sm:py-40">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <p className="text-2xl font-semibold tracking-tight sm:text-4xl">SOLFAAI</p>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mx-auto mt-9 max-w-4xl text-balance text-2xl font-semibold leading-[1.38] tracking-[-0.045em] sm:mt-11 sm:text-[2.05rem]">
            SolfaAI turns every recording into a clearer path to musical confidence.
            <InlineMusicImage src="/music/mic.png" alt="Grand piano" />
            Upload a song and uncover the melody, notation, and practice guidance behind it.
            <InlineMusicImage src="/music/sheet.png" alt="Headphones" />
            Learn the notes you hear, sing with purpose, and make each practice session count.
            <InlineMusicImage src="/music/tape.png" alt="Musical clef" />
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <a
            href="/signin"
            className="mt-10 inline-flex items-center gap-1.5 border-b border-current pb-1 text-sm font-medium tracking-tight transition-opacity hover:opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0a0a10] sm:mt-12"
          >
            Discover SolfaAI
            <ArrowUpRight className="size-3.5" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
