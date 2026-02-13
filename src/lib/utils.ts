import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return format(new Date(date), 'MMM d, yyyy')
}

export function formatDateTime(date: string) {
  return format(new Date(date), 'MMM d, yyyy HH:mm')
}

export function formatRelativeDate(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatCredits(amount: number, symbol = 'CR') {
  return `${amount} ${symbol}`
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}
