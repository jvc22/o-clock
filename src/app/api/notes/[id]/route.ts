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

export async function DELETE(request: Request, params: RouteParams) {
  const { user } = await authMiddleware(request)

  if (!user) {
    return NextResponse.json({ message: 'User not found.' }, { status: 401 })
  }

  const noteId = parseParams(params)

  const note = await prisma.note.delete({
    where: {
      id: noteId,
    },
  })

  if (!note) {
    return NextResponse.json({ message: 'Note not found.' }, { status: 404 })
  }

  return NextResponse.json({}, { status: 200 })
}
