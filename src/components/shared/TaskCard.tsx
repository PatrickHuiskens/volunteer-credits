import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditBadge } from './CreditBadge'
import { CATEGORY_CONFIG } from '@/lib/constants'
import { formatDate, cn } from '@/lib/utils'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  showSignUp?: boolean
  isSignedUp?: boolean
  onSignUp?: () => void
  onCancel?: () => void
  onClick?: () => void
}

export function TaskCard({ task, showSignUp, isSignedUp, onSignUp, onCancel, onClick }: TaskCardProps) {
  const category = CATEGORY_CONFIG[task.category]
  const spotsLeft = task.maxVolunteers - task.assignedVolunteerIds.length
  const CategoryIcon = category.icon

  return (
    <Card
      className={cn('transition-all hover:shadow-md', onClick && 'cursor-pointer')}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className={cn(category.bgColor, category.color, 'border-0')}>
                <CategoryIcon className="mr-1 h-3 w-3" />
                {category.label}
              </Badge>
              <CreditBadge amount={task.creditReward} />
            </div>
            <h3 className="font-semibold leading-tight">{task.title}</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(task.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {task.startTime} — {task.endTime}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {task.location}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {spotsLeft} / {task.maxVolunteers} spots left
              </span>
            </div>
          </div>
          {showSignUp && (
            <div className="shrink-0">
              {isSignedUp ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); onCancel?.() }}
                >
                  Cancel
                </Button>
              ) : spotsLeft > 0 ? (
                <Button
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); onSignUp?.() }}
                >
                  Sign Up
                </Button>
              ) : (
                <Badge variant="secondary">Full</Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
