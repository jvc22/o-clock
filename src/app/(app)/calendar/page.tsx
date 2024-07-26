import { NotebookPen, Plus, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { timeIntervals } from '@/static/time-intervals'

import { CalendarForm } from './calendar-form'

export default function Calendar() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>

      <div className="flex items-start gap-6">
        <section className="space-y-4">
          <CalendarForm />

          <Button className="flex w-full items-center">
            <UserPlus className="mr-2 size-4" />
            Register new patient
          </Button>

          <div className="h-px w-full bg-border" />

          <div className="grid grid-cols-2">
            <Button variant="secondary" className="flex items-center">
              <NotebookPen className="mr-2 size-4" />
              New note
            </Button>

            <Button variant="link" className="flex items-center">
              See your notes
            </Button>
          </div>
        </section>

        <section className="w-full">
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
                {timeIntervals.map((time) => (
                  <TableRow key={time} className="group border-0">
                    <TableCell className="pl-3 font-mono text-muted-foreground transition-all group-hover:text-foreground">
                      {time}
                    </TableCell>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableCell
                        key={index}
                        className={cn(index > 0 && 'border-l')}
                      >
                        <Button
                          variant="ghost"
                          className="flex w-full items-center justify-center"
                        >
                          <Plus className="size-4 text-muted-foreground transition-all group-hover:text-foreground" />
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
