import { isMonday, subDays } from 'date-fns'
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
  const yesterday = isMonday(today) ? subDays(today, 3) : subDays(today, 1)

  const [todayChecks, yesterdayChecks] = await Promise.all([
    prisma.dailyOverride.count({
      where: {
        appointment: {
          userId: user.id,
        },
        date: today,
        isChecked: true,
        isCancelled: false,
      },
    }),
    prisma.dailyOverride.count({
      where: {
        appointment: {
          userId: user.id,
        },
        date: yesterday,
        isChecked: true,
        isCancelled: false,
      },
    }),
  ])

  const difference = todayChecks - yesterdayChecks
  let percentageChange = yesterdayChecks
    ? (difference / yesterdayChecks) * 100
    : todayChecks > 0
      ? 100
      : 0

  if (yesterdayChecks === 0 && percentageChange > 100) {
    percentageChange = 100
  }

  if (todayChecks === 0 && percentageChange < -100) {
    percentageChange = -100
  }

  const formattedPercentage = Math.round(percentageChange * 10) / 10

  return NextResponse.json(
    {
      amount: todayChecks,
      diffFromYesterday: formattedPercentage,
    },
    { status: 200 },
  )
}
