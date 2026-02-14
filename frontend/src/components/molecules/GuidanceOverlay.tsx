import { cn } from '@/lib/utils'

interface GuidanceOverlayProps {
  status: 'searching' | 'adjusting' | 'optimal'
  className?: string
}

/**
 * GuidanceOverlay – animated SVG brackets that guide wound framing
 * Searching: red slow-breathing brackets
 * Adjusting: yellow brackets with gentle opacity shift
 * Optimal: green steady brackets with checkmark
 */
export function GuidanceOverlay({ status, className }: GuidanceOverlayProps) {
  const colors = {
    searching: { stroke: '#EF4444', text: 'Center the wound area' },
    adjusting: { stroke: '#F59E0B', text: 'Hold steady...' },
    optimal: { stroke: '#10B981', text: 'Perfect! Tap to capture' },
  }

  const { stroke, text } = colors[status]

  // Gentle breathing style for non-optimal states (3s cycle, subtle opacity range)
  const breatheStyle: React.CSSProperties =
    status !== 'optimal'
      ? {
          animation: 'bracket-breathe 3s ease-in-out infinite',
          transition: 'stroke 0.6s ease, opacity 0.6s ease',
        }
      : { transition: 'stroke 0.6s ease, opacity 0.6s ease' }

  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      {/* Inject breathing keyframes once */}
      <style>{`
        @keyframes bracket-breathe {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>

      {/* Corner brackets */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none">
        {/* Top-left bracket */}
        <path
          d="M80 140 L80 80 L140 80"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
          style={breatheStyle}
        />
        {/* Top-right bracket */}
        <path
          d="M260 80 L320 80 L320 140"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
          style={breatheStyle}
        />
        {/* Bottom-left bracket */}
        <path
          d="M80 260 L80 320 L140 320"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
          style={breatheStyle}
        />
        {/* Bottom-right bracket */}
        <path
          d="M260 320 L320 320 L320 260"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
          style={breatheStyle}
        />

        {/* Center crosshair when optimal */}
        {status === 'optimal' && (
          <g style={{ animation: 'bracket-breathe 2s ease-in-out 1' }}>
            <circle cx="200" cy="200" r="4" fill="#10B981" opacity="0.8" />
            <circle cx="200" cy="200" r="16" stroke="#10B981" strokeWidth="1.5" fill="none" opacity="0.5" />
          </g>
        )}
      </svg>

      {/* Status text */}
      <div className="absolute bottom-28 left-0 right-0 flex justify-center">
        <div
          className={cn(
            'px-4 py-2 rounded-full backdrop-blur-md text-sm font-medium transition-all duration-500',
            status === 'optimal'
              ? 'bg-risk-low/20 text-white'
              : status === 'adjusting'
              ? 'bg-risk-medium/20 text-white'
              : 'bg-risk-high/20 text-white'
          )}
        >
          {text}
        </div>
      </div>
    </div>
  )
}
