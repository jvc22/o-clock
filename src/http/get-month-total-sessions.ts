import { api } from './api-client'

interface GetMonthTotalSessionsRequest {
  today: string
}

export interface GetMonthTotalSessionsResponse {
  amount: number
  diffFromLastMonth: number
}

export async function getMonthTotalSessions({
  today,
}: GetMonthTotalSessionsRequest) {
  const result = await api
    .get(`dashboard/metrics/month-total-sessions?today=${today}`)
    .json<GetMonthTotalSessionsResponse>()

  return result
}
