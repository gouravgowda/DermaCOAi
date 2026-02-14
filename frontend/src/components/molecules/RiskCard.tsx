import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { RiskFactor } from '@/types'
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Phone,
} from 'lucide-react'

interface RiskCardProps {
  title: string
  value: number
  level: 'low' | 'medium' | 'high' | 'critical'
  factors?: RiskFactor[]
  unit?: string
  className?: string
}

function getRiskBg(level: string) {
  switch (level) {
    case 'critical':
      return 'border-risk-high/50 bg-risk-high/5'
    case 'high':
      return 'border-risk-high/30 bg-risk-high/5'
    case 'medium':
      return 'border-risk-medium/30 bg-risk-medium/5'
    default:
      return 'border-risk-low/30 bg-risk-low/5'
  }
}

function getRiskColor(level: string) {
  switch (level) {
    case 'critical':
    case 'high':
      return 'from-risk-high to-red-600'
    case 'medium':
      return 'from-risk-medium to-amber-500'
    default:
      return 'from-risk-low to-emerald-500'
  }
}

function getActionText(title: string, level: string) {
  if (level === 'critical' || level === 'high') {
    if (title.toLowerCase().includes('infection'))
      return '⚠️ Start empirical antibiotics. Refer to district hospital within 24hrs'
    if (title.toLowerCase().includes('amputation'))
      return '⚠️ Urgent vascular assessment needed. Refer to surgical unit'
    if (title.toLowerCase().includes('malignancy'))
      return '⚠️ Biopsy recommended. Refer to dermatology specialist'
    return '⚠️ Escalate to district hospital within 24hrs'
  }
  if (level === 'medium') {
    if (title.toLowerCase().includes('healing'))
      return '📋 Increase dressing frequency. Review in 48hrs'
    return '📋 Monitor closely. Review in 72hrs'
  }
  return '✅ Continue current PHC treatment plan'
}

export function RiskCard({ title, value, level, factors, unit, className }: RiskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const icon =
    level === 'critical' || level === 'high' ? (
      <ShieldAlert className="w-5 h-5 text-risk-high" />
    ) : level === 'medium' ? (
      <AlertTriangle className="w-5 h-5 text-risk-medium" />
    ) : (
      <ShieldCheck className="w-5 h-5 text-risk-low" />
    )

  const isHighRisk = level === 'critical' || level === 'high'
  const displayPercent = Math.round(value * 100)

  return (
    <div
      className={cn(
        'card-glass border transition-all duration-300 overflow-hidden',
        getRiskBg(level),
        isHighRisk && 'ring-1 ring-risk-high/20',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={cn(
          'p-2 rounded-lg',
          isHighRisk ? 'bg-risk-high/10' : level === 'medium' ? 'bg-risk-medium/10' : 'bg-risk-low/10'
        )}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <div className="flex items-end gap-2 mt-0.5">
            <span className={cn(
              'text-2xl font-bold font-mono tracking-tight',
              isHighRisk ? 'text-risk-high' : level === 'medium' ? 'text-risk-medium' : 'text-risk-low'
            )}>
              {displayPercent}{unit ? '' : '%'}
            </span>
            {unit && <span className="text-sm text-gray-400 pb-0.5">{unit}</span>}

            {/* Risk badge */}
            <span className={cn(
              'ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white',
              isHighRisk ? 'bg-risk-high animate-pulse' : level === 'medium' ? 'bg-risk-medium' : 'bg-risk-low'
            )}>
              {level === 'critical' ? 'CRITICAL' : level === 'high' ? 'HIGH' : level === 'medium' ? 'MODERATE' : 'LOW'}
            </span>
          </div>
        </div>
      </div>

      {/* Severity meter */}
      <div className="mt-3">
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full bg-gradient-to-r transition-all duration-700',
              getRiskColor(level)
            )}
            style={{ width: `${Math.min(displayPercent, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-gray-400">0%</span>
          <span className="text-[9px] text-gray-400">100%</span>
        </div>
      </div>

      {/* Action text */}
      <p className="mt-2 text-xs text-gray-600 leading-relaxed">
        {getActionText(title, level)}
      </p>

      {/* Emergency escalation button */}
      {isHighRisk && (
        <div className="mt-3 p-3 bg-risk-high/10 border border-risk-high/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-risk-high" />
            <span className="text-xs font-bold text-risk-high uppercase">Urgent Referral Required</span>
          </div>
          <button className="w-full py-2.5 px-4 rounded-lg bg-risk-high text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors active:scale-95 min-h-[44px]">
            <Phone className="w-4 h-4" />
            Call District Dermatologist
          </button>
        </div>
      )}

      {/* Expandable factors */}
      {factors && factors.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200/50">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors min-h-[32px]"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {isExpanded ? 'Hide' : 'Show'} risk factors ({factors.length})
          </button>

          {isExpanded && (
            <div className="mt-2 space-y-2">
              {factors.map((factor, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">{factor.name}</span>
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded font-medium',
                      factor.severity === 'high' || factor.severity === 'critical'
                        ? 'bg-risk-high/10 text-risk-high'
                        : factor.severity === 'medium'
                        ? 'bg-risk-medium/10 text-risk-medium'
                        : 'bg-risk-low/10 text-risk-low'
                    )}>
                      {factor.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{factor.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
