import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { GeistMono } from 'geist/font/mono'
import { AuthRouteShell } from '@/components/auth/auth-route-shell'
import { ThemeProvider, themeInitScript } from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'SolfaAI — Turn any song into notation, sol-fa, and lessons',
  description:
    'SolfaAI is the AI music education platform that transforms any song into staff notation, tonic sol-fa, personalized lessons, and real-time singing feedback. Built for students, teachers, choirs, churches, and schools.',
  icons: {
    icon: '/brand/solfaai-favicon.svg',
    apple: '/brand/solfaai-app-icon.svg',
  },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f4ed',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`bg-background ${GeistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider><AuthRouteShell>{children}</AuthRouteShell></ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
