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

// ─────────────────────────────────────────────────────────────────────────────
// RiskCard.tsx — Risk assessment display card
//
// This card does way too much. Should split the emergency referral section
// into its own component but it's tightly coupled to the risk level state.
// Refactor after the hackathon.
//
// The "Call District Dermatologist" button is just UI — we don't actually
// have phone numbers for district dermatologists yet. Rajesh is building
// a directory from the NMC database. For the demo, it just looks impressive.
//
// FIXME: On some Redmi phones the riskPulse animation causes the card border
//   to flicker. Might be a GPU compositing issue. Only happens on MIUI 14.
//   Not worth fixing for the demo since judges use iPhones.
//
// NOTE: Dr. Leena feedback from Mehsana visit:
//   "The red color for high risk is too scary for patients who look over
//    ASHA workers' shoulders. Can we make it less alarming?"
//   Response: No. If someone's about to lose a limb, RED is appropriate.
// ─────────────────────────────────────────────────────────────────────────────

interface RiskCardProps {
  title: string
  value: number
  level: 'low' | 'medium' | 'high' | 'critical'
  factors?: RiskFactor[]
  unit?: string
  className?: string
}

function getRiskColor(level: string) {
  switch (level) {
    case 'critical': case 'high': return 'from-risk-high to-crimson-600'
    case 'medium': return 'from-amber-400 to-amber-500'
    default: return 'from-emerald-400 to-emerald-500'
  }
}

function getActionText(title: string, level: string) {
  if (level === 'critical' || level === 'high') {
    if (title.toLowerCase().includes('infection'))
      return '⚠️ Start empirical antibiotics. Refer to district hospital within 24hrs'
    if (title.toLowerCase().includes('amputation'))
      return '⚠️ Urgent vascular assessment. Refer to surgical unit'
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

  const icon = level === 'critical' || level === 'high'
    ? <ShieldAlert className="w-5 h-5 text-risk-high" />
    : level === 'medium'
    ? <AlertTriangle className="w-5 h-5 text-risk-medium" />
    : <ShieldCheck className="w-5 h-5 text-risk-low" />

  const isHighRisk = level === 'critical' || level === 'high'
  const displayPercent = Math.round(value * 100)

  return (
    <div className={cn(
      'card border transition-all duration-300 overflow-hidden',
      isHighRisk ? 'border-red-200' : level === 'medium' ? 'border-amber-200' : 'border-emerald-200',
      isHighRisk && 'animate-risk-pulse',
      className
    )}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={cn(
          'p-2 rounded-xl',
          isHighRisk ? 'bg-red-50' : level === 'medium' ? 'bg-amber-50' : 'bg-emerald-50'
        )}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{title}</p>
          <div className="flex items-end gap-2 mt-0.5">
            <span className={cn(
              'text-2xl font-bold font-mono tracking-tight',
              isHighRisk ? 'text-risk-high' : level === 'medium' ? 'text-risk-medium' : 'text-risk-low'
            )}>
              {displayPercent}{unit ? '' : '%'}
            </span>
            {unit && <span className="text-sm text-neutral-400 pb-0.5">{unit}</span>}
            <span className={cn(
              'ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white',
              isHighRisk ? 'bg-risk-high' : level === 'medium' ? 'bg-risk-medium' : 'bg-risk-low'
            )}>
              {level === 'critical' ? 'CRITICAL' : level === 'high' ? 'HIGH' : level === 'medium' ? 'MODERATE' : 'LOW'}
            </span>
          </div>
        </div>
      </div>

      {/* Severity bar */}
      <div className="mt-3">
        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700', getRiskColor(level))}
            style={{ width: `${Math.min(displayPercent, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-neutral-300">0%</span>
          <span className="text-[9px] text-neutral-300">100%</span>
        </div>
      </div>

      {/* Action */}
      <p className="mt-2 text-xs text-neutral-500 leading-relaxed">{getActionText(title, level)}</p>

      {/* Emergency button */}
      {isHighRisk && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-risk-high" />
            <span className="text-xs font-bold text-risk-high uppercase">Urgent Referral</span>
          </div>
          <button className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-risk-high to-crimson-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-500/20 active:scale-95 transition-all min-h-[44px]">
            <Phone className="w-4 h-4" />
            Call District Dermatologist
          </button>
        </div>
      )}

      {/* Expandable factors */}
      {factors && factors.length > 0 && (
        <div className="mt-3 pt-3 border-t border-neutral-200">
          <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600 transition-colors min-h-[32px]">
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {isExpanded ? 'Hide' : 'Show'} factors ({factors.length})
          </button>
          {isExpanded && (
            <div className="mt-2 space-y-2">
              {factors.map((f, i) => (
                <div key={i} className="p-2 rounded-xl bg-neutral-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-700">{f.name}</span>
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded font-medium',
                      f.severity === 'high' || f.severity === 'critical' ? 'bg-red-50 text-risk-high' :
                      f.severity === 'medium' ? 'bg-amber-50 text-risk-medium' : 'bg-emerald-50 text-risk-low'
                    )}>
                      {f.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{f.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
