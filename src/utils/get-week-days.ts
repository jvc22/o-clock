export function getWeekDays(date: Date): string[] {
  const result: string[] = []

  const day = date.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(date)

  monday.setDate(date.getDate() + mondayOffset)

  for (let i = 0; i < 5; i++) {
    const currentDay = new Date(monday)
    currentDay.setDate(monday.getDate() + i)

    result.push(new Date(currentDay.toDateString()).toISOString())
  }

  return result
}
