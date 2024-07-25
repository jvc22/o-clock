import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { env } from '@/env'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json()

  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const userCredentials = bodySchema.safeParse(body)
  if (!userCredentials.success) {
    console.error(userCredentials.error)
    throw new Error()
  }

  const { email, password } = userCredentials.data

  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    return NextResponse.json({ message: 'User not found.' }, { status: 404 })
  }

  const passwordOk = await bcrypt.compare(password, user.hashPassword)

  if (!passwordOk) {
    return NextResponse.json(
      { message: 'Invalid credentials.' },
      { status: 404 },
    )
  }

  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 * 7,
  })

  if (token) {
    return NextResponse.json({ token }, { status: 200 })
  }

  return NextResponse.json({ message: 'An error occurred.' }, { status: 400 })
}
