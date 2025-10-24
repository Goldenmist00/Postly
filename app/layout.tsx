import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/src/components/providers'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Postly - Modern Blogging Platform',
  description: 'A modern multi-user blogging platform built with Next.js',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="postly-theme"
        >
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
