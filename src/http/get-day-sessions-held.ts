import { api } from './api-client'

interface GetDaySessionsHeldRequest {
  today: string
}

export interface GetDaySessionsHeldResponse {
  amount: number
  diffFromYesterday: number
}

export async function getDaySessionsHeld({ today }: GetDaySessionsHeldRequest) {
  const result = await api
    .get(`dashboard/metrics/day-sessions-held?today=${today}`)
    .json<GetDaySessionsHeldResponse>()

  return result
}
