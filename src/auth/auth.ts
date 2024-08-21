import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getProfile } from '@/http/get-profile'

export async function auth() {
  const token = cookies().get('oclock-token')?.value

  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getProfile()

    return user
  } catch (err) {
    redirect('/auth/sign-in')
  }
}

export function isAuthenticated() {
  return !!cookies().get('oclock-token')?.value
}
