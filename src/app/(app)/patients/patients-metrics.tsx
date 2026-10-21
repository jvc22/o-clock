'use client'

import { useQuery } from '@tanstack/react-query'
import { CalendarOff, Users } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getPatients } from '@/http/get-patients'

export function PatientsMetrics() {
  const { data } = useQuery({
    queryKey: ['patients', 'all'],
    queryFn: getPatients,
  })

  const total = data?.patients.length
  const unscheduled = data?.patients.filter(
    (patient) => patient.appointmentsCount === 0,
  ).length

  return (
    <Card>
      <CardContent className="divide-y p-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4" />
            Total patients
          </span>

          {total !== undefined ? (
            <span className="text-lg font-bold">{total}</span>
          ) : (
            <Skeleton className="h-6 w-8" />
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarOff className="size-4" />
            Unscheduled
          </span>

          {unscheduled !== undefined ? (
            <span className="text-lg font-bold">{unscheduled}</span>
          ) : (
            <Skeleton className="h-6 w-8" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
