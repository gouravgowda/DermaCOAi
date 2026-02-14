import { useState } from 'react'
import { cn, getRiskBg } from '@/lib/utils'
import { Badge } from '@/components/atoms/Badge'
import { ChevronDown, ChevronUp, AlertTriangle, Shield, TrendingDown } from 'lucide-react'
import type { RiskFactor, RiskLevel } from '@/types'

interface RiskCardProps {
  title: string
  value: number | string
  level: RiskLevel
  factors?: RiskFactor[]
  unit?: string
  className?: string
}

export function RiskCard({ title, value, level, factors, unit, className }: RiskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const icon =
    level === 'high' || level === 'critical' ? (
      <AlertTriangle className="w-5 h-5" />
    ) : level === 'medium' ? (
      <TrendingDown className="w-5 h-5" />
    ) : (
      <Shield className="w-5 h-5" />
    )

  return (
    <div
      className={cn(
        'card-glass border transition-all duration-300',
        getRiskBg(level),
        level === 'high' && 'animate-glow',
        level === 'critical' && 'animate-glow ring-2 ring-risk-high/30',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className={cn('opacity-70', level === 'high' ? 'text-risk-high' : level === 'medium' ? 'text-risk-medium' : 'text-risk-low')}>
            {icon}
          </span>
          <div>
            <p className="text-sm font-medium text-text-primary">{title}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold tracking-tight text-text-primary">
                {typeof value === 'number' ? (value * 100).toFixed(0) : value}
              </span>
              <span className="text-sm text-gray-500">{unit || '%'}</span>
            </div>
          </div>
        </div>
        <Badge variant={level}>{level.toUpperCase()}</Badge>
      </div>

      {/* Collapsible "Why?" section */}
      {factors && factors.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200/50">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-sm font-medium text-medical-teal hover:text-medical-teal/80 transition-colors min-h-[44px]"
            aria-expanded={isExpanded}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Why this risk level?
          </button>

          {isExpanded && (
            <div className="mt-2 space-y-2 animate-fade-in">
              {factors.map((factor, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-white/50 border border-gray-200/30"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={factor.severity} className="text-[10px]">
                      {factor.severity}
                    </Badge>
                    <span className="text-sm font-medium text-text-primary">{factor.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{factor.description}</p>
                  <p className="text-xs text-medical-teal mt-1">→ {factor.recommendation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
