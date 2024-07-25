'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { signInFn } from '@/http/sign-in'

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please, provide a valid e-mail address.' }),
  password: z.string().min(1, { message: 'Please, provide your password.' }),
})

export async function signIn(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { email, password } = result.data

  try {
    const { token } = await signInFn({
      email,
      password,
    })

    cookies().set('sdc-app-token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      secure: true,
      sameSite: true,
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    console.log(err)

    return {
      success: false,
      message: 'Unexpected error. Try again in a few minutes.',
      errors: null,
    }
  }

  return { success: true, message: null, errors: null }
}
