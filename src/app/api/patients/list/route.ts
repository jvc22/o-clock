import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

import { authMiddleware } from '../../middleware'

export async function GET(request: Request) {
  const { user } = await authMiddleware(request)

  if (!user) {
    return NextResponse.json({ message: 'User not found.' }, { status: 401 })
  }

  const patients = await prisma.patient.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      name: true,
      guardianName: true,
    },
  })

  return NextResponse.json({ patients }, { status: 200 })
}
