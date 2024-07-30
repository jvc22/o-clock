'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { AlertTriangle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'
import { toast } from 'sonner'

import newAppointmentImage from '@/assets/appointments/new-appointment.svg'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFormState } from '@/hooks/use-form-state'
import { getPatientsList } from '@/http/get-patients-list'
import { queryClient } from '@/lib/react-query'
import { timeIntervals } from '@/static/time-intervals'
import { getWeekDays } from '@/utils/get-week-days'

import { scheduleNewAppointment } from './actions'

interface NewAppointmentFormProps {
  date: string
  time: number
}

export function NewAppointmentForm({ date, time }: NewAppointmentFormProps) {
  const weekdays = getWeekDays(new Date(date))

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    scheduleNewAppointment,
    () => {
      queryClient.invalidateQueries({
        queryKey: ['appointments', weekdays],
      })

      ref.current?.click()

      toast.success('Appointment scheduled successfully!')
    },
    true,
  )

  const { data } = useQuery({
    queryKey: ['patients', 'list'],
    queryFn: getPatientsList,
  })

  const ref = useRef<HTMLButtonElement>(null)

  const patientsCount = data?.patients ? data.patients.length : 0

  const formattedDate = format(date, 'EEEE, PPP')

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>New appointment</DialogTitle>
        <DialogDescription>
          Schedule a new appointment on your calendar
        </DialogDescription>
      </DialogHeader>

      <Image src={newAppointmentImage} alt="new-schedule-image" />

      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-primary">{formattedDate}</span>
        <span className="font-mono">{timeIntervals[time]}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!success && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Scheduling failed.</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Label>Patient*</Label>
          <Select name="patient">
            <SelectTrigger
              disabled={patientsCount === 0}
              className="disabled:cursor-default"
            >
              <SelectValue
                placeholder={
                  patientsCount > 0 ? 'Select a patient' : 'No patients found.'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {data?.patients &&
                data.patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    <span>{patient.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {patient.guardianName}
                    </span>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden grid-cols-2 gap-2">
          <Input type="text" name="date" value={date} onChange={() => {}} />

          <Input type="number" name="time" value={time} onChange={() => {}} />
        </div>

        <div className="flex items-center justify-between">
          <Label>Is this a recurring appointment (should be repeated)?</Label>
          <Checkbox name="is_recurring" className="size-6 border-input" />
        </div>

        <div>
          {errors?.patient && (
            <span className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.patient[0]}
            </span>
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
