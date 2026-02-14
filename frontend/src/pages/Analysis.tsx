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
  Ruler,
  Save,
  Share2,
  ArrowLeft,
  Target,
  Clock,
  AlertTriangle,
  Camera,
  CheckCircle,
  FileText,
} from 'lucide-react'

// ICD-10 code descriptions for ASHA workers
const ICD_DESCRIPTIONS: Record<string, string> = {
  'L97.529': 'Non-pressure chronic ulcer of unspecified foot',
  'L89.90': 'Pressure ulcer, unspecified stage',
  'L97.519': 'Non-pressure chronic ulcer of right foot with unspecified severity',
  'E11.621': 'Type 2 diabetes with foot ulcer',
  'I83.009': 'Varicose veins with ulcer, unspecified',
}

export function Analysis() {
  const { currentAnalysis, isAnalyzing, setAnalysis } = useAnalysisStore()
  const { generate } = useProtocolStore()
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [showSaveToast, setShowSaveToast] = useState(false)
  const [activeTimeline, setActiveTimeline] = useState(0)

  // Load mock data if no analysis exists
  useEffect(() => {
    if (!currentAnalysis && !isAnalyzing) {
      setAnalysis(mockAnalysisResult)
    }
  }, [currentAnalysis, isAnalyzing, setAnalysis])

  // Auto-generate treatment protocol
  useEffect(() => {
    if (currentAnalysis) {
      generate(currentAnalysis.id)
    }
  }, [currentAnalysis, generate])

  // Animate healing timeline progression
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveTimeline(1)
      setTimeout(() => setActiveTimeline(2), 600)
      setTimeout(() => setActiveTimeline(3), 1200)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleSaveToEHR = () => {
    setShowSaveToast(true)
    setTimeout(() => setShowSaveToast(false), 3500)
  }

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-primary">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="font-medium text-text-primary">Running wound analysis...</p>
          <p className="text-sm text-gray-500 mt-1">SAM segmentation + risk assessment</p>
        </div>
      </div>
    )
  }

  if (!currentAnalysis) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-primary">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No analysis data available</p>
          <Link to="/capture" className="btn-primary mt-4 inline-flex gap-2">
            Start New Scan
          </Link>
        </div>
      </div>
    )
  }

  const { measurements, riskAssessment, tissueComposition, woundType } = currentAnalysis

  // Get patient images for before/after
  const patient = mockPatients.find((p) => p.id === currentAnalysis.patientId)
  const patientImages = patient?.images ?? []
  const activeImage = selectedDay !== null
    ? patientImages.find((img) => img.day === selectedDay)
    : null
  const activeScore = activeImage
    ? (activeImage.infection ?? activeImage.melanomaRisk ?? 0)
    : null

  // Healing timeline milestones
  const timelineDays = [
    { day: 0, label: 'Day 0', desc: 'Initial scan', status: 'complete' as const },
    { day: 3, label: 'Day 3', desc: 'Dressing change', status: activeTimeline >= 1 ? 'complete' as const : 'pending' as const },
    { day: 7, label: 'Day 7', desc: 'Follow-up scan', status: activeTimeline >= 2 ? 'complete' as const : 'pending' as const },
    { day: 14, label: 'Day 14', desc: 'Healing target', status: activeTimeline >= 3 ? 'active' as const : 'pending' as const },
  ]

  // ICD codes from mock analysis
  const icdCodes = ['L97.529', 'E11.621']

  return (
    <div className="min-h-screen bg-bg-primary pb-24 md:pb-6">
      {/* Save to EHR toast */}
      {showSaveToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-risk-low text-white shadow-lg shadow-risk-low/30">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Saved to Ayushman Bharat EHR</p>
              <p className="text-xs text-white/80">FHIR R4 • DiagnosticReport created</p>
            </div>
          </div>
        </div>
      )}

      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <p className="text-sm font-semibold text-text-primary flex items-center gap-2">
                Wound Analysis
                <Badge variant={riskAssessment.overallRisk}>
                  {riskAssessment.overallRisk.toUpperCase()} RISK
                </Badge>
              </p>
              <p className="text-xs text-gray-400">
                <Clock className="w-3 h-3 inline mr-1" />
                {formatDate(currentAnalysis.timestamp)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm gap-1.5 hidden sm:inline-flex">
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
            <button onClick={handleSaveToEHR} className="btn-primary text-sm gap-1.5">
              <Save className="w-3.5 h-3.5" />
              Save to EHR
            </button>
          </div>
        </div>
      </header>

      {/* Main 3-column layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Healing Timeline – animated, prominent */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <Clock className="w-4 h-4 text-medical-teal" />
                  Healing Timeline
                </h3>
                <span className="text-xs text-gray-400">Projected 14-day plan</span>
              </div>
              <div className="flex items-center justify-between relative">
                {/* Connecting line */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200" />
                <div
                  className="absolute top-5 left-5 h-0.5 bg-medical-teal transition-all duration-1000 ease-out"
                  style={{ width: `${(activeTimeline / 3) * (100 - 10)}%` }}
                />

                {timelineDays.map((milestone) => (
                  <div key={milestone.day} className="flex flex-col items-center relative z-10">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2',
                      milestone.status === 'complete'
                        ? 'bg-medical-teal border-medical-teal text-white scale-100'
                        : milestone.status === 'active'
                        ? 'bg-white border-medical-teal text-medical-teal animate-pulse scale-110'
                        : 'bg-white border-gray-200 text-gray-400'
                    )}>
                      {milestone.status === 'complete' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-xs font-bold">{milestone.day}</span>
                      )}
                    </div>
                    <span className={cn(
                      'text-xs font-medium mt-2',
                      milestone.status !== 'pending' ? 'text-text-primary' : 'text-gray-400'
                    )}>
                      {milestone.label}
                    </span>
                    <span className="text-[10px] text-gray-400">{milestone.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Before/After Day Toggle */}
            {patientImages.length > 1 && (
              <div className="card !p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="w-4 h-4 text-medical-teal" />
                  <h3 className="text-sm font-semibold text-text-primary">Healing Progress Comparison</h3>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {patientImages.map((img) => {
                    const score = img.infection ?? img.melanomaRisk ?? 0
                    const isActive = selectedDay === img.day
                    return (
                      <button
                        key={img.day}
                        onClick={() => setSelectedDay(isActive ? null : img.day)}
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px]',
                          isActive
                            ? 'bg-medical-teal text-white shadow-md shadow-medical-teal/20'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        Day {img.day}
                        <span className={cn('ml-2 text-xs', isActive ? 'text-white/70' : 'text-gray-400')}>
                          {(score * 100).toFixed(0)}%
                        </span>
                      </button>
                    )
                  })}
                </div>
                {activeImage && (
                  <div className="mt-3 p-3 rounded-lg bg-gray-50 animate-fade-in">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Day {activeImage.day} – {activeImage.infection !== undefined ? 'Infection' : 'Melanoma'} risk
                      </span>
                      <Badge variant={(activeScore ?? 0) >= 0.7 ? 'high' : (activeScore ?? 0) >= 0.4 ? 'medium' : 'low'}>
                        {((activeScore ?? 0) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    {selectedDay !== null && selectedDay > 0 && (
                      <p className="text-xs text-risk-low mt-1 font-medium">
                        ↓ {(((patientImages[0].infection ?? 0) - (activeScore ?? 0)) * 100).toFixed(0)}% improvement since Day 0
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 3D Depth Map – PROMINENT, not hidden */}
            <div className="card !p-0 overflow-hidden">
              <div className="p-4 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">3D Wound Topology</h3>
                  <p className="text-xs text-gray-400 mt-0.5">ZoE-Depth monocular estimation • Drag to rotate</p>
                </div>
                <span className="text-[10px] bg-medical-teal/10 text-medical-teal px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
                  Patent Pending
                </span>
              </div>
              <DepthMap className="h-72" />
            </div>

            {/* Wound image with measurements */}
            <div className="card !p-0 overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <Target className="w-10 h-10 text-medical-teal/30 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">
                      {selectedDay !== null ? `Day ${selectedDay} Capture` : 'Wound Image'}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      {woundType.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                  <div className="px-2.5 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs flex items-center gap-1.5">
                    <Ruler className="w-3 h-3" />
                    {measurements.lengthCm} × {measurements.widthCm} cm
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs">
                    Depth: {measurements.depthMm}mm
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs">
                    Area: {measurements.areaCm2} cm²
                  </div>
                </div>
              </div>
            </div>

            {/* Tissue Composition */}
            <div className="card">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Tissue Composition</h3>
              <div className="space-y-3">
                {Object.entries(tissueComposition).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm font-mono font-medium text-text-primary">{value}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-700',
                          key === 'granulation' ? 'bg-risk-low'
                            : key === 'epithelial' ? 'bg-medical-teal'
                            : key === 'necrotic' ? 'bg-gray-800'
                            : key === 'slough' ? 'bg-risk-medium'
                            : 'bg-medical-red'
                        )}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ICD-10 Codes – with human-readable descriptions */}
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-medical-teal" />
                <h3 className="text-sm font-semibold text-text-primary">ICD-10 Billing Codes</h3>
              </div>
              <div className="space-y-2">
                {icdCodes.map((code) => (
                  <div key={code} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-medical-blue">{code}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-medical-blue/10 text-medical-blue font-medium">
                        ICD-10-CM
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {ICD_DESCRIPTIONS[code] || 'Clinical classification code'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 1/3 – Risk & Treatment */}
          <div className="space-y-4">
            <RiskCard
              title="Infection Risk"
              value={riskAssessment.infectionRisk}
              level={riskAssessment.infectionRisk >= 0.7 ? 'high' : riskAssessment.infectionRisk >= 0.4 ? 'medium' : 'low'}
              factors={riskAssessment.factors.filter((f) => f.name.toLowerCase().includes('infection') || f.name.toLowerCase().includes('bacterial'))}
            />
            <RiskCard
              title="Healing Velocity"
              value={riskAssessment.healingVelocity}
              level={riskAssessment.healingVelocity < 0.5 ? 'high' : riskAssessment.healingVelocity < 1 ? 'medium' : 'low'}
              unit="cm²/wk"
              factors={riskAssessment.factors.filter((f) => f.name.toLowerCase().includes('healing') || f.name.toLowerCase().includes('delayed'))}
            />
            <RiskCard
              title="Amputation Risk"
              value={riskAssessment.amputationRisk}
              level={riskAssessment.amputationRisk >= 0.3 ? 'high' : riskAssessment.amputationRisk >= 0.1 ? 'medium' : 'low'}
              factors={riskAssessment.factors.filter((f) => f.name.toLowerCase().includes('neuropathy') || f.name.toLowerCase().includes('diabetic'))}
            />
            <RiskCard
              title="Malignancy Risk"
              value={riskAssessment.malignancyRisk}
              level={riskAssessment.malignancyRisk >= 0.3 ? 'high' : riskAssessment.malignancyRisk >= 0.1 ? 'medium' : 'low'}
            />

            <div className="mt-6">
              <TreatmentProtocol />
            </div>

            {/* Mobile bottom action bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 flex gap-3 z-40">
              <Link to="/capture" className="btn-secondary flex-1 py-4 text-base justify-center gap-2 min-h-[56px]">
                📸 Retake
              </Link>
              <button onClick={handleSaveToEHR} className="btn-primary flex-1 py-4 text-base justify-center gap-2 min-h-[56px]">
                💾 Save to EHR
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
