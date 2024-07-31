'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'

import { signUp } from './actions'

export function SignUpForm() {
  const router = useRouter()

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signUp,
    () => {
      toast.success('Account created successfully!', {
        action: {
          label: 'Sign in',
          onClick: () => router.push('/auth/sign-in'),
        },
      })
    },
    true,
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-primary">o</span>.clock
        </h1>

        <span className="text-muted-foreground">
          Register and enjoy your time
        </span>
      </div>

      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sign in failed.</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Full name</Label>
        <Input name="name" type="name" id="name" autoComplete="off" />

        {errors?.name && (
          <span className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" autoComplete="off" />

        {errors?.email && (
          <span className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.email[0]}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />

        {errors?.password && (
          <span className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.password[0]}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password_confirmation">Confirm your password</Label>
        <Input
          name="password_confirmation"
          type="password"
          id="password_confirmation"
        />

        {errors?.password_confirmation && (
          <span className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.password_confirmation[0]}
          </span>
        )}
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Create account'
        )}
      </Button>

      <Button className="w-full" variant="link" asChild>
        <Link href="/auth/sign-in">Already registred? Sign in</Link>
      </Button>
    </form>
  )
}
