'use client'

import { useQuery } from '@tanstack/react-query'
import { CalendarCheck, Loader2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDaySessionsHeld } from '@/http/get-day-sessions-held'

import { CardSkeleton } from './card-skeleton'

export function DaySessionsHeldCard() {
  const today = new Date().toDateString()

  const { data: daySessionsHeld, isFetching } = useQuery({
    queryKey: ['metrics', 'reschedulings'],
    queryFn: () => getDaySessionsHeld({ today }),
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Sessions held (day)
        </CardTitle>

        {isFetching ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <CalendarCheck className="size-4 text-muted-foreground" />
        )}
      </CardHeader>

      <CardContent className="space-y-1">
        {daySessionsHeld ? (
          <>
            <span className="text-2xl font-bold">{daySessionsHeld.amount}</span>

            <p className="text-xs text-muted-foreground">
              <span
                className={
                  daySessionsHeld.diffFromYesterday >= 0
                    ? 'text-emerald-500'
                    : 'text-red-500'
                }
              >
                {daySessionsHeld.diffFromYesterday >= 0
                  ? `+${daySessionsHeld.diffFromYesterday}`
                  : `${daySessionsHeld.diffFromYesterday}`}
                %
              </span>{' '}
              compared to yesterday
            </p>
          </>
        ) : (
          <CardSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
