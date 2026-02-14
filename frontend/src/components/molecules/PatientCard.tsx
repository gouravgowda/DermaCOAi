import { cn, formatDate, truncate } from '@/lib/utils'
import { Badge } from '@/components/atoms/Badge'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Patient } from '@/types'

interface PatientCardProps {
  patient: Patient
  className?: string
}

export function PatientCard({ patient, className }: PatientCardProps) {
  const latestImage = patient.images[patient.images.length - 1]
  const latestInfection = latestImage?.infection ?? latestImage?.melanomaRisk ?? 0
  const riskLevel = latestInfection >= 0.7 ? 'high' : latestInfection >= 0.4 ? 'medium' : 'low'

  return (
    <Link
      to={`/patient/${patient.id}`}
      className={cn(
        'card group hover:border-nebula-500/20 transition-all duration-300 cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-surgical-50 truncate">{patient.name}</h3>
            <Badge variant={riskLevel}>{riskLevel}</Badge>
          </div>

          <div className="flex items-center gap-3 mt-1.5 text-sm text-surgical-100/40">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {patient.location}
            </span>
            <span>•</span>
            <span>{patient.age}y</span>
          </div>

          <p className="text-sm text-surgical-100/50 mt-2 line-clamp-2">
            {truncate(patient.story, 120)}
          </p>

          <div className="flex items-center gap-2 mt-3 text-xs text-surgical-100/30">
            <Calendar className="w-3 h-3" />
            {formatDate(patient.createdAt)}
            <span className="ml-auto text-nebula-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              View Details <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        <div className="ml-4 flex-shrink-0 w-16 h-16 rounded-xl bg-space-700 overflow-hidden">
          <div
            className="w-full h-full bg-gradient-to-br from-nebula-500/20 to-space-800 flex items-center justify-center text-nebula-400/40 text-xs font-mono"
            aria-label={`Wound image for ${patient.name}`}
          >
            {patient.images.length} img
          </div>
        </div>
      </div>
    </Link>
  )
}
