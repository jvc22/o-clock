'use client'

import { useQuery } from '@tanstack/react-query'
import { CalendarCog, Loader2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getMonthReschedulings } from '@/http/get-month-reschedulings'

import { CardSkeleton } from './card-skeleton'

export function MonthReschedulingsCard() {
  const today = new Date().toDateString()

  const { data: monthReschedulings, isFetching } = useQuery({
    queryKey: ['metrics', 'reschedulings'],
    queryFn: () => getMonthReschedulings({ today }),
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Reschedulings (month)
        </CardTitle>

        {isFetching ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <CalendarCog className="size-4 text-muted-foreground" />
        )}
      </CardHeader>

      <CardContent className="space-y-1">
        {monthReschedulings ? (
          <>
            <span className="text-2xl font-bold">
              {monthReschedulings.amount}
            </span>

            <p className="text-xs text-muted-foreground">
              <span className="text-zinc-500 dark:text-zinc-200">
                {monthReschedulings.diffFromLastMonth >= 0
                  ? `+${monthReschedulings.diffFromLastMonth}`
                  : `${monthReschedulings.diffFromLastMonth}`}
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
