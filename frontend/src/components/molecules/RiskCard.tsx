import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, ChevronDown, ChevronUp, Activity, ShieldAlert, ShieldCheck } from 'lucide-react'
import { cn, formatRiskLevel, getRiskColor, getRiskBg } from '@/lib/utils'

interface RiskCardProps {
  riskScore: number
  factors: string[]
  className?: string
}

export function RiskCard({ riskScore, factors, className }: RiskCardProps) {
  const [expanded, setExpanded] = useState(false)
  const isHighRisk = riskScore > 0.6
  const riskLevel = formatRiskLevel(riskScore)
  
  const riskColor = isHighRisk ? 'text-red-600' : riskScore > 0.3 ? 'text-amber-600' : 'text-emerald-600'
  const riskBg = isHighRisk ? 'bg-red-50' : riskScore > 0.3 ? 'bg-amber-50' : 'bg-emerald-50'
  const riskBorder = isHighRisk ? 'border-red-200' : riskScore > 0.3 ? 'border-amber-200' : 'border-emerald-200'

  return (
    <div className={cn('card overflow-hidden', className)}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", riskBg, riskColor)}>
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Risk Assessment</h3>
            <p className="text-sm text-slate-500">AI Analysis Result</p>
          </div>
        </div>
        
        <div className={cn("px-4 py-1.5 rounded-full border text-sm font-semibold flex items-center gap-2", riskBg, riskBorder, riskColor)}>
          {isHighRisk ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          {riskLevel} Risk
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className="text-slate-600">Confidence Score</span>
          <span className="text-slate-900">{Math.round(riskScore * 100)}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${riskScore * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn("h-full rounded-full", isHighRisk ? "bg-red-500" : riskScore > 0.3 ? "bg-amber-500" : "bg-emerald-500")}
          />
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700 font-medium text-sm border border-slate-200"
      >
        <span>Risk Factors Identified ({factors.length})</span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-2">
              {factors.map((factor, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-white">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-600">{factor}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isHighRisk && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-700">
            <strong>Immediate Attention Recommended:</strong> High risk indicators detected. Please consult a specialist immediately.
          </p>
        </div>
      )}
    </div>
  )
}
