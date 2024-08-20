import { api } from './api-client'

export interface GetYearSessionsHeldResponse {
  month: string
  amount: number
}

export async function getYearSessionsHeld() {
  const result = await api
    .get('dashboard/charts/year-sessions-held')
    .json<GetYearSessionsHeldResponse[]>()

  return result
}
