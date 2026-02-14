import { cn, formatDate } from '@/lib/utils'
import { Badge } from '@/components/atoms/Badge'
import type { WoundImage } from '@/types'
import { TrendingDown, TrendingUp, Camera } from 'lucide-react'

interface WoundTimelineProps {
  images: WoundImage[]
  patientName: string
  className?: string
}

export function WoundTimeline({ images, patientName, className }: WoundTimelineProps) {
  if (images.length === 0) {
    return (
      <div className="card text-center py-8">
        <Camera className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">No wound images captured yet</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-sm font-semibold text-text-primary">Wound Progress Timeline</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-medical-teal/50 to-gray-200" />

        {images.map((image, index) => {
          const score = image.infection ?? image.melanomaRisk ?? 0
          const prevScore = index > 0 ? (images[index - 1].infection ?? images[index - 1].melanomaRisk ?? 0) : score
          const improving = score < prevScore
          const riskLevel = score >= 0.7 ? 'high' : score >= 0.4 ? 'medium' : 'low'

          return (
            <div key={index} className="relative flex items-start gap-4 pb-6 last:pb-0 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              {/* Timeline dot */}
              <div
                className={cn(
                  'relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-2',
                  riskLevel === 'high'
                    ? 'bg-risk-high/10 border-risk-high/30'
                    : riskLevel === 'medium'
                    ? 'bg-risk-medium/10 border-risk-medium/30'
                    : 'bg-risk-low/10 border-risk-low/30'
                )}
              >
                <span className="text-xs font-bold text-text-primary">D{image.day}</span>
              </div>

              {/* Content card */}
              <div className="card flex-1 !p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Day {image.day}
                    </p>
                    {image.timestamp && (
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(image.timestamp)}</p>
                    )}
                  </div>
                  <Badge variant={
                    riskLevel === 'high' ? 'danger' :
                    riskLevel === 'medium' ? 'warning' :
                    'success'
                  }>
                    {image.melanomaRisk !== undefined ? 'Melanoma' : 'Infection'}: {(score * 100).toFixed(0)}%
                  </Badge>
                </div>

                {/* Wound image placeholder */}
                <div className="mt-3 h-32 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden">
                  <div className="text-center">
                    <Camera className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-400">{patientName} – Day {image.day}</p>
                  </div>
                </div>

                {/* Trend indicator */}
                {index > 0 && (
                  <div className={cn(
                    'mt-2 flex items-center gap-1.5 text-xs font-medium',
                    improving ? 'text-risk-low' : 'text-risk-high'
                  )}>
                    {improving ? (
                      <TrendingDown className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingUp className="w-3.5 h-3.5" />
                    )}
                    {improving ? 'Improving' : 'Worsening'} vs Day {images[index - 1].day}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
