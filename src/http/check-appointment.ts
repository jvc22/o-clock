import { api } from './api-client'

interface CheckAppointmentRequest {
  id: string
  isChecked: boolean
  date?: Date | string | null
}

export async function checkAppointment({
  id,
  isChecked,
  date,
}: CheckAppointmentRequest) {
  await api.put(`appointments/${id}`, {
    json: {
      isChecked,
      date,
    },
  })
}
