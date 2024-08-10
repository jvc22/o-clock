import { CalendarX2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MonthCancellationsCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Cancellations (month)
        </CardTitle>

        <CalendarX2 className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="space-y-1">
        <span className="text-2xl font-bold">5</span>

        <p className="text-xs text-muted-foreground">
          <span className="text-emerald-500">-8.9%</span> compared to last month
        </p>
      </CardContent>
    </Card>
  )
}
