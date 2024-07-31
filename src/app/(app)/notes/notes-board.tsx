'use client'

import { useQuery } from '@tanstack/react-query'
import { Check, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function NotesBoard() {
  const { data } = useQuery({
    queryKey: ['notes'],
    queryFn: () => {},
  })

  return (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 14 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-md border border-border px-4 py-3"
        >
          <div className="flex justify-between text-xs">
            <span className="text-primary">22 Oct. 2024</span>

            <div className="flex items-center">
              <Button
                variant="ghost"
                className="size-6 p-0 transition-all hover:-translate-y-1 hover:text-red-500"
              >
                <Trash className="size-4" />
              </Button>

              <Button
                variant="ghost"
                className="size-6 p-0 transition-all hover:-translate-y-1 hover:text-primary"
              >
                <Check className="size-4" />
              </Button>
            </div>
          </div>

          <h4 className="text-lg font-medium">Lorem ipsum dolor sit amet...</h4>

          <Textarea
            disabled
            className="min-h-20 resize-none border-0 p-0 shadow-none disabled:cursor-default disabled:opacity-100"
            value={
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum, maxime ad est eius explicabo nesciunt quos voluptatibus, doloribus reprehenderit ipsa hic. Tempora sunt incidunt modi dolorum repellat, amet consequatur doloremque.'
            }
          />
        </div>
      ))}
    </div>
  )
}
