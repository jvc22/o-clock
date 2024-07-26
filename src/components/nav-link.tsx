'use client'

import { usePathname } from 'next/navigation'
import { ComponentProps, ReactNode } from 'react'

interface NavLinkProps extends ComponentProps<'a'> {
  children: ReactNode
}

export default function NavLink(props: NavLinkProps) {
  const pathname = usePathname()

  return (
    <a
      {...props}
      data-current={pathname === props.href}
      className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-all ease-out hover:text-foreground data-[current=true]:text-foreground"
    >
      {props.children}
    </a>
  )
}
