import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAnalysisStore, useProtocolStore } from '@/lib/stores'
import { mockAnalysisResult, mockPatients } from '@/assets/mock-data/mock-patients'
import { RiskCard } from '@/components/molecules/RiskCard'
import { Badge } from '@/components/atoms/Badge'
import { Spinner } from '@/components/atoms/Spinner'
import { DepthMap } from '@/components/organisms/DepthMap'
import { TreatmentProtocol } from '@/components/organisms/TreatmentProtocol'
import { cn, formatDate } from '@/lib/utils'
import {
  Ruler, Save, Share2, ArrowLeft, Target, Clock, AlertTriangle,
  Camera, CheckCircle, FileText,
} from 'lucide-react'

const ICD_DESCRIPTIONS: Record<string, string> = {
  'L97.529': 'Non-pressure chronic ulcer of unspecified foot',
  'E11.621': 'Type 2 diabetes mellitus with foot ulcer',
}

export function Analysis() {
  const { currentAnalysis, isAnalyzing, setAnalysis } = useAnalysisStore()
  const { generate } = useProtocolStore()
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [showSaveToast, setShowSaveToast] = useState(false)
  const [activeTimeline, setActiveTimeline] = useState(0)

  useEffect(() => {
    if (!currentAnalysis && !isAnalyzing) setAnalysis(mockAnalysisResult)
  }, [currentAnalysis, isAnalyzing, setAnalysis])

  useEffect(() => {
    if (currentAnalysis) generate(currentAnalysis.id)
  }, [currentAnalysis, generate])

  useEffect(() => {
    const t = setTimeout(() => {
      setActiveTimeline(1)
      setTimeout(() => setActiveTimeline(2), 600)
      setTimeout(() => setActiveTimeline(3), 1200)
    }, 500)
    return () => clearTimeout(t)
  }, [])

  const handleSaveToEHR = () => {
    if (navigator.vibrate) navigator.vibrate(10)
    setShowSaveToast(true)
    setTimeout(() => setShowSaveToast(false), 3500)
  }

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center h-screen bg-space-950">
        <div className="text-center animate-hero-in">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="font-medium text-surgical-50">Running wound analysis...</p>
          <p className="text-sm text-surgical-100/50 mt-1">SAM segmentation + risk assessment</p>
        </div>
      </div>
    )
  }

  if (!currentAnalysis) {
    return (
      <div className="flex items-center justify-center h-screen bg-space-950">
        <div className="text-center animate-hero-in">
          <AlertTriangle className="w-12 h-12 text-surgical-100/20 mx-auto mb-4" />
          <p className="text-surgical-100/60">No analysis data available</p>
          <Link to="/capture" className="btn-primary mt-4 inline-flex gap-2"> Start New Scan </Link>
        </div>
      </div>
    )
  }

  const { measurements, riskAssessment, tissueComposition, woundType } = currentAnalysis
  const patient = mockPatients.find((p) => p.id === currentAnalysis.patientId)
  const patientImages = patient?.images ?? []
  const activeImage = selectedDay !== null ? patientImages.find((img) => img.day === selectedDay) : null
  const activeScore = activeImage ? (activeImage.infection ?? activeImage.melanomaRisk ?? 0) : null

  const timelineDays = [
    { day: 0, label: 'Day 0', desc: 'Initial scan', status: 'complete' as const },
    { day: 3, label: 'Day 3', desc: 'Dressing change', status: activeTimeline >= 1 ? 'complete' as const : 'pending' as const },
    { day: 7, label: 'Day 7', desc: 'Follow-up', status: activeTimeline >= 2 ? 'complete' as const : 'pending' as const },
    { day: 14, label: 'Day 14', desc: 'Target', status: activeTimeline >= 3 ? 'active' as const : 'pending' as const },
  ]

  const icdCodes = ['L97.529', 'E11.621']

  return (
    <div className="min-h-screen bg-space-950 pb-24 md:pb-6">
      {/* Save toast */}
      {showSaveToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-500/90 backdrop-blur-md text-white shadow-2xl shadow-emerald-500/30 border border-emerald-400/30">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Saved to Ayushman Bharat EHR</p>
              <p className="text-xs text-white/70">FHIR R4 • DiagnosticReport created</p>
            </div>
          </div>
        </div>
      )}

      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-space-950/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-surgical-100/80" />
            </Link>
            <div>
              <p className="text-sm font-semibold text-surgical-50 flex items-center gap-2">
                Wound Analysis
                <Badge variant={riskAssessment.overallRisk}>
                  {riskAssessment.overallRisk.toUpperCase()}
                </Badge>
              </p>
              <p className="text-xs text-surgical-100/40">
                <Clock className="w-3 h-3 inline mr-1" />
                {formatDate(currentAnalysis.timestamp)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm gap-1.5 hidden sm:inline-flex">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button onClick={handleSaveToEHR} className="btn-primary text-sm gap-1.5">
              <Save className="w-3.5 h-3.5" /> Save to EHR
            </button>
          </div>
        </div>
      </header>

      {/* Split cinematic layout */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {/* Left 3/5 – Visual story */}
          <div className="lg:col-span-3 p-6 space-y-6">
            {/* 3D Depth Map – HERO position */}
            <div className="card !p-0 overflow-hidden animate-hero-in">
              <div className="p-4 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-surgical-50">3D Wound Topology</h3>
                  <p className="text-xs text-surgical-100/40 mt-0.5">ZoE-Depth monocular • Drag to rotate</p>
                </div>
                <span className="text-[10px] bg-nebula-500/10 text-nebula-400 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider border border-nebula-500/20">
                  Patent Pending
                </span>
              </div>
              <DepthMap className="h-72 lg:h-80" />
            </div>

            {/* Healing Timeline */}
            <div className="card animate-stagger-fade" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-surgical-50 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-nebula-400" />
                  Healing Timeline
                </h3>
                <span className="text-xs text-surgical-100/30 font-mono">14-day plan</span>
              </div>
              <div className="flex items-center justify-between relative">
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-space-700" />
                <div className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-nebula-500 to-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${(activeTimeline / 3) * 90}%` }} />
                {timelineDays.map((m) => (
                  <div key={m.day} className="flex flex-col items-center relative z-10">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2',
                      m.status === 'complete' ? 'bg-nebula-500 border-nebula-500 text-white' :
                      m.status === 'active' ? 'bg-space-800 border-nebula-400 text-nebula-400 animate-pulse scale-110' :
                      'bg-space-800 border-space-700 text-surgical-100/30'
                    )}>
                      {m.status === 'complete' ? <CheckCircle className="w-5 h-5" /> : <span className="text-xs font-bold">{m.day}</span>}
                    </div>
                    <span className={cn('text-xs font-medium mt-2', m.status !== 'pending' ? 'text-surgical-50' : 'text-surgical-100/30')}>{m.label}</span>
                    <span className="text-[10px] text-surgical-100/30">{m.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Before/After Toggle */}
            {patientImages.length > 1 && (
              <div className="card !p-4 animate-stagger-fade" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="w-4 h-4 text-nebula-400" />
                  <h3 className="text-sm font-semibold text-surgical-50">Healing Progress</h3>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {patientImages.map((img) => {
                    const score = img.infection ?? img.melanomaRisk ?? 0
                    const isActive = selectedDay === img.day
                    return (
                      <button key={img.day} onClick={() => setSelectedDay(isActive ? null : img.day)}
                        className={cn(
                          'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px]',
                          isActive ? 'bg-nebula-500 text-white shadow-lg shadow-nebula-500/30' : 'bg-space-700 text-surgical-100/60 hover:bg-space-700/80'
                        )}>
                        Day {img.day}
                        <span className={cn('ml-2 text-xs', isActive ? 'text-white/60' : 'text-surgical-100/30')}>{(score * 100).toFixed(0)}%</span>
                      </button>
                    )
                  })}
                </div>
                {activeImage && (
                  <div className="mt-3 p-3 rounded-xl bg-space-700/50 border border-white/[0.04] animate-fade-in">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-surgical-100/60">Day {activeImage.day} – {activeImage.infection !== undefined ? 'Infection' : 'Melanoma'} risk</span>
                      <Badge variant={(activeScore ?? 0) >= 0.7 ? 'high' : (activeScore ?? 0) >= 0.4 ? 'medium' : 'low'}>
                        {((activeScore ?? 0) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    {selectedDay !== null && selectedDay > 0 && (
                      <p className="text-xs text-emerald-400 mt-1 font-medium">
                        ↓ {(((patientImages[0].infection ?? 0) - (activeScore ?? 0)) * 100).toFixed(0)}% improvement since Day 0
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Wound Image */}
            <div className="card !p-0 overflow-hidden animate-stagger-fade" style={{ animationDelay: '400ms' }}>
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-space-800 to-space-900 flex items-center justify-center">
                  <div className="text-center">
                    <Target className="w-10 h-10 text-nebula-500/20 mx-auto mb-2" />
                    <p className="text-sm text-surgical-100/40">{selectedDay !== null ? `Day ${selectedDay} Capture` : 'Wound Image'}</p>
                    <p className="text-xs text-surgical-100/20 mt-1">{woundType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                  <div className="px-2.5 py-1.5 rounded-lg bg-space-950/70 backdrop-blur-md text-surgical-100/80 text-xs flex items-center gap-1.5 border border-white/[0.06]">
                    <Ruler className="w-3 h-3" /> {measurements.lengthCm} × {measurements.widthCm} cm
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg bg-space-950/70 backdrop-blur-md text-surgical-100/80 text-xs border border-white/[0.06]">Depth: {measurements.depthMm}mm</div>
                  <div className="px-2.5 py-1.5 rounded-lg bg-space-950/70 backdrop-blur-md text-surgical-100/80 text-xs border border-white/[0.06]">Area: {measurements.areaCm2} cm²</div>
                </div>
              </div>
            </div>

            {/* Tissue Composition */}
            <div className="card animate-stagger-fade" style={{ animationDelay: '500ms' }}>
              <h3 className="text-sm font-semibold text-surgical-50 mb-4">Tissue Composition</h3>
              <div className="space-y-3">
                {Object.entries(tissueComposition).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-surgical-100/60 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-sm font-mono font-medium text-surgical-50">{value}%</span>
                    </div>
                    <div className="w-full h-2 bg-space-700 rounded-full overflow-hidden">
                      <div className={cn(
                        'h-full rounded-full transition-all duration-700',
                        key === 'granulation' ? 'bg-emerald-500' : key === 'epithelial' ? 'bg-nebula-500' : key === 'necrotic' ? 'bg-surgical-200' : key === 'slough' ? 'bg-amber-500' : 'bg-crimson-500'
                      )} style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ICD-10 */}
            <div className="card animate-stagger-fade" style={{ animationDelay: '600ms' }}>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-nebula-400" />
                <h3 className="text-sm font-semibold text-surgical-50">ICD-10 Billing Codes</h3>
              </div>
              <div className="space-y-2">
                {icdCodes.map((code) => (
                  <div key={code} className="p-3 bg-space-700/50 rounded-xl border border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-nebula-400">{code}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-nebula-500/10 text-nebula-400 font-medium border border-nebula-500/20">ICD-10-CM</span>
                    </div>
                    <p className="text-xs text-surgical-100/40 mt-1">{ICD_DESCRIPTIONS[code] || 'Clinical code'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 2/5 – Data Panel */}
          <div className="lg:col-span-2 p-6 space-y-4 lg:border-l lg:border-white/[0.06]">
            <div className="animate-stagger-fade">
              <RiskCard title="Infection Risk" value={riskAssessment.infectionRisk}
                level={riskAssessment.infectionRisk >= 0.7 ? 'high' : riskAssessment.infectionRisk >= 0.4 ? 'medium' : 'low'}
                factors={riskAssessment.factors.filter(f => f.name.toLowerCase().includes('infection') || f.name.toLowerCase().includes('bacterial'))} />
            </div>
            <div className="animate-stagger-fade" style={{ animationDelay: '100ms' }}>
              <RiskCard title="Healing Velocity" value={riskAssessment.healingVelocity}
                level={riskAssessment.healingVelocity < 0.5 ? 'high' : riskAssessment.healingVelocity < 1 ? 'medium' : 'low'} unit="cm²/wk"
                factors={riskAssessment.factors.filter(f => f.name.toLowerCase().includes('healing') || f.name.toLowerCase().includes('delayed'))} />
            </div>
            <div className="animate-stagger-fade" style={{ animationDelay: '200ms' }}>
              <RiskCard title="Amputation Risk" value={riskAssessment.amputationRisk}
                level={riskAssessment.amputationRisk >= 0.3 ? 'high' : riskAssessment.amputationRisk >= 0.1 ? 'medium' : 'low'}
                factors={riskAssessment.factors.filter(f => f.name.toLowerCase().includes('neuropathy') || f.name.toLowerCase().includes('diabetic'))} />
            </div>
            <div className="animate-stagger-fade" style={{ animationDelay: '300ms' }}>
              <RiskCard title="Malignancy Risk" value={riskAssessment.malignancyRisk}
                level={riskAssessment.malignancyRisk >= 0.3 ? 'high' : riskAssessment.malignancyRisk >= 0.1 ? 'medium' : 'low'} />
            </div>

            {/* Healing Velocity SVG Curve */}
            <div className="card animate-stagger-fade" style={{ animationDelay: '400ms' }}>
              <h3 className="text-sm font-semibold text-surgical-50 mb-3">Healing Trajectory</h3>
              <div className="relative">
                <svg className="w-full h-28" viewBox="0 0 400 100" fill="none" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="heal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22D3EE" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                  <path d="M0,80 Q80,70 150,50 T300,25 T400,10" stroke="url(#heal-grad)" strokeWidth="2.5" fill="none" strokeDasharray="500" className="animate-draw" />
                  <circle cx="400" cy="10" r="4" fill="#10B981" className="animate-pulse" />
                </svg>
                <div className="absolute top-1 right-1 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full text-xs font-mono border border-emerald-500/20">
                  +15% / day
                </div>
              </div>
            </div>

            {/* Treatment Protocol */}
            <div className="animate-stagger-fade" style={{ animationDelay: '500ms' }}>
              <TreatmentProtocol />
            </div>

            {/* Mobile bottom bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-space-950/90 backdrop-blur-xl border-t border-white/[0.06] p-4 flex gap-3 z-40">
              <Link to="/capture" className="btn-secondary flex-1 py-4 text-base justify-center gap-2 min-h-[56px]"> 📸 Retake </Link>
              <button onClick={handleSaveToEHR} className="btn-primary flex-1 py-4 text-base justify-center gap-2 min-h-[56px]"> 💾 Save to EHR </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
