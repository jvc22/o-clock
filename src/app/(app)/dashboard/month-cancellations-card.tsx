'use client'

import { useQuery } from '@tanstack/react-query'
import { CalendarX2, Loader2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getMonthCancelledSessions } from '@/http/get-month-cancelled-sessions'

import { CardSkeleton } from './card-skeleton'

export function MonthCancellationsCard() {
  const today = new Date().toDateString()

  const { data: monthCancelledSessions, isFetching } = useQuery({
    queryKey: ['metrics', 'cancelled-sessions'],
    queryFn: () => getMonthCancelledSessions({ today }),
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Cancellations (month)
        </CardTitle>

        {isFetching ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <CalendarX2 className="size-4 text-muted-foreground" />
        )}
      </CardHeader>

      <CardContent className="space-y-1">
        {monthCancelledSessions ? (
          <>
            <span className="text-2xl font-bold">
              {monthCancelledSessions.amount}
            </span>

            <p className="text-xs text-muted-foreground">
              <span
                className={
                  monthCancelledSessions.diffFromLastMonth >= 0
                    ? 'text-red-500'
                    : 'text-emerald-500'
                }
              >
                {monthCancelledSessions.diffFromLastMonth >= 0
                  ? `+${monthCancelledSessions.diffFromLastMonth}`
                  : `${monthCancelledSessions.diffFromLastMonth}`}
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
