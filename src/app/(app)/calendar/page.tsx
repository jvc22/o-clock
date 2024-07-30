import { NotebookPen, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'

import { AppointmentsTable } from './appointments-table'
import { CalendarForm } from './calendar'
import { NewPatientForm } from './new-patient-form'

export default function Calendar() {
  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>

      <div className="flex items-start gap-4">
        <section className="space-y-4">
          <CalendarForm />

          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex w-full items-center">
                <UserPlus className="mr-2 size-4" />
                Register new patient
              </Button>
            </DialogTrigger>

            <NewPatientForm />
          </Dialog>

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
          <AppointmentsTable />
        </section>
      </div>
    </main>
  )
}
