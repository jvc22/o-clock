import { api } from './api-client'

interface GetMonthSessionsHeldRequest {
  today: string
}

export interface GetMonthSessionsHeldResponse {
  amount: number
  diffFromLastMonth: number
}

export async function getMonthSessionsHeld({
  today,
}: GetMonthSessionsHeldRequest) {
  const result = await api
    .get(`dashboard/metrics/month-sessions-held?today=${today}`)
    .json<GetMonthSessionsHeldResponse>()

  return result
}
