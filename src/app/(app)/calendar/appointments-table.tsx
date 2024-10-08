'use client'

import { useQuery } from '@tanstack/react-query'

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDate } from '@/contexts/date'
import { getAppointments } from '@/http/get-appointments'
import { timeIntervals } from '@/static/time-intervals'
import { getWeekDays } from '@/utils/get-week-days'

import { AppointmentTableRow } from './appointment-table-row'
import { AppointmentTableRowSkeleton } from './appointment-table-row-skeleton'

export function AppointmentsTable() {
  const { date } = useDate()

  const weekdays = getWeekDays(date || new Date())

  const weekdaysNumbers = weekdays.map((weekday) => new Date(weekday).getDate())

  const { data, isLoading } = useQuery({
    queryKey: ['appointments', weekdays],
    queryFn: () => getAppointments(weekdays),
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/6 pl-3">Time</TableHead>

            <TableHead className="w-1/6 text-center">
              Monday ({weekdaysNumbers[0]})
            </TableHead>

            <TableHead className="w-1/6 text-center">
              Tuesday ({weekdaysNumbers[1]})
            </TableHead>

            <TableHead className="w-1/6 text-center">
              Wednesday ({weekdaysNumbers[2]})
            </TableHead>

            <TableHead className="w-1/6 text-center">
              Thursday ({weekdaysNumbers[3]})
            </TableHead>

            <TableHead className="w-1/6 text-center">
              Friday ({weekdaysNumbers[4]})
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            !data &&
            Array.from({ length: 11 }).map((_, index) => (
              <AppointmentTableRowSkeleton key={index} time={index} />
            ))}

          {data?.appointmentsByTime &&
            timeIntervals.map((time, index) => (
              <AppointmentTableRow
                key={time}
                time={index}
                appointments={data.appointmentsByTime[index]}
              />
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
