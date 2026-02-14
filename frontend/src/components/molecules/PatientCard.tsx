import { Link } from 'react-router-dom'
import type { Patient } from '@/types'
import { Badge } from '@/components/atoms/Badge'
import { MapPin, Calendar, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// PatientCard.tsx — Patient summary card
//
// Dr. Leena asked for age + location visible without clicking.
// Also shows a "story" snippet — ASHA workers liked reading about
// similar cases from other PHCs. Builds trust in the system.
// ─────────────────────────────────────────────────────────────────────────────

interface PatientCardProps {
  patient: Patient
  className?: string
}

function getRiskVariant(patient: Patient): 'success' | 'warning' | 'danger' {
  const latestImage = patient.images[patient.images.length - 1]
  if (!latestImage) return 'success'
  const risk = latestImage.infection ?? latestImage.melanomaRisk ?? 0
  if (risk > 0.6) return 'danger'
  if (risk > 0.3) return 'warning'
  return 'success'
}

function getRiskLabel(patient: Patient): string {
  const latestImage = patient.images[patient.images.length - 1]
  if (!latestImage) return 'Low Risk'
  const risk = latestImage.infection ?? latestImage.melanomaRisk ?? 0
  if (risk > 0.6) return 'High Risk'
  if (risk > 0.3) return 'Medium Risk'
  return 'Low Risk'
}

export function PatientCard({ patient, className }: PatientCardProps) {
  return (
    <Link
      to={`/patient/${patient.id}`}
      className={cn(
        'card group hover:shadow-clinical-lg hover:border-medical-blue-200 transition-all duration-300 block',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1.5">
            <h3 className="font-semibold text-neutral-800 group-hover:text-medical-blue-600 transition-colors truncate">
              {patient.name}
            </h3>
            <Badge variant={getRiskVariant(patient)}>{getRiskLabel(patient)}</Badge>
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-500 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {patient.age}y • {patient.gender}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {patient.location}
            </span>
          </div>

          <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
            {patient.story}
          </p>
        </div>

        <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-medical-blue-500 transition-colors flex-shrink-0 mt-1" />
      </div>
    </Link>
  )
}
