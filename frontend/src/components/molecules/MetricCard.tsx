import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// MetricCard.tsx — Animated stat card with count-up
//
// Tried wrapping this in React.memo but it broke the count-up animation
// because the parent re-renders on route change and memo prevents the
// value prop from triggering the useEffect. Spent 2 hours debugging.
// Just let it re-render — it's 4 DOM nodes, not a performance bottleneck.
//
// The count-up animation originally used framer-motion's useSpring but
// that added ~40kb to the bundle. This vanilla requestAnimationFrame
// version is 20 lines and looks identical. Worth the trade-off.
//
// TODO: Rajesh wants to add sparkline mini-charts inside each card.
//   Would need recharts or visx. Parking this for v0.4.0.
// ─────────────────────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string
  value: string
  change?: number
  icon?: ReactNode
  className?: string
}

export function MetricCard({ label, value, change, icon, className }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState('0')
  const animRef = useRef(0)

  useEffect(() => {
    // Parse numerics from formatted values like "12,847" or "94.7%"
    const numeric = parseFloat(value.replace(/[^0-9.]/g, ''))
    if (isNaN(numeric)) {
      setDisplayValue(value)
      return
    }

    const prefix = value.match(/^[^0-9]*/)?.[0] || ''
    const suffix = value.match(/[^0-9.]*$/)?.[0] || ''
    const hasDecimal = value.includes('.')
    const start = performance.now()
    const duration = 1200

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = numeric * eased
      const formatted = hasDecimal
        ? current.toFixed(1)
        : Math.round(current).toLocaleString('en-IN')
      setDisplayValue(`${prefix}${formatted}${suffix}`)
      if (progress < 1) animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [value])

  const trend = change == null ? null : change > 0 ? 'up' : change < 0 ? 'down' : 'flat'

  return (
    <div className={cn(
      'card hover:shadow-clinical-lg transition-all duration-300 animate-count-in',
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{label}</p>
        {icon && (
          <div className="p-2 rounded-xl bg-medical-blue-50 text-medical-blue-500">
            {icon}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-medical-blue-600 font-mono tracking-tight">
        {displayValue}
      </p>
      {trend && (
        <div className={cn(
          'flex items-center gap-1 mt-1.5 text-xs font-medium',
          trend === 'up' ? 'text-risk-low' : trend === 'down' ? 'text-risk-high' : 'text-neutral-400'
        )}>
          {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
          {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
          {trend === 'flat' && <Minus className="w-3.5 h-3.5" />}
          <span>{change! > 0 ? '+' : ''}{change}%</span>
          <span className="text-neutral-400 ml-0.5">vs last month</span>
        </div>
      )}
    </div>
  )
}
