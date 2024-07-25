'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { signUpFn } from '@/http/sign-up'

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'Name should have at least 3 characters.' }),
    email: z
      .string()
      .email({ message: 'Please, provide a valid e-mail address.' }),
    password: z
      .string()
      .min(8, { message: 'Password should have at least 6 characters.' }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ['password_confirmation'],
    message: 'Both passwords must match.',
  })

export async function signUp(data: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { name, email, password } = result.data

  try {
    await signUpFn({
      name,
      email,
      password,
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
