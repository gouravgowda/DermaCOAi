import { useParams, Link } from 'react-router-dom'
import { mockPatients } from '@/assets/mock-data/mock-patients'
import { WoundTimeline } from '@/components/organisms/WoundTimeline'
import { Badge } from '@/components/atoms/Badge'
import { cn, formatDate } from '@/lib/utils'
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Heart,
  FileText,
  Camera,
  CheckCircle2,
} from 'lucide-react'

export function PatientDetail() {
  const { id } = useParams<{ id: string }>()
  const patient = mockPatients.find((p) => p.id === id)

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-primary">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Patient not found</p>
          <Link to="/" className="btn-primary inline-flex">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const latestImage = patient.images[patient.images.length - 1]
  const latestScore = latestImage?.infection ?? latestImage?.melanomaRisk ?? 0
  const riskLevel = latestScore >= 0.7 ? 'high' : latestScore >= 0.4 ? 'medium' : 'low'

  return (
    <div className="min-h-screen bg-bg-primary pb-24 md:pb-6">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center gap-3 h-16">
          <Link
            to="/"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-text-primary truncate">
              {patient.name}
            </h2>
            <p className="text-xs text-gray-400">{patient.id}</p>
          </div>
          <Badge variant={riskLevel}>{riskLevel.toUpperCase()}</Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Demographics */}
            <div className="card">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Patient Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">{patient.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">
                    {patient.age} years old, {patient.gender}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">First visit: {formatDate(patient.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Story */}
            <div className="card">
              <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-medical-red" />
                Patient Story
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{patient.story}</p>
            </div>

            {/* Treatment */}
            <div className="card border-l-4 border-medical-teal">
              <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-medical-teal" />
                Treatment Given
              </h3>
              <p className="text-sm text-gray-600">{patient.treatment}</p>
            </div>

            {/* Outcome */}
            <div className={cn(
              'card border-l-4',
              patient.outcome.toLowerCase().includes('avoided') || patient.outcome.toLowerCase().includes('healed') || patient.outcome.toLowerCase().includes('removed')
                ? 'border-risk-low bg-risk-low/5'
                : 'border-risk-medium bg-risk-medium/5'
            )}>
              <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-risk-low" />
                Outcome
              </h3>
              <p className="text-sm text-gray-600">{patient.outcome}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link to="/capture" className="btn-primary flex-1 gap-1.5 text-sm">
                <Camera className="w-4 h-4" />
                New Scan
              </Link>
              <Link to="/analysis" className="btn-secondary flex-1 gap-1.5 text-sm">
                <FileText className="w-4 h-4" />
                View Analysis
              </Link>
            </div>
          </div>

          {/* Wound timeline */}
          <div className="lg:col-span-2">
            <WoundTimeline images={patient.images} patientName={patient.name} />
          </div>
        </div>
      </main>
    </div>
  )
}
