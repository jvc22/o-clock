import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { timeIntervals } from '@/static/time-intervals'

interface AppointmentTableRowSkeletonProps {
  time: number
}

export function AppointmentTableRowSkeleton({
  time,
}: AppointmentTableRowSkeletonProps) {
  return (
    <TableRow className="border-0">
      <TableCell className="pl-3 font-mono text-muted-foreground">
        {timeIntervals[time]}
      </TableCell>

      {Array.from({ length: 5 }).map((_, index) => (
        <TableCell key={index} className={cn(index > 0 && 'border-l')}>
          <Skeleton className="h-8" />
        </TableCell>
      ))}
    </TableRow>
  )
}
