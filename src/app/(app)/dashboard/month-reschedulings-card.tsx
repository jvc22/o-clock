import { CalendarCog } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MonthReschedulingsCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Reschedulings (month)
        </CardTitle>

        <CalendarCog className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="space-y-1">
        <span className="text-2xl font-bold">7</span>

        <p className="text-xs text-muted-foreground">
          <span className="text-zinc-200">-1.5%</span> compared to last month
        </p>
      </CardContent>
    </Card>
  )
}
