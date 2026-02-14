import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string | number
  change?: number // percentage change
  icon?: React.ReactNode
  className?: string
}

/**
 * Animated counter that counts up to the target number
 */
function useCountUp(target: number, duration = 1200) {
  const [current, setCurrent] = useState(0)
  const frameRef = useRef<number>()

  useEffect(() => {
    const startTime = performance.now()

    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(target * eased * 10) / 10)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration])

  return current
}

/**
 * Parse a numeric value from a string like "12,847" or "94.7%"
 */
function parseNumeric(val: string | number): { number: number; prefix: string; suffix: string } {
  if (typeof val === 'number') return { number: val, prefix: '', suffix: '' }

  const match = val.match(/^([^\d]*)([\d,]+\.?\d*)(.*)$/)
  if (!match) return { number: 0, prefix: '', suffix: val }

  return {
    prefix: match[1],
    number: parseFloat(match[2].replace(/,/g, '')),
    suffix: match[3],
  }
}

function formatNumber(n: number, original: string | number): string {
  if (typeof original === 'number') return n.toString()

  // Preserve comma formatting
  if (typeof original === 'string' && original.includes(',')) {
    return n.toLocaleString('en-IN')
  }
  // Preserve single decimal
  if (typeof original === 'string' && original.includes('.')) {
    return n.toFixed(1)
  }
  return Math.round(n).toString()
}

export function MetricCard({ label, value, change, icon, className }: MetricCardProps) {
  const { number, prefix, suffix } = parseNumeric(value)
  const animated = useCountUp(number)

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
          <span className="text-2xl font-bold text-text-primary tracking-tight font-mono">
            {prefix}{formatNumber(animated, value)}{suffix}
          </span>
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
