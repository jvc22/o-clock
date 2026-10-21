import { api } from './api-client'

export interface GetPatientsResponse {
  patients: {
    id: string
    name: string
    phone: string
    guardianName: string | null
    guardianPhone: string | null
    createdAt: string
    appointmentsCount: number
  }[]
}

export async function getPatients() {
  const result = await api.get('patients').json<GetPatientsResponse>()

  return result
}
