import { CalendarCheck2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MonthSessionsHeldCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Sessions held (month)
        </CardTitle>

        <CalendarCheck2 className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="space-y-1">
        <span className="text-2xl font-bold">48</span>

        <p className="text-xs text-muted-foreground">
          <span className="text-red-500">-6.7%</span> compared to last month
        </p>
      </CardContent>
    </Card>
  )
}
