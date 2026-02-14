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
} from 'lucide-react'

export function Analysis() {
  const { currentAnalysis, isAnalyzing, setAnalysis } = useAnalysisStore()
  const { generate } = useProtocolStore()
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  // Load mock data if no analysis exists
  useEffect(() => {
    if (!currentAnalysis && !isAnalyzing) {
      setAnalysis(mockAnalysisResult)
    }
  }, [currentAnalysis, isAnalyzing, setAnalysis])

  // Auto-generate treatment protocol when analysis is ready
  useEffect(() => {
    if (currentAnalysis) {
      generate(currentAnalysis.id)
    }
  }, [currentAnalysis, generate])

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

  // Get the patient's images for before/after
  const patient = mockPatients.find((p) => p.id === currentAnalysis.patientId)
  const patientImages = patient?.images ?? []
  const activeImage = selectedDay !== null
    ? patientImages.find((img) => img.day === selectedDay)
    : null
  const activeScore = activeImage
    ? (activeImage.infection ?? activeImage.melanomaRisk ?? 0)
    : null

  return (
    <div className="min-h-screen bg-bg-primary pb-24 md:pb-6">
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
                {currentAnalysis.patientId}
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
            <button className="btn-primary text-sm gap-1.5">
              <Save className="w-3.5 h-3.5" />
              Save to EHR
            </button>
          </div>
        </div>
      </header>

      {/* Main content – 3 column on desktop */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2/3 – Image & Depth */}
          <div className="lg:col-span-2 space-y-6">
            {/* Before/After Day Toggle */}
            {patientImages.length > 1 && (
              <div className="card !p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="w-4 h-4 text-medical-teal" />
                  <h3 className="text-sm font-semibold text-text-primary">Healing Progress</h3>
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
                        <span className={cn(
                          'ml-2 text-xs',
                          isActive ? 'text-white/70' : 'text-gray-400'
                        )}>
                          {(score * 100).toFixed(0)}%
                        </span>
                      </button>
                    )
                  })}
                </div>
                {/* Score comparison */}
                {activeImage && (
                  <div className="mt-3 p-3 rounded-lg bg-gray-50 animate-fade-in">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Day {activeImage.day} — {activeImage.infection !== undefined ? 'Infection' : 'Melanoma'} risk
                      </span>
                      <Badge variant={
                        (activeScore ?? 0) >= 0.7 ? 'high' : (activeScore ?? 0) >= 0.4 ? 'medium' : 'low'
                      }>
                        {((activeScore ?? 0) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    {selectedDay !== null && selectedDay > 0 && (
                      <p className="text-xs text-risk-low mt-1 font-medium">
                        ↓ {((patientImages[0].infection ?? 0) - (activeScore ?? 0)).toFixed(2) } improvement since Day 0
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Wound image with annotations */}
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

                {/* Measurement overlay */}
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

            {/* 3D Depth Map */}
            <div className="card !p-0 overflow-hidden">
              <div className="p-4 pb-2">
                <h3 className="text-sm font-semibold text-text-primary">3D Depth Analysis</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Powered by ZoE-Depth • Interactive – drag to rotate
                </p>
              </div>
              <DepthMap className="h-72" />
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
                      <span className="text-sm font-mono font-medium text-text-primary">
                        {value}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-700',
                          key === 'granulation'
                            ? 'bg-risk-low'
                            : key === 'epithelial'
                            ? 'bg-medical-teal'
                            : key === 'necrotic'
                            ? 'bg-gray-800'
                            : key === 'slough'
                            ? 'bg-risk-medium'
                            : 'bg-medical-red'
                        )}
                        style={{ width: `${value}%` }}
                      />
                    </div>
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

            {/* Treatment Protocol */}
            <div className="mt-6">
              <TreatmentProtocol />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
