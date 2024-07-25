import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SignUpForm() {
  return (
    <form action="" className="space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">o.clock</h1>

        <span className="text-muted-foreground">
          Register and enjoy your time
        </span>
      </div>

      <div className="space-y-1">
        <Label htmlFor="name">Full name</Label>
        <Input name="name" type="name" id="name" autoComplete="off" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" autoComplete="off" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password_confirmation">Confirm your password</Label>
        <Input
          name="password_confirmation"
          type="password_confirmation"
          id="password_confirmation"
        />
      </div>

      <Button className="w-full" type="submit">
        Create account
      </Button>

      <Button className="w-full" variant="link" size="sm" asChild>
        <Link href="/auth/sign-in">Already registred? Sign in</Link>
      </Button>
    </form>
  )
}
