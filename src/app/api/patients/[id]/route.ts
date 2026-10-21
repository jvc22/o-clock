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

  const patientId = parseParams(params)

  const body = await request.json()

  const bodySchema = z.object({
    name: z.string(),
    phone: z.string(),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),
  })

  const result = bodySchema.safeParse(body)
  if (!result.success) {
    console.error(result.error)
    throw new Error()
  }

  const patient = await prisma.patient.findUnique({
    where: {
      id: patientId,
    },
  })

  if (!patient || patient.userId !== user.id) {
    return NextResponse.json({ message: 'Patient not found.' }, { status: 404 })
  }

  const { name, phone, guardianName, guardianPhone } = result.data

  await prisma.patient.update({
    where: {
      id: patientId,
    },
    data: {
      name,
      phone,
      guardianName,
      guardianPhone,
    },
  })

  return NextResponse.json({}, { status: 200 })
}
