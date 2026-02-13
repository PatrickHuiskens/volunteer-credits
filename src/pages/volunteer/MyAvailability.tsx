import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/PageHeader'
import { useAuth } from '@/hooks/useAuth'
import { useData } from '@/hooks/useData'
import { cn } from '@/lib/utils'
import type { TimeSlot } from '@/types'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TIME_SLOTS: { label: string; value: TimeSlot }[] = [
  { label: 'Morning', value: 'morning' },
  { label: 'Afternoon', value: 'afternoon' },
  { label: 'Evening', value: 'evening' },
]

export default function MyAvailability() {
  const { currentUser } = useAuth()
  const { getVolunteerAvailability, toggleAvailability } = useData()

  const myAvailability = getVolunteerAvailability(currentUser!.id)

  const isAvailable = (dayOfWeek: number, timeSlot: TimeSlot) =>
    myAvailability.some((a) => a.dayOfWeek === dayOfWeek && a.timeSlot === timeSlot)

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Availability"
        description="Set your weekly availability so admins know when you can help"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left text-sm font-medium text-muted-foreground w-24" />
                  {DAYS.map((day) => (
                    <th key={day} className="p-2 text-center text-sm font-medium">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot) => (
                  <tr key={slot.value}>
                    <td className="p-2 text-sm font-medium text-muted-foreground">
                      {slot.label}
                    </td>
                    {DAYS.map((_, dayIdx) => {
                      const available = isAvailable(dayIdx, slot.value)
                      return (
                        <td key={dayIdx} className="p-1.5">
                          <button
                            className={cn(
                              'w-full h-12 rounded-lg border-2 transition-all font-medium text-sm',
                              available
                                ? 'bg-green-100 border-green-400 text-green-700 hover:bg-green-200'
                                : 'bg-muted/30 border-transparent text-muted-foreground/50 hover:bg-muted/60 hover:border-muted-foreground/20'
                            )}
                            onClick={() => toggleAvailability(currentUser!.id, dayIdx, slot.value)}
                          >
                            {available ? 'Available' : ''}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Click cells to toggle your availability. Green cells indicate you're available.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
