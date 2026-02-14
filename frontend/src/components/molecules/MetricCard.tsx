import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string | number
  change?: number // percentage change
  icon?: React.ReactNode
  className?: string
}

export function MetricCard({ label, value, change, icon, className }: MetricCardProps) {
  const trendIcon =
    change && change > 0 ? (
      <TrendingUp className="w-3.5 h-3.5 text-risk-low" />
    ) : change && change < 0 ? (
      <TrendingDown className="w-3.5 h-3.5 text-risk-high" />
    ) : (
      <Minus className="w-3.5 h-3.5 text-gray-400" />
    )

  return (
    <div
      className={cn(
        'card-glass flex items-start gap-3 hover:shadow-md transition-shadow duration-300',
        className
      )}
    >
      {icon && (
        <div className="p-2.5 rounded-lg bg-medical-teal/10 text-medical-teal flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <div className="flex items-end gap-2 mt-1">
          <span className="text-2xl font-bold text-text-primary tracking-tight">{value}</span>
          {change !== undefined && (
            <span
              className={cn(
                'flex items-center gap-0.5 text-xs font-medium pb-1',
                change > 0 ? 'text-risk-low' : change < 0 ? 'text-risk-high' : 'text-gray-400'
              )}
            >
              {trendIcon}
              {Math.abs(change).toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
