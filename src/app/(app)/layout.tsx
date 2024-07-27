import { Header } from '@/components/header'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col gap-4 px-12">
      <Header />

      {children}
    </div>
  )
}
