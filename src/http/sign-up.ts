import { api } from './api-client'

interface SignUpRequest {
  name: string
  email: string
  password: string
}

type SignUpResponse = void

export async function signUpFn({
  name,
  email,
  password,
}: SignUpRequest): Promise<SignUpResponse> {
  await api.post('auth/sign-up', {
    json: {
      name,
      email,
      password,
    },
  })
}
