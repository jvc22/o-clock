import { NextRequest, NextResponse } from 'next/server'

import { authMiddleware } from '../middleware'

export async function GET(request: NextRequest) {
  const { user } = await authMiddleware(request)

  if (!user) {
    return NextResponse.json({ message: 'User not found.' }, { status: 401 })
  }

  return NextResponse.json(
    {
      user,
    },
    { status: 200 },
  )
}
