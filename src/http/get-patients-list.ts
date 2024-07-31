import { api } from './api-client'

interface GetPatientsResponse {
  patients: {
    id: string
    name: string
    guardianName: string
  }[]
}

export async function getPatientsList() {
  const result = await api.get('patients/list').json<GetPatientsResponse>()

  return result
}
