'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { getYearSessionsHeld } from '@/http/get-year-sessions-held'

const chartConfig = {
  amount: {
    label: 'Sessions',
    color: 'var(--primary)',
  },
} satisfies ChartConfig

export function SessionsHeldChart() {
  const { data: sessionsHeldByMonth, isFetching } = useQuery({
    queryKey: ['charts', 'year-sessions-held'],
    queryFn: getYearSessionsHeld,
  })

  return (
    <Card>
      <CardHeader className="pb-8">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            Sessions held
            {isFetching && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </CardTitle>

          <CardDescription>
            Amount of sessions held through the last year period
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {sessionsHeldByMonth ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart
              accessibilityLayer
              style={{ fontSize: 12 }}
              data={sessionsHeldByMonth}
              margin={{ top: 48, left: 12, right: 12, bottom: 12 }}
            >
              <CartesianGrid className="!stroke-muted" vertical={false} />

              <XAxis
                tickMargin={8}
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />

              <Line
                type="natural"
                strokeWidth={2}
                dataKey="amount"
                stroke={'hsl(var(--primary))'}
                dot={{
                  fill: 'hsl(var(--primary))',
                }}
                activeDot={{
                  r: 6,
                  stroke: 'hsl(var(--primary))',
                }}
              >
                <LabelList
                  offset={12}
                  fontSize={14}
                  position="top"
                  className="fill-foreground"
                />
              </Line>
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] w-full items-center justify-center">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
