'use server'

import { HTTPError } from 'ky'
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

    console.log(token)
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    console.error(err)

    return {
      success: false,
      message: 'Unexpected error. Try again in a few minutes.',
      errors: null,
    }
  }

  return { success: true, message: null, errors: null }
}
