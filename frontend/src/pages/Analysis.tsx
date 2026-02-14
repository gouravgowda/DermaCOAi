import { useState, useEffect, Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { useAnalysisStore, useProtocolStore } from '@/lib/stores'
import { Spinner } from '@/components/atoms/Spinner'
import { RiskCard } from '@/components/molecules/RiskCard'
import { TreatmentProtocol } from '@/components/organisms/TreatmentProtocol'
import { Badge } from '@/components/atoms/Badge'
import { ArrowLeft, Share2, Download, Layers, TrendingUp, CheckCircle } from 'lucide-react'
import { mockAnalysisResult } from '@/assets/mock-data/mock-patients'

const Wound3DViewer = lazy(() => import('@/components/organisms/Wound3DViewer'))

// ... (keep HealingVelocity component as is) ...

function HealingVelocity({ value }: { value: number }) {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i += 0.1
      if (i >= value) {
        setAnimatedValue(value)
        clearInterval(interval)
      } else {
        setAnimatedValue(i)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [value])

  return (
    <span className="font-mono text-4xl bg-gradient-to-r from-accent-teal-500 to-risk-low bg-clip-text text-transparent">
      +{animatedValue.toFixed(1)}%
    </span>
  )
}

export function Analysis() {
  const { currentAnalysis, isAnalyzing, setAnalysis } = useAnalysisStore()
  const { generate } = useProtocolStore()
  const [showSaveToast, setShowSaveToast] = useState(false)
  const [activeTimeline, setActiveTimeline] = useState(0)

  // Use mock data if store is empty
  useEffect(() => {
    if (!currentAnalysis && !isAnalyzing) setAnalysis(mockAnalysisResult)
  }, [currentAnalysis, isAnalyzing, setAnalysis])

  // Generate protocol
  useEffect(() => {
    if (currentAnalysis) generate(currentAnalysis.id)
  }, [currentAnalysis, generate])

  // Timeline animation
  useEffect(() => {
    const t = setTimeout(() => {
      const interval = setInterval(() => {
        setActiveTimeline((prev) => (prev < 4 ? prev + 1 : prev))
      }, 600)
      return () => clearInterval(interval)
    }, 1000)
    return () => clearTimeout(t)
  }, [])

  const handleSave = () => {
    setShowSaveToast(true)
    setTimeout(() => setShowSaveToast(false), 4000)
  }

  if (isAnalyzing || !currentAnalysis) {
    return (
      <div className="h-screen bg-clinical-cream flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-medical-blue-600 font-display text-lg">Analyzing wound with AI...</p>
          <p className="text-neutral-500 text-sm mt-2">Generating 3D depth map (ZoE-Depth)</p>
        </div>
      </div>
    )
  }

  // FIXME: Confidence score display
  const confidence = 0.943

  return (
    <div className="min-h-screen bg-clinical-white pb-24 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-clinical-white/90 backdrop-blur-md border-b border-neutral-200 shadow-clinical">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-neutral-800">Analysis Report</h1>
                <div className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-medium text-emerald-700 uppercase tracking-widest">
                  Ready
                </div>
              </div>
              <p className="text-xs text-neutral-400 font-mono">ID: {currentAnalysis.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-neutral-400 hover:text-medical-blue-600 transition-colors" title="Share with Specialist">
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={handleSave} className="p-2 text-neutral-400 hover:text-medical-blue-600 transition-colors" title="Save to EHR">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Visuals */}
          <div className="lg:col-span-7 space-y-6">
            {/* 3D Depth Map */}
            <div className="card-glass border-neutral-200 aspect-[4/3] relative overflow-hidden group">
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <Badge variant="info" className="backdrop-blur-md bg-white/50">
                  <Layers className="w-3 h-3 mr-1" />
                  3D Reconstruction
                </Badge>
                <Badge variant="success" className="backdrop-blur-md bg-white/50">
                  {(confidence * 100).toFixed(1)}% Confidence
                </Badge>
              </div>

              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center bg-neutral-50">
                  <Spinner size="md" />
                </div>
              }>
                <Wound3DViewer />
              </Suspense>

              <div className="absolute bottom-4 right-4 text-[10px] text-neutral-400 text-right pointer-events-none">
                <p>ZoE-Depth Model v2.1</p>
                <p>Inference: 142ms (Client-side)</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="card p-4 text-center">
                <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Area</p>
                <p className="text-xl font-bold text-neural-800 font-mono">
                  {currentAnalysis.measurements.areaCm2}<span className="text-sm text-neutral-400 ml-0.5">cm²</span>
                </p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Depth</p>
                <p className="text-xl font-bold text-neural-800 font-mono">
                  {currentAnalysis.measurements.depthMm}<span className="text-sm text-neutral-400 ml-0.5">mm</span>
                </p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Tissue</p>
                <p className="text-xl font-bold text-neural-800 font-mono">
                  {currentAnalysis.tissueComposition.granulation}%
                </p>
                <p className="text-[10px] text-neutral-400">Granulation</p>
              </div>
              <div className="card p-4 text-center border-emerald-100 bg-emerald-50/30">
                <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">Healing</p>
                <div className="flex items-center justify-center gap-1">
                  <HealingVelocity value={currentAnalysis.riskAssessment.healingVelocity} />
                </div>
                <p className="text-[10px] text-emerald-600/60">Vel. / week</p>
              </div>
            </div>

            {/* Healing Trajectory Graph */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent-teal-500" />
                  Projected Healing Path
                </h3>
                <span className="text-xs text-neutral-400">Next 4 weeks</span>
              </div>
              <div className="h-48 relative flex items-end justify-between px-2">
                {/* SVG Graph Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                  <path
                    d="M0,150 C100,140 200,80 400,20"
                    fill="none"
                    stroke="#00B6C7"
                    strokeWidth="3"
                    className="drop-shadow-lg animate-draw"
                  />
                  {/* Area fill */}
                  <path
                    d="M0,150 C100,140 200,80 400,20 L400,190 L0,190 Z"
                    fill="url(#gradient)"
                    opacity="0.2"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00B6C7" />
                      <stop offset="100%" stopColor="#00B6C7" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Data points */}
                  {[0, 1, 2, 3, 4].map((i) => (
                     activeTimeline >= i && (
                      <circle
                        key={i}
                        cx={`${i * 25}%`}
                        cy={i === 0 ? 150 : i === 1 ? 135 : i === 2 ? 100 : i === 3 ? 60 : 20}
                        r="4"
                        fill="#FFFFFF"
                        stroke="#00B6C7"
                        strokeWidth="2"
                        className="animate-count-in"
                      />
                     )
                  ))}
                </svg>

                {/* X-Axis Labels */}
                {['Now', 'Week 1', 'Week 2', 'Week 3', 'Week 4'].map((label, i) => (
                  <span key={i} className="text-[10px] text-neutral-400 font-medium z-10 translate-y-6">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Analysis Data & Protocol */}
          <div className="lg:col-span-5 space-y-6">
            <RiskCard
              title="Overall Infection Risk"
              value={currentAnalysis.riskAssessment.infectionRisk}
              level={currentAnalysis.riskAssessment.overallRisk}
              factors={currentAnalysis.riskAssessment.factors}
            />
            <TreatmentProtocol />
          </div>
        </div>
      </main>

      {/* Save Success Toast */}
      {showSaveToast && (
        <div className="fixed top-6 right-6 bg-medical-blue-600 text-white p-4 rounded-xl shadow-clinical-lg z-50 animate-slide-in flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-emerald-400" />
          <div>
            <p className="font-medium text-sm">Saved to Ayushman Bharat EHR</p>
            <p className="text-xs text-white/80">FHIR R4 format • Patient IN-PHC-001</p>
          </div>
        </div>
      )}
    </div>
  )
}
