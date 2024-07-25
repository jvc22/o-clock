import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calendar | o.clock',
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="min-h-screen">{children}</div>
}
