import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// GuidanceOverlay.tsx — Camera viewfinder guidance
//
// Shows animated brackets + quality indicator while capturing.
// States: searching (amber), adjusting (amber), optimal (green).
// ─────────────────────────────────────────────────────────────────────────────

interface GuidanceOverlayProps {
  confidence: number
  guidance: 'searching' | 'adjusting' | 'optimal'
  className?: string
}

export function GuidanceOverlay({ confidence, guidance, className }: GuidanceOverlayProps) {
  const qualityColor =
    guidance === 'optimal' ? 'text-emerald-400' :
    guidance === 'adjusting' ? 'text-amber-400' : 'text-amber-400'

  const qualityBg =
    guidance === 'optimal' ? 'bg-emerald-500/15 border-emerald-500/20' :
    guidance === 'adjusting' ? 'bg-amber-500/15 border-amber-500/20' : 'bg-amber-500/15 border-amber-500/20'

  const bracketColor =
    guidance === 'optimal' ? 'stroke-emerald-400' :
    guidance === 'adjusting' ? 'stroke-amber-400' : 'stroke-amber-400'

  const qualityText =
    guidance === 'optimal' ? '✅ Optimal — Tap to capture' :
    guidance === 'adjusting' ? '🔄 Adjusting focus...' : '🔍 Searching for wound area...'

  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      {/* Animated corner brackets */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Top-left */}
        <path d="M 15 25 L 15 15 L 25 15" fill="none" className={cn('stroke-2', bracketColor)} strokeLinecap="round">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
        </path>
        {/* Top-right */}
        <path d="M 75 15 L 85 15 L 85 25" fill="none" className={cn('stroke-2', bracketColor)} strokeLinecap="round">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" begin="0.5s" />
        </path>
        {/* Bottom-left */}
        <path d="M 15 75 L 15 85 L 25 85" fill="none" className={cn('stroke-2', bracketColor)} strokeLinecap="round">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" begin="1s" />
        </path>
        {/* Bottom-right */}
        <path d="M 75 85 L 85 85 L 85 75" fill="none" className={cn('stroke-2', bracketColor)} strokeLinecap="round">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" begin="1.5s" />
        </path>
      </svg>

      {/* Quality indicator pill — glass */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className={cn(
          'px-4 py-2 rounded-full border text-sm font-medium backdrop-blur-xl flex items-center gap-2',
          qualityBg, qualityColor
        )}>
          <span>{qualityText}</span>
          <span className="font-mono text-xs opacity-60">{Math.round(confidence * 100)}%</span>
        </div>
      </div>
    </div>
  )
}
