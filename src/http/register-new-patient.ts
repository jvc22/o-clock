import { api } from './api-client'

interface RegisterNewPatientRequest {
  name: string
  phone: string
  guardianName?: string
  guardianPhone?: string
}

export async function registerNewPatientFn({
  name,
  phone,
  guardianName,
  guardianPhone,
}: RegisterNewPatientRequest) {
  await api.post('patients', {
    json: {
      name,
      phone,
      guardianName,
      guardianPhone,
    },
  })
}
