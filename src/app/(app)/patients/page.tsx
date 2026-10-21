import { UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'

import { NewPatientForm } from '../calendar/new-patient-form'
import { PatientsBoard } from './patients-board'
import { PatientsMetrics } from './patients-metrics'

export default function Patients() {
  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Patients</h1>

      <div className="flex items-start gap-4 max-md:grid">
        <section className="w-full space-y-4 md:w-[250px] md:shrink-0">
          <PatientsMetrics />

          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex w-full items-center">
                <UserPlus className="mr-2 size-4" />
                Register new patient
              </Button>
            </DialogTrigger>

            <NewPatientForm />
          </Dialog>
        </section>

        <section className="w-full">
          <PatientsBoard />
        </section>
      </div>
    </main>
  )
}
