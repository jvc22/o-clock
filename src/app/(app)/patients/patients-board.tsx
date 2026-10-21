'use client'

import { useQuery } from '@tanstack/react-query'
import { Ban } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getPatients } from '@/http/get-patients'

import { PatientCard } from './patient-card'
import { PatientCardSkeleton } from './patient-card-skeleton'

export function PatientsBoard() {
  const { data, isLoading } = useQuery({
    queryKey: ['patients', 'all'],
    queryFn: getPatients,
  })

  const isEmpty = data && data.patients.length === 0

  return (
    <div className="grid grid-cols-3 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
      {isEmpty && (
        <div className="flex flex-col gap-4 rounded-md border border-border px-4 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Nothing here...</span>

            <Button disabled variant="ghost" className="size-6 p-0">
              <Ban className="size-4" />
            </Button>
          </div>

          <h4 className="text-lg font-medium">No patient found</h4>

          <div className="h-20 text-sm">
            You do not have any patients registered. Use the{' '}
            <span className="font-medium text-foreground">
              Register new patient
            </span>{' '}
            button above to add your first one.
          </div>
        </div>
      )}

      {isLoading &&
        !data &&
        Array.from({ length: 8 }).map((_, index) => (
          <PatientCardSkeleton key={index} />
        ))}

      {data?.patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  )
}
