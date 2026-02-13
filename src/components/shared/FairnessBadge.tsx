import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface FairnessBadgeProps {
  tasksCompleted: number
  average: number
}

export function FairnessBadge({ tasksCompleted, average }: FairnessBadgeProps) {
  if (average === 0) {
    return (
      <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-0">
        N/A
      </Badge>
    )
  }

  const ratio = tasksCompleted / average

  if (ratio > 1.2) {
    return (
      <Badge variant="secondary" className={cn('bg-green-100 text-green-700 border-0')}>
        Active
      </Badge>
    )
  }

  if (ratio >= 0.8) {
    return (
      <Badge variant="secondary" className={cn('bg-yellow-100 text-yellow-700 border-0')}>
        Average
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className={cn('bg-red-100 text-red-700 border-0')}>
      Below avg
    </Badge>
  )
}
