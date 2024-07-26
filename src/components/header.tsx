import { Calendar, ChartSpline, Notebook } from 'lucide-react'

import { AccountMenu } from './account-menu'
import NavLink from './nav-link'
import { ThemeToggle } from './theme/theme-toggle'

export function Header() {
  return (
    <header className="flex h-16 items-center gap-6">
      <h1 className="text-lg font-bold">
        <span className="text-primary">o</span>.clock
      </h1>

      <div className="h-6 w-px bg-border" />

      <nav className="flex items-center gap-6">
        <NavLink href="/calendar">
          <Calendar className="size-4" />
          Calendar
        </NavLink>

        <NavLink href="/dashboard">
          <ChartSpline className="size-4" />
          Dashboard
        </NavLink>

        <NavLink href="/notes">
          <Notebook className="size-4" />
          Notes
        </NavLink>
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <AccountMenu />
      </div>
    </header>
  )
}
