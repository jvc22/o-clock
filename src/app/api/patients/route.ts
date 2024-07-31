import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { authMiddleware } from '../middleware'

export async function POST(request: Request) {
  const { user } = await authMiddleware(request)

  if (!user) {
    return NextResponse.json({ message: 'User not found.' }, { status: 401 })
  }

  const body = await request.json()

  const bodySchema = z.object({
    name: z.string(),
    phone: z.string(),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),
  })

  const patient = bodySchema.safeParse(body)
  if (!patient.success) {
    console.error(patient.error)
    throw new Error()
  }

  const { name, phone, guardianName, guardianPhone } = patient.data

  const newPatient = await prisma.patient.create({
    data: {
      name,
      phone,
      guardianName,
      guardianPhone,
      userId: user.id,
    },
  })

  if (!newPatient) {
    return NextResponse.json({ message: 'An error occurred.' }, { status: 400 })
  }

  return NextResponse.json({}, { status: 201 })
}
