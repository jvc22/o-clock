'use client'

import { Calendar } from '@/components/ui/calendar'
import { useDate } from '@/contexts/date'

export function CalendarForm() {
  const { date, setDate } = useDate()

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      disabled={{ dayOfWeek: [0, 6] }}
      className="w-fit rounded-md border"
    />
  )
}
