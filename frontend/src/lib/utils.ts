import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format date to Indian locale */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

/** Format risk level to display text */
export function formatRiskLevel(risk: number): string {
  if (risk >= 0.7) return 'High'
  if (risk >= 0.4) return 'Medium'
  return 'Low'
}

/** Get risk color class */
export function getRiskColor(risk: number | string): string {
  const level = typeof risk === 'string' ? risk : risk >= 0.7 ? 'high' : risk >= 0.4 ? 'medium' : 'low'
  switch (level) {
    case 'high':
    case 'critical':
      return 'text-risk-high'
    case 'medium':
      return 'text-risk-medium'
    case 'low':
      return 'text-risk-low'
    default:
      return 'text-white/40'
  }
}

/** Get risk background class */
export function getRiskBg(risk: string): string {
  switch (risk) {
    case 'high':
    case 'critical':
      return 'bg-risk-high/10 border-risk-high/30'
    case 'medium':
      return 'bg-risk-medium/10 border-risk-medium/30'
    case 'low':
      return 'bg-risk-low/10 border-risk-low/30'
    default:
      return 'bg-white/[0.06] border-white/[0.1]'
  }
}

/** Truncate text to max length */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '…'
}

/** Generate a unique ID */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
