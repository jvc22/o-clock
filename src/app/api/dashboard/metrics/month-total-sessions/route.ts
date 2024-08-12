import { Prisma } from '@prisma/client'
import {
  eachDayOfInterval,
  endOfMonth,
  getDay,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { NextResponse } from 'next/server'

import { authMiddleware } from '@/app/api/middleware'
import { prisma } from '@/lib/prisma'

type AppointmentWithOverrides = Prisma.AppointmentGetPayload<{
  select: {
    startDate: true
    endDate: true
    isRecurring: true
    weekday: true
    date: true
    dailyOverrides: {
      select: {
        isCancelled: true
        date: true
      }
    }
  }
}>

function calculateWeekdayOccurrences(
  startDate: Date,
  endDate: Date,
  weekday: number,
) {
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate })

  return daysInMonth.filter((day) => getDay(day) === weekday).length
}

function countAppointments(
  appointments: AppointmentWithOverrides[],
  startOfMonth: Date,
  endOfMonth: Date,
) {
  const counts = {
    sporadic: 0,
    recurring: 0,
  }

  appointments.forEach((appointment) => {
    if (!appointment.isRecurring) {
      counts.sporadic += 1
    } else {
      const actualStartDate = appointment.startDate
        ? new Date(
            Math.max(startOfMonth.getTime(), appointment.startDate.getTime()),
          )
        : startOfMonth

      const actualEndDate = appointment.endDate
        ? new Date(
            Math.min(endOfMonth.getTime(), appointment.endDate.getTime() - 1),
          )
        : endOfMonth

      const weekdayOccurrences = appointment.isRecurring
        ? calculateWeekdayOccurrences(
            actualStartDate,
            actualEndDate,
            appointment.weekday!,
          )
        : 0

      const cancellations = appointment.dailyOverrides.filter(
        (override) =>
          override.isCancelled &&
          override.date >= actualStartDate &&
          override.date <= actualEndDate,
      ).length

      counts.recurring += Math.max(0, weekdayOccurrences - cancellations)
    }
  })

  return counts
}

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

  const [currentMonthAppointments, lastMonthAppointments] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        userId: user.id,
        OR: [
          {
            AND: [
              { startDate: { lte: endOfCurrentMonth } },
              {
                OR: [
                  { endDate: null },
                  { endDate: { gt: startOfCurrentMonth } },
                ],
              },
            ],
          },
          {
            AND: [
              { date: { gte: startOfCurrentMonth } },
              { date: { lte: endOfCurrentMonth } },
              { startDate: null },
            ],
          },
        ],
      },
      select: {
        startDate: true,
        endDate: true,
        isRecurring: true,
        weekday: true,
        date: true,
        dailyOverrides: {
          select: {
            isCancelled: true,
            date: true,
          },
        },
      },
    }),
    prisma.appointment.findMany({
      where: {
        userId: user.id,
        OR: [
          {
            AND: [
              { startDate: { lte: endOfLastMonth } },
              {
                OR: [{ endDate: null }, { endDate: { gt: startOfLastMonth } }],
              },
            ],
          },
          {
            AND: [
              { date: { gte: startOfLastMonth } },
              { date: { lte: endOfLastMonth } },
              { startDate: null },
            ],
          },
        ],
      },
      select: {
        startDate: true,
        endDate: true,
        isRecurring: true,
        weekday: true,
        date: true,
        dailyOverrides: {
          select: {
            isCancelled: true,
            date: true,
          },
        },
      },
    }),
  ])

  const {
    sporadic: currentMonthSporadicCount,
    recurring: currentMonthRecurringCount,
  } = countAppointments(
    currentMonthAppointments,
    startOfCurrentMonth,
    endOfCurrentMonth,
  )

  const {
    sporadic: lastMonthSporadicCount,
    recurring: lastMonthRecurringCount,
  } = countAppointments(lastMonthAppointments, startOfLastMonth, endOfLastMonth)

  const totalCurrentMonthCount =
    currentMonthSporadicCount + currentMonthRecurringCount
  const totalLastMonthCount = lastMonthSporadicCount + lastMonthRecurringCount

  const difference = totalCurrentMonthCount - totalLastMonthCount
  let percentageChange = totalLastMonthCount
    ? (difference / totalLastMonthCount) * 100
    : totalCurrentMonthCount > 0
      ? 100
      : 0

  if (totalLastMonthCount === 0 && percentageChange > 100) {
    percentageChange = 100
  }

  if (totalCurrentMonthCount === 0 && percentageChange < -100) {
    percentageChange = -100
  }

  const formattedPercentage = Math.round(percentageChange * 10) / 10

  return NextResponse.json(
    {
      amount: totalCurrentMonthCount,
      diffFromLastMonth: formattedPercentage,
    },
    { status: 200 },
  )
}
