import { HTTPError } from 'ky'
import { z } from 'zod'

import { registerNewPatientFn } from '@/http/register-new-patient'

const registerNewPatientSchem = z.object({
  name: z
    .string()
    .min(3, { message: 'Name should have at least 3 characters.' }),
  phone: z.string().min(1, { message: 'Please, provide a phone number.' }),
})

export async function registerNewPatient(data: FormData) {
  const result = registerNewPatientSchem.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { name, phone } = result.data

  try {
    await registerNewPatientFn({
      name,
      phone,
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    return {
      success: false,
      message: 'Unexpected error. Try again in a few minutes.',
      errors: null,
    }
  }

  return { success: true, message: null, errors: null }
}
