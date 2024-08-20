import { api } from './api-client'

interface GetMonthReschedulingsRequest {
  today: string
}

export interface GetMonthReschedulingsResponse {
  amount: number
  diffFromLastMonth: number
}

export async function getMonthReschedulings({
  today,
}: GetMonthReschedulingsRequest) {
  const result = await api
    .get(`dashboard/metrics/month-reschedulings?today=${today}`)
    .json<GetMonthReschedulingsResponse>()

  return result
}
