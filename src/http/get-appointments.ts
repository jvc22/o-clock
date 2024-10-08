import { api } from './api-client'

export interface GetAppointmentsResponse {
  appointmentsByTime: {
    id: string
    date: Date | null
    weekday: number | null
    time: number
    endDate: Date | null
    patient: {
      id: string
      name: string
      phone: string
      guardianName: string | null
    }
    isRecurring: boolean
    isChecked: boolean
  }[][]
}

export async function getAppointments(weekdays: string[]) {
  const queryString = weekdays.map((day) => day).join(',')

  const result = await api
    .get(`appointments?weekdays=${queryString}`)
    .json<GetAppointmentsResponse>()

  return result
}
