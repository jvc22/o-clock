import { api } from './api-client'

interface ScheduleNewAppointmentRequest {
  patientId: string
  date: string
  time: number
  isRecurring: boolean
}

export async function scheduleNewAppointmentFn({
  patientId,
  date,
  time,
  isRecurring,
}: ScheduleNewAppointmentRequest) {
  await api.post('appointments', {
    json: {
      patientId,
      date,
      time,
      isRecurring,
    },
  })
}
