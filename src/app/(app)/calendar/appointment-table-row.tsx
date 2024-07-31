'use client'

import { useMutation } from '@tanstack/react-query'
import { EllipsisVertical, MessageCircle, Plus, Trash, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { TableCell, TableRow } from '@/components/ui/table'
import { useDate } from '@/contexts/date'
import { cancelAppointment } from '@/http/cancel-appointment'
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
    endDate: Date | null
    patient: {
      id: string
      name: string
      phone: string
      guardianName: string | null
    }
    isChecked: boolean
    isRecurring: boolean
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

  const { mutateAsync: cancelAppointmentFn } = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['appointments'],
      })

      toast.success('Appointment cancelled successfully!')
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
            <div className="flex items-center">
              <Button
                className={cn(
                  'h-8 w-4/5 rounded-r-none',
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
                {appointment?.patient.name.length > 12
                  ? `${appointment.patient.name.slice(0, 12)}...`
                  : appointment.patient.name}
              </Button>

              <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 w-1/5 rounded-l-none border-l-0 p-0"
                  >
                    <EllipsisVertical className="size-4" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent align="end" className="w-fit p-2">
                  <div className="flex items-center">
                    {!appointment.endDate && (
                      <Button
                        variant="ghost"
                        onClick={() =>
                          cancelAppointmentFn({
                            id: appointment.id,
                            isRecurring: appointment.isRecurring,
                            ...(appointment.isRecurring && {
                              endDate: weekdays[index],
                            }),
                          })
                        }
                        className="size-6 p-0 transition-all hover:-translate-y-1 hover:text-red-500"
                      >
                        <Trash className="size-4" />
                      </Button>
                    )}

                    {appointment.isRecurring && (
                      <Button
                        variant="ghost"
                        onClick={() =>
                          cancelAppointmentFn({
                            id: appointment.id,
                            isRecurring: appointment.isRecurring,
                            date: weekdays[index],
                            time,
                          })
                        }
                        className="size-6 p-0 transition-all hover:-translate-y-1 hover:text-amber-500"
                      >
                        <X className="size-4" />
                      </Button>
                    )}

                    <Button
                      asChild
                      className="size-6 p-0 transition-all hover:-translate-y-1 hover:text-green-600"
                      variant="ghost"
                    >
                      <a
                        href={`https://wa.me/${appointment.patient.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="size-4" />
                      </a>
                    </Button>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
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
