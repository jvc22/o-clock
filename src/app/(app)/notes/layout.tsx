import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notes | o.clock',
}

export default function NotesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="h-full">{children}</div>
}
