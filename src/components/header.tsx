import { Calendar, ChartSpline, Notebook, Users } from 'lucide-react'

import { AccountMenu } from './account-menu'
import NavLink from './nav-link'
import { ThemeToggle } from './theme/theme-toggle'

export function Header() {
  return (
    <header className="flex h-16 items-center gap-4">
      <h1 className="text-lg font-bold">
        <span className="text-primary">o</span>.clock
      </h1>

      <div className="h-6 w-px bg-border max-md:hidden" />

      <nav className="flex items-center gap-4 max-md:hidden">
        <NavLink href="/calendar">
          <Calendar className="size-4" />
          Calendar
        </NavLink>

        <NavLink href="/patients">
          <Users className="size-4" />
          Patients
          <span className="relative ml-1 inline-flex items-center gap-1 rounded-full bg-primary px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase leading-none tracking-wider text-primary-foreground shadow-sm">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary-foreground" />
            </span>
            New
          </span>
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
