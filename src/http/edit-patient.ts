import { api } from './api-client'

interface EditPatientRequest {
  id: string
  name: string
  phone: string
  guardianName?: string
  guardianPhone?: string
}

export async function editPatientFn({
  id,
  name,
  phone,
  guardianName,
  guardianPhone,
}: EditPatientRequest) {
  await api.put(`patients/${id}`, {
    json: {
      name,
      phone,
      guardianName,
      guardianPhone,
    },
  })
}
