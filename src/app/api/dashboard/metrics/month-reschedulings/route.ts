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

  const [currentMonthReschedulings, lastMonthReschedulings] = await Promise.all(
    [
      prisma.appointment.count({
        where: {
          isRecurring: false,
          date: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth,
          },
        },
      }),
      prisma.appointment.count({
        where: {
          isRecurring: false,
          date: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
      }),
    ],
  )

  const difference = currentMonthReschedulings - lastMonthReschedulings
  let percentageChange = lastMonthReschedulings
    ? (difference / lastMonthReschedulings) * 100
    : currentMonthReschedulings > 0
      ? 100
      : 0

  if (lastMonthReschedulings === 0 && percentageChange > 100) {
    percentageChange = 100
  }

  if (currentMonthReschedulings === 0 && percentageChange < -100) {
    percentageChange = -100
  }

  const formattedPercentage = Math.round(percentageChange * 10) / 10

  return NextResponse.json(
    {
      amount: currentMonthReschedulings,
      diffFromLastMonth: formattedPercentage,
    },
    { status: 200 },
  )
}
