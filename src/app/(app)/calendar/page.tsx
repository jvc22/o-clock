import { Plus, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { timeIntervals } from '@/static/time-intervals'

import { CalendarForm } from './calendar-form'

export default function Calendar() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>

      <div className="flex items-start gap-6">
        <section className="space-y-4">
          <CalendarForm />

          <Button variant="secondary" className="flex w-full items-center">
            <UserPlus className="mr-2 size-4" />
            Register new patient
          </Button>
        </section>

        <section className="w-full">
          <div className="rounded-md border">
            <Table className="">
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
                {timeIntervals.map((time) => (
                  <TableRow key={time}>
                    <TableCell className="pl-3 font-mono text-muted-foreground">
                      {time}
                    </TableCell>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableCell key={index}>
                        <Button
                          variant="ghost"
                          className="flex w-full items-center justify-center"
                        >
                          <Plus className="size-4" />
                        </Button>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </main>
  )
}
