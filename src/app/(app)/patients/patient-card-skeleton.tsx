import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function PatientCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-24" />
      </CardContent>

      <CardFooter className="gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="size-9 shrink-0" />
      </CardFooter>
    </Card>
  )
}
