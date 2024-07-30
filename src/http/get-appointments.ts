import { api } from './api-client'

export interface GetAppointmentsResponse {
  appointmentsByTime: {
    id: string
    date: Date | null
    weekday: number | null
    time: number
    patient: {
      id: string
      name: string
      guardianName: string | null
    }
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
