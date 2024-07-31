import { useMutation } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { closeNote } from '@/http/close-note'
import { GetNotesResponse } from '@/http/get-notes'
import { queryClient } from '@/lib/react-query'

interface NoteCardProps {
  note: {
    id: string
    createdAt: string
    text: string
  }
}

export function NoteCard({ note: { id, createdAt, text } }: NoteCardProps) {
  const formattedDate = format(createdAt, 'EEE, PPP')

  const shortTitle = text.length > 24 ? `${text.slice(0, 24).trim()}...` : text

  function closeNoteOnCache() {
    const notesCache = queryClient.getQueriesData<GetNotesResponse>({
      queryKey: ['notes'],
    })

    notesCache.forEach(([cacheKey, cached]) => {
      if (!cached) {
        return
      }

      queryClient.setQueryData<GetNotesResponse>(cacheKey, {
        ...cached,
        notes: cached.notes.filter((note) => note.id !== id),
      })
    })
  }

  const { mutateAsync: closeNoteFn } = useMutation({
    mutationFn: closeNote,
    onSuccess: async () => {
      closeNoteOnCache()

      toast.success('Note closed successfully!')
    },
  })

  return (
    <div className="flex flex-col gap-4 rounded-md border border-border px-4 py-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-primary">{formattedDate}</span>

        <Button
          variant="ghost"
          onClick={() => closeNoteFn({ id })}
          className="size-6 p-0 transition-all hover:-translate-y-1 hover:text-red-500"
        >
          <Trash className="size-4" />
        </Button>
      </div>

      <h4 className="text-lg font-medium">{shortTitle}</h4>

      <Textarea
        disabled
        className="min-h-20 resize-none border-0 p-0 shadow-none disabled:cursor-default disabled:opacity-100"
        value={text}
      />
    </div>
  )
}
