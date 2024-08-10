import { CalendarRange } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MonthTotalSessionsCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Total sessions (month)
        </CardTitle>

        <CalendarRange className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="space-y-1">
        <span className="text-2xl font-bold">184</span>

        <p className="text-xs text-muted-foreground">
          <span className="text-emerald-500">+2%</span> compared to last month
        </p>
      </CardContent>
    </Card>
  )
}
