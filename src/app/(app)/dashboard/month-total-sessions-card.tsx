'use client'

import { useQuery } from '@tanstack/react-query'
import { CalendarRange, Loader2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getMonthTotalSessions } from '@/http/get-month-total-sessions'

import { CardSkeleton } from './card-skeleton'

export function MonthTotalSessionsCard() {
  const today = new Date().toDateString()

  const { data: monthTotalSessions, isFetching } = useQuery({
    queryKey: ['metrics', 'total-sessions'],
    queryFn: () => getMonthTotalSessions({ today }),
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Total sessions (month)
        </CardTitle>

        {isFetching ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <CalendarRange className="size-4 text-muted-foreground" />
        )}
      </CardHeader>

      <CardContent className="space-y-1">
        {monthTotalSessions ? (
          <>
            <span className="text-2xl font-bold">
              {monthTotalSessions.amount}
            </span>

            <p className="text-xs text-muted-foreground">
              <span
                className={
                  monthTotalSessions.diffFromLastMonth >= 0
                    ? 'text-emerald-500'
                    : 'text-red-500'
                }
              >
                {monthTotalSessions.diffFromLastMonth >= 0
                  ? `+${monthTotalSessions.diffFromLastMonth}`
                  : `${monthTotalSessions.diffFromLastMonth}`}
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
