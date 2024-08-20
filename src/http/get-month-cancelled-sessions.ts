import { api } from './api-client'

interface GetMonthCancelledSessionsRequest {
  today: string
}

export interface GetMonthCancelledSessionsResponse {
  amount: number
  diffFromLastMonth: number
}

export async function getMonthCancelledSessions({
  today,
}: GetMonthCancelledSessionsRequest) {
  const result = await api
    .get(`dashboard/metrics/month-cancelled-sessions?today=${today}`)
    .json<GetMonthCancelledSessionsResponse>()

  return result
}
