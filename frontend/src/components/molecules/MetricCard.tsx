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

    const hasPercent = value.includes('%')
    const isDecimal = value.includes('.') && !value.includes(',')
    const start = performance.now()
    const duration = 1500

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = numeric * eased

      let formatted: string
      if (isDecimal) {
        formatted = current.toFixed(1)
      } else {
        formatted = Math.round(current).toLocaleString('en-IN')
      }
      if (hasPercent) formatted += '%'
      setDisplayValue(formatted)

      if (progress < 1) animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [value])

  return (
    <div className={cn('card group hover:border-nebula-500/20 transition-all duration-300', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-surgical-100/40 uppercase tracking-wide">{label}</span>
        {icon && (
          <div className="p-2 rounded-xl bg-nebula-500/10 text-nebula-400 group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold font-mono text-surgical-50 tracking-tight">{displayValue}</p>
      {change !== undefined && (
        <div className={cn(
          'flex items-center gap-1 mt-2 text-xs font-medium',
          change > 0 ? 'text-emerald-400' : change < 0 ? 'text-crimson-400' : 'text-surgical-100/40'
        )}>
          {change > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : change < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
          {change > 0 && '+'}{change}%
          <span className="text-surgical-100/30 ml-1">vs last month</span>
        </div>
      )}
    </div>
  )
}
