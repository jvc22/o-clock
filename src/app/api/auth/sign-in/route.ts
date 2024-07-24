import { NextResponse } from 'next/server'
import { z } from 'zod'

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

  const { email } = userCredentials.data

  if (email === 'johndoe@example.com') {
    return NextResponse.json({ token: 'token' }, { status: 200 })
  }

  return NextResponse.json({ message: 'Invalid credentials.' }, { status: 404 })
}
