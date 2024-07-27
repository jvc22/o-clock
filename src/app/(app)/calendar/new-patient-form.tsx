'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'

import { registerNewPatient } from './actions'

export function NewPatientForm() {
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    registerNewPatient,
    () => {
      toast.success('Patient registered successfully!')
    },
  )

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>New patient</DialogTitle>
        <DialogDescription>
          Register a new patient to your database
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!success && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Registration failed.</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label>Name*</Label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="off"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-1">
            <Label>Phone number*</Label>
            <Input
              id="phone"
              name="phone"
              type="number"
              autoComplete="off"
              placeholder="5511912345678"
            />
          </div>
        </div>

        {errors?.name ? (
          <span className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </span>
        ) : (
          errors?.phone && (
            <span className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.phone[0]}
            </span>
          )
        )}

        <div>
          <span className="text-xs text-muted-foreground">
            * Required fields
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <DialogClose asChild>
            <Button type="reset" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Register'
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}
