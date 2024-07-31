import { api } from './api-client'

interface AddNewNoteRequest {
  text: string
  date: string
}

export async function addNewNoteFn({ text, date }: AddNewNoteRequest) {
  await api.post('notes', {
    json: {
      text,
      date,
    },
  })
}
