'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/visuals'

const footerLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Preview', href: '#preview' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12z" />
    </svg>
  )
}

const socials = [
  { label: 'Facebook', icon: FacebookIcon },
  { label: 'Instagram', icon: InstagramIcon },
  { label: 'X', icon: XIcon },
  { label: 'LinkedIn', icon: LinkedinIcon },
  { label: 'YouTube', icon: YoutubeIcon },
]

export function SiteFooter() {
  return (
    <footer className="site-footer relative">
      {/* final CTA */}
      <div className="footer-cta-surface relative overflow-hidden bg-[#090b14]">
        {/* glowing blue planet arc */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
          <img
            src="/studio/blue-planet.png"
            alt=""
            aria-hidden="true"
            className="cta-planet-art h-auto w-full min-w-[1100px] max-w-none object-cover object-top opacity-95"
          />
        </div>
        <div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center px-4 pb-24 pt-[26vw] text-center sm:px-6 sm:pt-80">
          <Reveal>
            <h2 className="text-balance font-serif text-4xl leading-[1.05] tracking-tight text-black sm:text-5xl md:text-6xl">
              Give every voice a teacher
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mx-auto mt-5 max-w-md text-pretty leading-relaxed text-black/70">
              No music theory? No problem. SolfaAI handles the hard part — start free, no card
              required.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Button
              render={<Link href="/signin" />}
              size="lg"
              className="group mt-9 h-12 rounded-xl bg-primary px-7 text-primary-foreground hover:bg-primary/90"
            >
              Let&apos;s start
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Reveal>
        </div>
      </div>

      {/* footer nav */}
      <div className="footer-nav-surface relative bg-[#090b14] text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          {/* Let's talk */}
          <Reveal>
            <p className="text-sm text-white/55">Let&apos;s talk to us</p>
            <a
              href="mailto:ryokulab@gmail.com"
              className="mt-3 block font-serif text-4xl tracking-tight text-white/25 transition-colors hover:text-white/50 sm:text-6xl"
            >
              ryokulab@gmail.com
            </a>
          </Reveal>

          {/* main grid */}
          <div className="mt-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-3">
            {/* company links */}
            <nav aria-label="Footer">
              <h3 className="font-semibold text-white">Quick links</h3>
              <ul className="mt-6 space-y-5">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-white/55 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* overlapping tilted images */}
            <div className="relative mx-auto h-72 w-full max-w-sm">
              <img
                src="/studio/footer-music-1.png"
                alt="Vocalist singing into a studio microphone"
                className="absolute left-1/2 top-0 h-52 w-64 -translate-x-1/2 rotate-3 rounded-2xl border-2 border-white/80 object-cover shadow-2xl"
              />
              <img
                src="/studio/footer-music-2.png"
                alt="Hands playing a grand piano"
                className="absolute bottom-2 left-4 h-48 w-44 -rotate-12 rounded-2xl border-2 border-white/80 object-cover shadow-2xl"
              />
              <img
                src="/studio/footer-music-3.png"
                alt="Choir performing from sheet music"
                className="absolute bottom-0 right-4 h-52 w-48 rotate-6 rounded-2xl border-2 border-white/80 object-cover shadow-2xl"
              />
            </div>

            {/* address + contact + socials */}
            <div className="text-left lg:text-right">
              <p className="font-semibold text-white">Address:</p>
              <p className="mt-2 text-white/55">Lagos, Nigeria</p>

              <p className="mt-8 font-semibold text-white">Contact:</p>
              <p className="mt-2 text-white/55">+2348163886181</p>
              <p className="text-white/55">ryokulab@gmail.com</p>

              <div className="mt-8 flex gap-3 lg:justify-end">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="flex size-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/60 hover:text-white"
                  >
                    <s.icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* bottom bar */}
          <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-sm text-white/45">
              &copy; {new Date().getFullYear()} SolfaAI. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-white/55">
              <a href="#" className="transition-colors hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Cookie Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
