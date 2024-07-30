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

export function AppointmentsTable() {
  const { date } = useDate()

  const weekdays = getWeekDays(date || new Date())

  const { data } = useQuery({
    queryKey: ['appointments', weekdays],
    queryFn: () => getAppointments(weekdays),
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/6 pl-3">Time</TableHead>
            <TableHead className="w-1/6 text-center">Monday</TableHead>
            <TableHead className="w-1/6 text-center">Tuesday</TableHead>
            <TableHead className="w-1/6 text-center">Wednesday</TableHead>
            <TableHead className="w-1/6 text-center">Thursday</TableHead>
            <TableHead className="w-1/6 text-center">Friday</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
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
