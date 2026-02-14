import { cn } from '@/lib/utils'

interface GuidanceOverlayProps {
  status: 'searching' | 'adjusting' | 'optimal'
  className?: string
}

/**
 * GuidanceOverlay – animated SVG brackets + prominent center messaging
 * Makes guidance impossible to miss, even for first-time ASHA workers
 */
export function GuidanceOverlay({ status, className }: GuidanceOverlayProps) {
  const config = {
    searching: {
      stroke: '#EF4444',
      text: 'Center the wound area',
      subtext: 'Move device over the wound',
      bg: 'bg-risk-high/30',
    },
    adjusting: {
      stroke: '#F59E0B',
      text: 'Hold steady...',
      subtext: 'Optimal distance: 10-15 cm',
      bg: 'bg-risk-medium/30',
    },
    optimal: {
      stroke: '#10B981',
      text: '✓ Perfect! Tap to capture',
      subtext: 'Image quality sufficient for analysis',
      bg: 'bg-risk-low/30',
    },
  }

  const { stroke, text, subtext, bg } = config[status]

  const breatheStyle: React.CSSProperties =
    status !== 'optimal'
      ? {
          animation: 'bracket-breathe 3s ease-in-out infinite',
          transition: 'stroke 0.6s ease, opacity 0.6s ease',
        }
      : { transition: 'stroke 0.6s ease, opacity 0.6s ease' }

  return (
    <div className={cn('absolute inset-0 pointer-events-none z-10', className)}>
      <style>{`
        @keyframes bracket-breathe {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>

      {/* Corner brackets */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none">
        <path d="M80 140 L80 80 L140 80" stroke={stroke} strokeWidth="3" strokeLinecap="round" style={breatheStyle} />
        <path d="M260 80 L320 80 L320 140" stroke={stroke} strokeWidth="3" strokeLinecap="round" style={breatheStyle} />
        <path d="M80 260 L80 320 L140 320" stroke={stroke} strokeWidth="3" strokeLinecap="round" style={breatheStyle} />
        <path d="M260 320 L320 320 L320 260" stroke={stroke} strokeWidth="3" strokeLinecap="round" style={breatheStyle} />

        {status === 'optimal' && (
          <g style={{ animation: 'bracket-breathe 2s ease-in-out 1' }}>
            <circle cx="200" cy="200" r="4" fill="#10B981" opacity="0.8" />
            <circle cx="200" cy="200" r="16" stroke="#10B981" strokeWidth="1.5" fill="none" opacity="0.5" />
          </g>
        )}
      </svg>

      {/* Center guidance message – large and impossible to miss */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn(
          'px-6 py-4 rounded-2xl backdrop-blur-md text-center transition-all duration-500 max-w-[280px]',
          bg
        )}>
          <p className={cn(
            'text-lg font-bold text-white',
            status === 'searching' && 'animate-pulse'
          )}>
            {text}
          </p>
          <p className="text-xs text-white/70 mt-1">{subtext}</p>
        </div>
      </div>

      {/* Distance indicator at bottom */}
      <div className="absolute bottom-32 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm">
          <div className={cn(
            'w-2 h-2 rounded-full',
            status === 'optimal' ? 'bg-risk-low' : status === 'adjusting' ? 'bg-risk-medium' : 'bg-risk-high'
          )} />
          <span className="text-[11px] font-medium text-white/80">
            {status === 'optimal' ? 'Quality: Excellent' : status === 'adjusting' ? 'Quality: Good' : 'Quality: Low'}
          </span>
        </div>
      </div>
    </div>
  )
}
