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
    text: z.string(),
    date: z.string(),
  })

  const note = bodySchema.safeParse(body)
  if (!note.success) {
    console.error(note.error)
    throw new Error()
  }

  const { text, date } = note.data

  const newNote = await prisma.note.create({
    data: {
      text,
      createdAt: new Date(date),
    },
  })

  if (!newNote) {
    return NextResponse.json({ message: 'An error occurred.' }, { status: 400 })
  }

  return NextResponse.json({}, { status: 201 })
}
