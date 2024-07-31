import { Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function NoteCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-border px-4 py-3">
      <div className="flex items-center justify-between text-xs">
        <div className="py-1">
          <Skeleton className="h-2.5 w-20" />
        </div>

        <Button disabled variant="ghost" className="size-6 p-0">
          <Trash className="size-4" />
        </Button>
      </div>

      <div className="py-2">
        <Skeleton className="size-3 w-40" />
      </div>

      <div className="h-20 space-y-2.5">
        <Skeleton className="size-2.5 w-72" />

        <Skeleton className="size-2.5 w-48" />

        <Skeleton className="size-2.5 w-64" />
      </div>
    </div>
  )
}
