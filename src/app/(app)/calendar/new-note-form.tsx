'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

import newNoteImg from '@/assets/notes/new-note.svg'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useFormState } from '@/hooks/use-form-state'
import { queryClient } from '@/lib/react-query'

import { addNewNote } from './actions'

export function NewNoteForm() {
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    addNewNote,
    () => {
      toast.success('Note added successfully!')

      queryClient.invalidateQueries({
        queryKey: ['notes'],
      })
    },
    true,
  )

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>New note</DialogTitle>
        <DialogDescription>Add a new note to your board</DialogDescription>
      </DialogHeader>

      <Image src={newNoteImg} alt="new-note-image" />

      <form onSubmit={handleSubmit} className="space-y-4">
        {!success && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Registration failed.</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Textarea
            id="text"
            name="text"
            autoComplete="off"
            placeholder="Start here..."
            className="text-md min-h-20 resize-none border-0 px-0 py-2 shadow-none focus-visible:ring-0"
          />
        </div>

        <div>
          {errors?.text && (
            <span className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.text[0]}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <DialogClose asChild>
            <Button type="reset" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Add'}
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}
