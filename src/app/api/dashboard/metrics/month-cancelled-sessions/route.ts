import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { NextResponse } from 'next/server'

import { authMiddleware } from '@/app/api/middleware'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { user } = await authMiddleware(request)

  if (!user) {
    return NextResponse.json({ message: 'User not found.' }, { status: 401 })
  }

  const url = new URL(request.url)
  const dateQuery = url.searchParams.get('today')

  if (!dateQuery) {
    return NextResponse.json(
      { message: 'Missing today parameter.' },
      { status: 400 },
    )
  }

  const today = new Date(dateQuery)
  const startOfCurrentMonth = startOfMonth(today)
  const endOfCurrentMonth = endOfMonth(today)

  const startOfLastMonth = startOfMonth(subMonths(today, 1))
  const endOfLastMonth = endOfMonth(subMonths(today, 1))

  const [currentMonthCancellations, lastMonthCancellations] = await Promise.all(
    [
      prisma.dailyOverride.count({
        where: {
          appointment: {
            userId: user.id,
          },
          date: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth,
          },
          isCancelled: true,
        },
      }),
      prisma.dailyOverride.count({
        where: {
          appointment: {
            userId: user.id,
          },
          date: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
          isCancelled: true,
        },
      }),
    ],
  )

  const difference = currentMonthCancellations - lastMonthCancellations
  let percentageChange = lastMonthCancellations
    ? (difference / lastMonthCancellations) * 100
    : currentMonthCancellations > 0
      ? 100
      : 0

  if (lastMonthCancellations === 0 && percentageChange > 100) {
    percentageChange = 100
  }

  if (currentMonthCancellations === 0 && percentageChange < -100) {
    percentageChange = -100
  }

  const formattedPercentage = Math.round(percentageChange * 10) / 10

  return NextResponse.json(
    {
      amount: currentMonthCancellations,
      diffFromLastMonth: formattedPercentage,
    },
    { status: 200 },
  )
}
