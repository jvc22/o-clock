import { api } from './api-client'

interface AddNewNoteRequest {
  text: string
}

export async function addNewNoteFn({ text }: AddNewNoteRequest) {
  await api.post('notes', {
    json: {
      text,
    },
  })
}
