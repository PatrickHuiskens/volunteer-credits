import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useCountUp } from '@/hooks/useCountUp'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  trend?: { value: string; positive: boolean }
  className?: string
}

function AnimatedValue({ value }: { value: string | number }) {
  // Extract numeric part and suffix (e.g. "125 CR" → 125, " CR")
  const str = String(value)
  const match = str.match(/^(\d+)(.*)$/)

  const numericTarget = match ? parseInt(match[1], 10) : 0
  const suffix = match ? match[2] : ''
  const hasNumeric = !!match

  const animated = useCountUp(numericTarget)

  if (!hasNumeric) return <>{value}</>
  return <>{animated}{suffix}</>
}

export function StatCard({ icon: Icon, label, value, trend, className }: StatCardProps) {
  return (
    <Card className={cn('transition-all hover:shadow-md border-border/60', className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold tracking-tight">
              <AnimatedValue value={value} />
            </p>
            {trend && (
              <p className={cn('text-xs font-medium', trend.positive ? 'text-emerald-600' : 'text-red-500')}>
                {trend.value}
              </p>
            )}
          </div>
          <div className="rounded-lg bg-primary/8 p-2.5">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
