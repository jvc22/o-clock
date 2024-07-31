import { api } from './api-client'

export interface GetNotesResponse {
  notes: {
    id: string
    text: string
    createdAt: string
  }[]
}

export async function getNotes() {
  const result = await api.get('notes').json<GetNotesResponse>()

  return result
}
