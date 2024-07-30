import { api } from './api-client'

interface CancelAppointmentRequest {
  id: string
  isRecurring: boolean
  endDate?: string
  date?: string
  time?: number
}

export async function cancelAppointment({
  id,
  isRecurring,
  endDate,
  date,
  time,
}: CancelAppointmentRequest) {
  await api.delete(`appointments/${id}`, {
    json: {
      isRecurring,
      endDate,
      date,
      time,
    },
  })
}
