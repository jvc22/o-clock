'use client'

import { useMutation } from '@tanstack/react-query'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { useDate } from '@/contexts/date'
import { checkAppointment } from '@/http/check-appointment'
import { GetAppointmentsResponse } from '@/http/get-appointments'
import { queryClient } from '@/lib/react-query'
import { cn } from '@/lib/utils'
import { timeIntervals } from '@/static/time-intervals'
import { getWeekDays } from '@/utils/get-week-days'

import { NewAppointmentForm } from './new-appointment-form'

interface AppointmentTableRowProps {
  time: number
  appointments: {
    id: string
    date: Date | null
    weekday: number | null
    time: number
    patient: {
      id: string
      name: string
      guardianName: string | null
    }
    isChecked: boolean
  }[]
}

export function AppointmentTableRow({
  time,
  appointments,
}: AppointmentTableRowProps) {
  const { date } = useDate()
  const weekdays = getWeekDays(date || new Date())

  function updateAppointmentCheckOnCache(
    appointmentId: string,
    isChecked: boolean,
  ) {
    const appointmentsCache =
      queryClient.getQueriesData<GetAppointmentsResponse>({
        queryKey: ['appointments', weekdays],
      })

    appointmentsCache.forEach(([cacheKey, cached]) => {
      if (!cached) {
        return
      }

      queryClient.setQueryData<GetAppointmentsResponse>(cacheKey, {
        ...cached,
        appointmentsByTime: cached.appointmentsByTime.map((appointments) => {
          return appointments.map((appointment) => {
            if (!appointment) {
              return appointment
            }

            if (appointment.id !== appointmentId) {
              return appointment
            }

            return {
              ...appointment,
              isChecked,
            }
          })
        }),
      })
    })
  }

  const { mutateAsync: checkAppointmentFn } = useMutation({
    mutationFn: checkAppointment,
    onSuccess: async (_, { id }) => {
      const appointment = appointments.find(
        (appointment) => appointment.id === id,
      )

      if (!appointment) {
        return
      }

      updateAppointmentCheckOnCache(id, !appointment.isChecked)
    },
  })

  return (
    <TableRow className="group border-0">
      <TableCell className="pl-3 font-mono text-muted-foreground transition-all group-hover:text-foreground">
        {timeIntervals[time]}
      </TableCell>

      {appointments?.map((appointment, index) => (
        <TableCell
          key={appointment?.id ? appointment.id : index}
          className={cn(index > 0 && 'border-l')}
        >
          {appointment?.id ? (
            <Button
              className={cn(
                'h-8 w-full',
                appointment.isChecked &&
                  'border-primary text-primary hover:text-primary',
              )}
              onClick={() =>
                checkAppointmentFn({
                  id: appointment.id,
                  date: weekdays[index],
                  isChecked: !appointment.isChecked,
                })
              }
              variant="outline"
            >
              {appointment?.patient.name.length > 16
                ? `${appointment.patient.name.slice(0, 16)}...`
                : appointment.patient.name}
            </Button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-8 w-full" variant="ghost">
                  <Plus className="size-4 text-muted-foreground transition-all group-hover:text-foreground" />
                </Button>
              </DialogTrigger>

              <NewAppointmentForm date={weekdays[index]} time={time} />
            </Dialog>
          )}
        </TableCell>
      ))}
    </TableRow>
  )
}
