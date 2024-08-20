import { DaySessionsHeldCard } from './day-sessions-held'
import { MonthCancellationsCard } from './month-cancellations-card'
import { MonthSessionsHeldCard } from './month-sessions-held-card'
import { MonthTotalSessionsCard } from './month-total-sessions-card'

export default function Dashboard() {
  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <MonthTotalSessionsCard />

        <MonthSessionsHeldCard />

        <DaySessionsHeldCard />

        <MonthCancellationsCard />
      </div>

      <div></div>
    </main>
  )
}
