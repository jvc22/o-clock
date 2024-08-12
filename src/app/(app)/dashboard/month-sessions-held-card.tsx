'use client'

import { useQuery } from '@tanstack/react-query'
import { CalendarCheck2, Loader2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getMonthSessionsHeld } from '@/http/get-month-sessions-held'

import { CardSkeleton } from './card-skeleton'

export function MonthSessionsHeldCard() {
  const today = new Date().toDateString()

  const { data: monthSessionsHeld, isFetching } = useQuery({
    queryKey: ['metrics', 'held-sessions'],
    queryFn: () => getMonthSessionsHeld({ today }),
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Sessions held (month)
        </CardTitle>

        {isFetching ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <CalendarCheck2 className="size-4 text-muted-foreground" />
        )}
      </CardHeader>

      <CardContent className="space-y-1">
        {monthSessionsHeld ? (
          <>
            <span className="text-2xl font-bold">
              {monthSessionsHeld.amount}
            </span>

            <p className="text-xs text-muted-foreground">
              <span
                className={
                  monthSessionsHeld.diffFromLastMonth >= 0
                    ? 'text-emerald-500'
                    : 'text-red-500'
                }
              >
                {monthSessionsHeld.diffFromLastMonth >= 0
                  ? `+${monthSessionsHeld.diffFromLastMonth}`
                  : `${monthSessionsHeld.diffFromLastMonth}`}
                %
              </span>{' '}
              compared to last month
            </p>
          </>
        ) : (
          <CardSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
