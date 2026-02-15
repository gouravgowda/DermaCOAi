import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { ReactNode } from 'react'

interface MetricCardProps {
  label: string
  value: string
  change?: number
  icon?: ReactNode
  className?: string
}

export function MetricCard({ label, value, change, icon, className }: MetricCardProps) {
  return (
    <div className={cn('card flex items-center gap-4', className)}>
      {icon && (
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-slate-500 mb-0.5">{label}</p>
        <div className="flex items-end gap-2">
          <h3 className="text-2xl font-bold text-slate-800 leading-none">{value}</h3>
          {change !== undefined && (
            <span className={cn(
              "text-xs font-medium flex items-center mb-0.5",
              change > 0 ? "text-emerald-600" : change < 0 ? "text-red-600" : "text-slate-500"
            )}>
              {change > 0 && <TrendingUp className="w-3 h-3 mr-0.5" />}
              {change < 0 && <TrendingDown className="w-3 h-3 mr-0.5" />}
              {Math.abs(change)}%
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
