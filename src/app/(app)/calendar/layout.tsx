import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calendar | o.clock',
}

export default function CalendarLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="h-full">{children}</div>
}
