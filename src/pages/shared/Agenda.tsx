import { useState } from 'react'
import { useNavigate } from 'react-router'
import { CalendarDays, List, ChevronLeft, ChevronRight, Clock, MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { PageHeader } from '@/components/shared/PageHeader'
import { CreditBadge } from '@/components/shared/CreditBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { useData } from '@/hooks/useData'
import { CATEGORY_CONFIG, STATUS_CONFIG } from '@/lib/constants'
import { cn, formatDate } from '@/lib/utils'
import { TaskStatus } from '@/types'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  // Adjust so Monday = 0
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const days: Array<{ date: Date; isCurrentMonth: boolean }> = []

  // Previous month padding
  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push({ date: d, isCurrentMonth: false })
  }

  // Current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true })
  }

  // Next month padding
  const remaining = 7 - (days.length % 7)
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
    }
  }

  return days
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function Agenda() {
  const { role } = useAuth()
  const { tasks } = useData()
  const navigate = useNavigate()
  const [view, setView] = useState<string>('calendar')
  const [currentDate, setCurrentDate] = useState(() => new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = dateKey(new Date())

  const activeTasks = tasks.filter(
    (t) => t.status !== TaskStatus.CANCELLED
  )

  const tasksByDate = new Map<string, typeof activeTasks>()
  for (const task of activeTasks) {
    const existing = tasksByDate.get(task.date) ?? []
    existing.push(task)
    tasksByDate.set(task.date, existing)
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToday = () => setCurrentDate(new Date())

  const navigateToTask = (taskId: string) => {
    const base = role === 'admin' ? '/admin' : '/volunteer'
    navigate(`${base}/tasks/${taskId}`)
  }

  const monthDays = getMonthDays(year, month)

  // Timeline: group upcoming tasks by date
  const upcomingTasks = [...activeTasks]
    .filter((t) => t.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))

  const timelineGroups = new Map<string, typeof activeTasks>()
  for (const task of upcomingTasks) {
    const existing = timelineGroups.get(task.date) ?? []
    existing.push(task)
    timelineGroups.set(task.date, existing)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <PageHeader title="Agenda" description="Overview of all scheduled tasks" />
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v)}>
          <ToggleGroupItem value="calendar" aria-label="Calendar view">
            <CalendarDays className="h-4 w-4 mr-1.5" />
            Calendar
          </ToggleGroupItem>
          <ToggleGroupItem value="timeline" aria-label="Timeline view">
            <List className="h-4 w-4 mr-1.5" />
            Timeline
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {view === 'calendar' ? (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-lg font-semibold">
                {MONTHS[month]} {year}
              </h2>
              <Button variant="outline" size="sm" onClick={goToday}>
                Today
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-px bg-border/60 rounded-lg overflow-hidden border border-border/60">
              {DAYS.map((day) => (
                <div key={day} className="bg-muted/30 p-2 text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              {monthDays.map(({ date, isCurrentMonth }, i) => {
                const key = dateKey(date)
                const dayTasks = tasksByDate.get(key) ?? []
                const isToday = key === today

                return (
                  <div
                    key={i}
                    className={cn(
                      'bg-card min-h-[80px] sm:min-h-[100px] p-1.5 transition-colors',
                      !isCurrentMonth && 'bg-muted/20'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                        isToday && 'bg-primary text-primary-foreground',
                        !isCurrentMonth && 'text-muted-foreground/50'
                      )}
                    >
                      {date.getDate()}
                    </span>
                    <div className="mt-0.5 space-y-0.5">
                      {dayTasks.slice(0, 3).map((task) => {
                        const cat = CATEGORY_CONFIG[task.category]
                        return (
                          <button
                            key={task.id}
                            className={cn(
                              'w-full text-left rounded px-1.5 py-0.5 text-[10px] sm:text-xs leading-tight font-medium truncate cursor-pointer transition-opacity hover:opacity-80',
                              cat.bgColor,
                              cat.color
                            )}
                            onClick={() => navigateToTask(task.id)}
                          >
                            {task.title}
                          </button>
                        )
                      })}
                      {dayTasks.length > 3 && (
                        <span className="text-[10px] text-muted-foreground pl-1">
                          +{dayTasks.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {timelineGroups.size === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No upcoming tasks"
              description="There are no scheduled tasks coming up."
            />
          ) : (
            [...timelineGroups.entries()].map(([date, dateTasks]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={cn(
                      'flex flex-col items-center justify-center rounded-lg border px-3 py-1.5 min-w-[52px]',
                      date === today && 'border-primary bg-primary/5'
                    )}
                  >
                    <span className="text-[10px] font-medium uppercase text-muted-foreground">
                      {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className={cn('text-lg font-bold', date === today && 'text-primary')}>
                      {new Date(date + 'T00:00:00').getDate()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{formatDate(date)}</p>
                    <p className="text-xs text-muted-foreground">
                      {dateTasks.length} task{dateTasks.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="ml-[26px] border-l-2 border-border/60 pl-6 space-y-3 pb-2">
                  {dateTasks.map((task) => {
                    const cat = CATEGORY_CONFIG[task.category]
                    const status = STATUS_CONFIG[task.status]
                    const spotsLeft = task.maxVolunteers - task.assignedVolunteerIds.length
                    const CategoryIcon = cat.icon

                    return (
                      <Card
                        key={task.id}
                        className="cursor-pointer transition-all hover:shadow-md"
                        onClick={() => navigateToTask(task.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="secondary" className={cn(cat.bgColor, cat.color, 'border-0')}>
                                  <CategoryIcon className="mr-1 h-3 w-3" />
                                  {cat.label}
                                </Badge>
                                <Badge variant="secondary" className={cn(status.bgColor, status.color, 'border-0')}>
                                  {status.label}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-sm leading-tight">{task.title}</h3>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {task.startTime} — {task.endTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {task.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {spotsLeft} / {task.maxVolunteers} spots
                                </span>
                              </div>
                            </div>
                            <CreditBadge amount={task.creditReward} />
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
