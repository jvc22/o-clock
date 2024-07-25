'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'

import { signIn } from './actions'

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signIn,
    () => {
      router.push('/')
    },
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">o.clock</h1>

        <span className="text-muted-foreground">
          Access your calendar panel
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
        <Label htmlFor="email">E-mail</Label>
        <Input
          type="text"
          name="email"
          id="email"
          autoComplete="off"
          defaultValue={searchParams.get('email') ?? ''}
        />

        {errors?.email && (
          <span className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.email[0]}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input type="password" name="password" id="password" />

        {errors?.password && (
          <span className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.password[0]}
          </span>
        )}
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Sign in with e-mail'
        )}
      </Button>

      <Button className="w-full" variant="link" size="sm" asChild>
        <Link href="/auth/sign-up">Create new account</Link>
      </Button>
    </form>
  )
}
