import { cn } from '@/lib/utils'

interface CreditBadgeProps {
  amount: number
  type?: 'earned' | 'spent' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CreditBadge({ amount, type = 'neutral', size = 'md', className }: CreditBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-0.5',
    lg: 'text-base px-3 py-1',
  }

  const typeClasses = {
    earned: 'bg-green-100 text-green-700',
    spent: 'bg-red-100 text-red-700',
    neutral: 'bg-primary/10 text-primary',
  }

  return (
    <span className={cn('inline-flex items-center rounded-full font-semibold', sizeClasses[size], typeClasses[type], className)}>
      {type === 'earned' && '+'}
      {type === 'spent' && '-'}
      {amount} CR
    </span>
  )
}
