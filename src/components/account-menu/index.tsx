import { ChevronDown } from 'lucide-react'

import { auth } from '@/auth/auth'

import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { SignOutItem } from './sign-out-item'

export async function AccountMenu() {
  const user = await auth()

  const shortName = user?.name.split(' ').slice(0, 2).join(' ')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="items-cente group flex select-none gap-2 px-3"
        >
          {shortName}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span>{user?.name}</span>

          <span className="text-xs font-normal text-muted-foreground">
            {user?.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <SignOutItem />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
