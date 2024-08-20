import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { NextResponse } from 'next/server'

import { authMiddleware } from '@/app/api/middleware'
import { prisma } from '@/lib/prisma'

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export async function GET(request: Request) {
  const { user } = await authMiddleware(request)

  if (!user) {
    return NextResponse.json({ message: 'User not found.' }, { status: 401 })
  }

  const today = new Date()

  const checksPerMonth = []

  for (let i = 0; i < 12; i++) {
    const monthDate = subMonths(today, i)
    const startOfCurrentMonth = startOfMonth(monthDate)
    const endOfCurrentMonth = endOfMonth(monthDate)

    const totalChecks = await prisma.dailyOverride.count({
      where: {
        appointment: {
          userId: user.id,
        },
        date: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
        isChecked: true,
      },
    })

    checksPerMonth.push({
      month: monthNames[monthDate.getMonth()],
      amount: totalChecks,
    })
  }

  checksPerMonth.reverse()

  return NextResponse.json(checksPerMonth, { status: 200 })
}
