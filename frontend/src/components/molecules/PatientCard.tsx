import { Link } from 'react-router-dom'
import type { Patient } from '@/types'
import { Badge } from '@/components/atoms/Badge'
import { MapPin, Calendar, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

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

export function PatientCard({ patient, className }: PatientCardProps) {
  return (
    <Link
      to={`/patient/${patient.id}`}
      className={cn(
        'card group cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2">
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
              {patient.name}
            </h3>
            <Badge variant={getRiskVariant(patient)}>Risk Level</Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {patient.age}y • {patient.gender}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {patient.location}
            </span>
          </div>

          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {patient.story}
          </p>
        </div>

        <div className="p-2 rounded-full bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </Link>
  )
}
