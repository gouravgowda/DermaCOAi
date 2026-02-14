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
    low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    high: 'bg-crimson-500/10 text-crimson-400 border-crimson-500/20',
    critical: 'bg-crimson-500/20 text-crimson-400 border-crimson-500/30',
    info: 'bg-nebula-500/10 text-nebula-400 border-nebula-500/20',
    default: 'bg-space-700 text-surgical-100/60 border-white/[0.06]',
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
