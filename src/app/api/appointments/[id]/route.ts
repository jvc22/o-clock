import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { authMiddleware } from '../../middleware'

type RouteParams = {
  id: string
}

function parseParams(routeParams: RouteParams) {
  const paramsSchema = z.object({
    params: z.object({
      id: z.string().cuid(),
    }),
  })

  const safeParams = paramsSchema.safeParse(routeParams)
  if (!safeParams.success) {
    console.error(safeParams.error)
    throw new Error('Invalid parameters')
  }

  return safeParams.data.params.id
}

export async function PUT(request: Request, params: RouteParams) {
  const { user } = await authMiddleware(request)

  if (!user) {
    return NextResponse.json({ message: 'User not found.' }, { status: 401 })
  }

  const appointmentId = parseParams(params)

  const body = await request.json()

  const bodySchema = z.object({
    isChecked: z.coerce.boolean(),
    date: z.string().datetime().nullable(),
  })

  const result = bodySchema.safeParse(body)
  if (!result.success) {
    console.error(result.error)
    throw new Error()
  }

  const { isChecked, date } = result.data

  const appointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId,
    },
    include: {
      dailyOverrides: true,
    },
  })

  if (!appointment) {
    return NextResponse.json(
      { message: 'Appointment not found.' },
      { status: 404 },
    )
  }

  if (appointment.isRecurring) {
    if (!date) {
      return NextResponse.json(
        { message: 'Date is required for recurring appointments.' },
        { status: 400 },
      )
    }

    const existingOverride = appointment.dailyOverrides.find(
      (override) =>
        override.date.toISOString().slice(0, 10) === date.slice(0, 10) &&
        override.time === appointment.time,
    )

    if (existingOverride) {
      await prisma.dailyOverride.update({
        where: {
          id: existingOverride.id,
        },
        data: {
          isChecked,
        },
      })
    } else {
      await prisma.dailyOverride.create({
        data: {
          appointmentId: appointment.id,
          date,
          time: appointment.time,
          isChecked,
          isCancelled: false,
        },
      })
    }

    return NextResponse.json({}, { status: 200 })
  } else {
    if (!appointment.date) {
      return NextResponse.json(
        { message: 'Appointment date is missing.' },
        { status: 400 },
      )
    }

    const existingOverride = appointment.dailyOverrides.find(
      (override) =>
        override.date.toISOString().slice(0, 10) ===
          appointment.date?.toISOString().slice(0, 10) &&
        override.time === appointment.time,
    )

    if (existingOverride) {
      await prisma.dailyOverride.update({
        where: {
          id: existingOverride.id,
        },
        data: {
          isChecked,
        },
      })
    } else {
      await prisma.dailyOverride.create({
        data: {
          appointmentId: appointment.id,
          date: appointment.date,
          time: appointment.time,
          isChecked,
          isCancelled: false,
        },
      })
    }

    return NextResponse.json({}, { status: 200 })
  }
}

export async function DELETE(request: Request, params: RouteParams) {
  const { user } = await authMiddleware(request)

  if (!user) {
    return NextResponse.json({ message: 'User not found.' }, { status: 401 })
  }

  const appointmentId = parseParams(params)

  const body = await request.json()

  const bodySchema = z.object({
    isRecurring: z.coerce.boolean(),
    endDate: z.string().datetime().optional(),
    date: z.string().datetime().optional(),
    time: z.coerce.number().optional(),
  })

  const result = bodySchema.safeParse(body)
  if (!result.success) {
    console.error(result.error)
    throw new Error()
  }

  const { isRecurring, endDate, date, time } = result.data

  if (isRecurring) {
    if (endDate) {
      await prisma.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          endDate: new Date(endDate),
        },
      })
    }

    if (date && time !== undefined && time >= 0) {
      const existingOverride = await prisma.dailyOverride.findFirst({
        where: {
          appointmentId,
          date: new Date(date),
        },
      })

      if (existingOverride) {
        await prisma.dailyOverride.update({
          where: {
            id: existingOverride.id,
          },
          data: {
            isCancelled: true,
          },
        })
      } else {
        await prisma.dailyOverride.create({
          data: {
            appointmentId,
            date: new Date(date),
            time,
            isCancelled: true,
          },
        })
      }
    }
  } else {
    await prisma.appointment.delete({
      where: {
        id: appointmentId,
      },
    })
  }

  return NextResponse.json({}, { status: 200 })
}
