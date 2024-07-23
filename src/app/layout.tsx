import './globals.css'

import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'

import { ThemeProvider } from '@/components/theme/theme-provider'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Calendar | SDC',
  description: 'Organize your appointments daily routine!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn(GeistSans.variable, GeistMono.variable)}>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          GeistSans.className,
          GeistMono.className,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          storageKey="sdc-theme"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
