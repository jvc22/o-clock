import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json()

  const bodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  const userCredentials = bodySchema.safeParse(body)
  if (!userCredentials.success) {
    console.error(userCredentials.error)
    throw new Error()
  }

  const { name, email, password } = userCredentials.data

  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userAlreadyExists) {
    return NextResponse.json(
      { message: 'E-mail already registered.' },
      { status: 403 },
    )
  }

  const hashPassword = await bcrypt.hash(password, 10)

  const newUser = {
    name,
    email,
    hashPassword,
  }

  const user = await prisma.user.create({
    data: newUser,
  })

  if (user) {
    return NextResponse.json(user.id, { status: 201 })
  }

  return NextResponse.json({ message: 'An error occurred.' }, { status: 400 })
}
