import { api } from './api-client'

interface RegisterNewPatientRequest {
  name: string
  phone: string
}

export async function registerNewPatientFn({
  name,
  phone,
}: RegisterNewPatientRequest) {
  await api.post('patients', {
    json: {
      name,
      phone,
    },
  })
}
