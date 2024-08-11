'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

import { ThemeProvider } from '@/components/theme/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { DateProvider } from '@/contexts/date'
import { getQueryClient } from '@/lib/react-query'

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <DateProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          storageKey="oclock-theme"
          enableSystem
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </DateProvider>
    </QueryClientProvider>
  )
}
