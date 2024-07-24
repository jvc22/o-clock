import { ReactNode } from 'react'

import { ThemeProvider } from '@/components/theme/theme-provider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      storageKey="sdc-theme"
      enableSystem
    >
      {children}
    </ThemeProvider>
  )
}
