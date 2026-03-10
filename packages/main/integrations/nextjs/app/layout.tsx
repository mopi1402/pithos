import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Link from 'next/link'
import ChaosToggle from './_components/chaos-toggle'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Pithos × Next.js',
  description: 'Pithos integration demo with Next.js. Book Collection Manager.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <nav className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-tight">Pithos × Next.js</Link>
            <ChaosToggle />
          </div>
        </nav>
        <div className="mx-auto max-w-3xl px-6 py-8">
          {children}
        </div>
      </body>
    </html>
  )
}
