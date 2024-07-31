import { HTTPError } from 'ky'
import { z } from 'zod'

import { addNewNoteFn } from '@/http/add-new-note'
import { registerNewPatientFn } from '@/http/register-new-patient'
import { scheduleNewAppointmentFn } from '@/http/schedule-new-appointment'

const registerNewPatientSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name should have at least 3 characters.' }),
  phone: z.string().min(1, { message: 'Please, provide a phone number.' }),
  guardian_name: z.string().optional(),
  guardian_phone: z.string().optional(),
})

export async function registerNewPatient(data: FormData) {
  const result = registerNewPatientSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const {
    name,
    phone,
    guardian_name: guardianName,
    guardian_phone: guardianPhone,
  } = result.data

  try {
    await registerNewPatientFn({
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

const scheduleNewAppointmentSchema = z.object({
  patient: z.string().min(1, { message: 'Please, select a patient.' }),
  date: z.string().datetime(),
  time: z.coerce.number(),
  is_recurring: z.coerce.boolean(),
})

export async function scheduleNewAppointment(data: FormData) {
  const result = scheduleNewAppointmentSchema.safeParse(
    Object.fromEntries(data),
  )

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const {
    patient: patientId,
    date,
    time,
    is_recurring: isRecurring,
  } = result.data

  try {
    await scheduleNewAppointmentFn({
      patientId,
      date,
      time,
      isRecurring,
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

const addNewNoteSchema = z.object({
  text: z.string().min(1, { message: 'Notes should not be empty.' }),
})

export async function addNewNote(data: FormData) {
  const result = addNewNoteSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { text } = result.data

  try {
    await addNewNoteFn({ text, date: new Date().toDateString() })
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
