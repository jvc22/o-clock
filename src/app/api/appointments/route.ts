import { getDay } from 'date-fns'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { timeIntervals } from '@/static/time-intervals'

import { authMiddleware } from '../middleware'

export async function GET(request: Request) {
  const { user } = await authMiddleware(request)

  if (!user) {
    return NextResponse.json({ message: 'User not found.' }, { status: 401 })
  }

  const url = new URL(request.url)
  const weekdaysQuery = url.searchParams.get('weekdays')

  if (!weekdaysQuery) {
    return NextResponse.json(
      { message: 'Missing weekdays parameter.' },
      { status: 400 },
    )
  }

  const weekdays = weekdaysQuery.split(',')

  const bodySchema = z.array(z.string().datetime())

  const body = bodySchema.safeParse(weekdays)
  if (!body.success) {
    console.error(body.error)
    return NextResponse.json(
      { message: 'Invalid weekdays parameter.' },
      { status: 400 },
    )
  }

  const parsedWeekdays = weekdays.map((dateString) => new Date(dateString))

  const appointments = await prisma.appointment.findMany({
    where: {
      OR: [
        { isRecurring: false, date: { in: parsedWeekdays } },
        {
          isRecurring: true,
          weekday: { in: parsedWeekdays.map((day) => day.getDay()) },
          AND: [
            { startDate: { lte: parsedWeekdays[parsedWeekdays.length - 1] } },
            {
              OR: [{ endDate: null }, { endDate: { gte: parsedWeekdays[0] } }],
            },
          ],
        },
      ],
    },
    select: {
      id: true,
      date: true,
      weekday: true,
      time: true,
      isRecurring: true,
      startDate: true,
      endDate: true,
      patient: {
        select: {
          id: true,
          name: true,
          guardianName: true,
        },
      },
      dailyOverrides: {
        select: {
          date: true,
          time: true,
          isChecked: true,
          isCancelled: true,
        },
      },
    },
  })

  const appointmentsByTime = timeIntervals.map((_, timeIndex) =>
    parsedWeekdays.map((day) => {
      const dayAppointments = appointments.filter((appointment) => {
        if (appointment.isRecurring) {
          const override = appointment.dailyOverrides.find(
            (override) =>
              override.date.toISOString().slice(0, 10) ===
                day.toISOString().slice(0, 10) && override.time === timeIndex,
          )

          if (override && !override.isCancelled) {
            return appointment.time === timeIndex
          }

          return (
            appointment.weekday === getDay(day) &&
            appointment.time === timeIndex &&
            appointment.startDate &&
            appointment.startDate <= day &&
            (appointment.endDate === null || appointment.endDate >= day)
          )
        } else {
          const override = appointment.dailyOverrides.find(
            (override) =>
              override.date.toISOString().slice(0, 10) ===
                day.toISOString().slice(0, 10) && override.time === timeIndex,
          )

          if (override && !override.isCancelled) {
            return appointment.time === timeIndex
          }

          return (
            appointment.date?.toISOString().slice(0, 10) ===
              day.toISOString().slice(0, 10) && appointment.time === timeIndex
          )
        }
      })

      const selectedAppointment = dayAppointments.find((appointment) => {
        const override = appointment.dailyOverrides.find(
          (override) =>
            override.date.toISOString().slice(0, 10) ===
              day.toISOString().slice(0, 10) && override.time === timeIndex,
        )

        return override ? !override.isCancelled : true
      })

      return selectedAppointment
        ? {
            id: selectedAppointment.id,
            patient: selectedAppointment.patient,
            date: selectedAppointment.isRecurring
              ? null
              : selectedAppointment.date,
            weekday: selectedAppointment.isRecurring
              ? selectedAppointment.weekday
              : null,
            time: selectedAppointment.time,
            isChecked: selectedAppointment.isRecurring
              ? selectedAppointment.dailyOverrides.some(
                  (override) =>
                    override.date.toISOString().slice(0, 10) ===
                      day.toISOString().slice(0, 10) &&
                    override.time === timeIndex &&
                    override.isChecked,
                )
              : selectedAppointment.dailyOverrides.some(
                  (override) =>
                    override.date.toISOString().slice(0, 10) ===
                      day.toISOString().slice(0, 10) &&
                    override.time === timeIndex &&
                    override.isChecked,
                ),
          }
        : null
    }),
  )

  return NextResponse.json({ appointmentsByTime }, { status: 200 })
}

export async function POST(request: Request) {
  const { user } = await authMiddleware(request)

  if (!user) {
    return NextResponse.json({ message: 'User not found.' }, { status: 401 })
  }

  const body = await request.json()

  const bodySchema = z.object({
    patientId: z.string(),
    date: z.string().datetime(),
    time: z.coerce.number().min(0).max(10),
    isRecurring: z.coerce.boolean(),
  })

  const appointment = bodySchema.safeParse(body)
  if (!appointment.success) {
    console.error(appointment.error)
    throw new Error()
  }

  const { patientId, date, time, isRecurring } = appointment.data

  const weekday = getDay(date)

  if (isRecurring) {
    const existingRecurringAppointment = await prisma.appointment.findFirst({
      where: {
        isRecurring: true,
        weekday,
        time,
        AND: [
          {
            OR: [{ endDate: null }, { endDate: { gte: new Date(date) } }],
          },
        ],
      },
    })

    if (existingRecurringAppointment) {
      return NextResponse.json(
        {
          message:
            'There is already a recurring appointment at this time and weekday.',
        },
        { status: 400 },
      )
    }
  }

  const newAppointment = await prisma.appointment.create({
    data: {
      userId: user?.id,
      patientId,
      date: isRecurring ? null : new Date(date),
      startDate: isRecurring ? new Date(date) : null,
      weekday: isRecurring ? weekday : null,
      time,
      isRecurring,
    },
  })

  if (!newAppointment) {
    return NextResponse.json({ message: 'An error occurred.' }, { status: 400 })
  }

  return NextResponse.json({}, { status: 201 })
}
