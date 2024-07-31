import { api } from './api-client'

interface CloseNoteRequest {
  id: string
}

export async function closeNote({ id }: CloseNoteRequest) {
  await api.delete(`notes/${id}`)
}
