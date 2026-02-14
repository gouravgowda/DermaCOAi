import { cn } from '@/lib/utils'

interface ConfidenceBarProps {
  confidence: number // 0-100
  className?: string
}

export function ConfidenceBar({ confidence, className }: ConfidenceBarProps) {
  const getColor = () => {
    if (confidence >= 80) return 'bg-risk-low'
    if (confidence >= 50) return 'bg-risk-medium'
    return 'bg-risk-high'
  }

  const getLabel = () => {
    if (confidence >= 80) return 'Optimal'
    if (confidence >= 50) return 'Adjusting...'
    return 'Searching...'
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-white/80">Image Quality</span>
        <span className="text-xs font-mono text-white/90">
          {getLabel()} ({Math.round(confidence)}%)
        </span>
      </div>
      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', getColor())}
          style={{ width: `${Math.min(confidence, 100)}%` }}
          role="progressbar"
          aria-valuenow={confidence}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Image quality: ${getLabel()}`}
        />
      </div>
    </div>
  )
}
