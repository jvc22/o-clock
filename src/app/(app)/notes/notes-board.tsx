'use client'

import { useQuery } from '@tanstack/react-query'
import { Ban } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { getNotes } from '@/http/get-notes'

import { NoteCard } from './note-card'
import { NoteCardSkeleton } from './note-card-skeleton'

export function NotesBoard() {
  const { data, isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
  })

  return (
    <div className="grid grid-cols-4 gap-4">
      {data && data.notes.length === 0 && (
        <div className="flex flex-col gap-4 rounded-md border border-border px-4 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Nothing here...</span>

            <Button disabled variant="ghost" className="size-6 p-0">
              <Ban className="size-4" />
            </Button>
          </div>

          <h4 className="text-lg font-medium">No note found</h4>

          <div className="h-20 text-sm">
            You do not have any notes on your board. In order to create a new
            one, go to{' '}
            <Button variant="link" className="h-fit p-0" asChild>
              <Link href="/calendar">Calendar</Link>
            </Button>
            .
          </div>
        </div>
      )}

      {isLoading &&
        !data &&
        Array.from({ length: 12 }).map((_, index) => (
          <NoteCardSkeleton key={index} />
        ))}

      {data?.notes.map((note) => <NoteCard key={note.id} note={note} />)}
    </div>
  )
}
