import { HTTPError } from 'ky'
import { z } from 'zod'

import { editPatientFn } from '@/http/edit-patient'

const editPatientSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .min(3, { message: 'Name should have at least 3 characters.' }),
  phone: z.string().min(1, { message: 'Please, provide a phone number.' }),
  guardian_name: z.string().optional(),
  guardian_phone: z.string().optional(),
})

export async function editPatient(data: FormData) {
  const result = editPatientSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const {
    id,
    name,
    phone,
    guardian_name: guardianName,
    guardian_phone: guardianPhone,
  } = result.data

  try {
    await editPatientFn({
      id,
      name,
      phone,
      guardianName,
      guardianPhone,
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
