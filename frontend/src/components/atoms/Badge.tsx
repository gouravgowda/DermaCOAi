import { cn } from '@/lib/utils'
import type { RiskLevel } from '@/types'

interface BadgeProps {
  variant: RiskLevel | 'info' | 'default'
  children: React.ReactNode
  className?: string
  pulse?: boolean
}

export function Badge({ variant, children, className, pulse }: BadgeProps) {
  const variantClasses: Record<string, string> = {
    low: 'bg-risk-low/10 text-risk-low border-risk-low/30',
    medium: 'bg-risk-medium/10 text-risk-medium border-risk-medium/30',
    high: 'bg-risk-high/10 text-risk-high border-risk-high/30',
    critical: 'bg-risk-high/20 text-risk-high border-risk-high/50',
    info: 'bg-medical-teal/10 text-medical-teal border-medical-teal/30',
    default: 'bg-gray-100 text-gray-600 border-gray-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border',
        variantClasses[variant],
        pulse && 'animate-pulse',
        className
      )}
    >
      {(variant === 'high' || variant === 'critical') && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {children}
    </span>
  )
}
