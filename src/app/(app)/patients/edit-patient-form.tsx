'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import { useRef } from 'react'
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
import { getQueryClient } from '@/lib/react-query'

import { editPatient } from './actions'

interface EditPatientFormProps {
  patient: {
    id: string
    name: string
    phone: string
    guardianName: string | null
    guardianPhone: string | null
  }
}

export function EditPatientForm({ patient }: EditPatientFormProps) {
  const queryClient = getQueryClient()

  const ref = useRef<HTMLButtonElement>(null)

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    editPatient,
    () => {
      queryClient.invalidateQueries({
        queryKey: ['patients'],
      })

      ref.current?.click()

      toast.success('Patient updated successfully!')
    },
  )

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Edit patient</DialogTitle>
        <DialogDescription>
          Update {patient.name}&apos;s information
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="id" value={patient.id} />

        {!success && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Update failed.</AlertTitle>
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
              defaultValue={patient.name}
            />
          </div>

          <div className="space-y-1">
            <Label>Phone*</Label>
            <Input
              id="phone"
              name="phone"
              type="number"
              autoComplete="off"
              placeholder="5511912345678"
              defaultValue={patient.phone}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label>Name of the guardian</Label>
            <Input
              id="guardian_name"
              name="guardian_name"
              type="text"
              autoComplete="off"
              placeholder="Jane Doe"
              defaultValue={patient.guardianName ?? ''}
            />
          </div>

          <div className="space-y-1">
            <Label>Phone of the guardian</Label>
            <Input
              id="guardian_phone"
              name="guardian_phone"
              type="number"
              autoComplete="off"
              placeholder="5511912345678"
              defaultValue={patient.guardianPhone ?? ''}
            />
          </div>
        </div>

        <div>
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
        </div>

        <div>
          <span className="text-xs text-muted-foreground">
            * Required fields
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <DialogClose asChild>
            <Button ref={ref} type="reset" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Save'}
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}
