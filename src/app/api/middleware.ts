import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { z } from 'zod'

import { env } from '@/env'
import { prisma } from '@/lib/prisma'

export async function authMiddleware(request: NextRequest) {
  const bearerToken = request.headers.get('Authorization')

  if (!bearerToken) {
    return { user: null }
  }

  const token = bearerToken.split(' ')[1]

  console.log(token)

  const decoded = jwt.verify(token, env.JWT_SECRET)

  if (!decoded) {
    return { user: null }
  }

  const jwtPayloadSchema = z.object({
    userId: z.string(),
  })

  const payload = jwtPayloadSchema.safeParse(decoded)

  if (!payload.success) {
    return { user: null }
  }

  const { userId } = payload.data

  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })

  if (!user) {
    return { user: null }
  }

  return { user }
}
