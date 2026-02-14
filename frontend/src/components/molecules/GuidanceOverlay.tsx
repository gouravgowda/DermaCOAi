import { cn } from '@/lib/utils'

interface GuidanceOverlayProps {
  status: 'searching' | 'adjusting' | 'optimal' | null
  className?: string
}

export function GuidanceOverlay({ status, className }: GuidanceOverlayProps) {
  if (!status) return null

  const config = {
    searching: { text: 'Center the wound area', subtext: 'Optimal distance: 10–15 cm', bg: 'bg-space-800/80', ring: 'border-nebula-500/30' },
    adjusting: { text: 'Hold steady...', subtext: 'Almost there — keep distance', bg: 'bg-amber-500/10', ring: 'border-amber-400/40' },
    optimal: { text: '✓ Perfect', subtext: 'Tap capture now', bg: 'bg-emerald-500/10', ring: 'border-emerald-400/40' },
  }

  const { text, subtext, bg, ring } = config[status]

  return (
    <div className={cn('absolute inset-0 pointer-events-none z-10', className)}>
      {/* Animated corner brackets */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none">
        <g className={cn(status === 'optimal' ? 'stroke-emerald-400' : 'stroke-nebula-400/50')}>
          <path d="M80,20 L20,20 L20,80" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
          <path d="M320,20 L380,20 L380,80" strokeWidth="2" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '150ms' }} />
          <path d="M80,380 L20,380 L20,320" strokeWidth="2" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '300ms' }} />
          <path d="M320,380 L380,380 L380,320" strokeWidth="2" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '450ms' }} />
        </g>
      </svg>

      {/* Center guidance pill */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn(
          'px-6 py-4 rounded-2xl backdrop-blur-xl text-center transition-all duration-500 max-w-[280px] border',
          bg, ring
        )}>
          <p className={cn(
            'text-lg font-bold text-surgical-50',
            status === 'searching' && 'animate-pulse'
          )}>
            {text}
          </p>
          <p className="text-xs text-surgical-100/50 mt-1">{subtext}</p>
        </div>
      </div>

      {/* Bottom quality indicator */}
      <div className="absolute bottom-32 left-0 right-0 flex justify-center">
        <div className={cn(
          'px-4 py-2 rounded-full backdrop-blur-md text-[11px] font-medium border',
          status === 'optimal'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : status === 'adjusting'
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            : 'bg-space-800/60 text-surgical-100/50 border-white/[0.06]'
        )}>
          Quality: {status === 'optimal' ? '● Excellent' : status === 'adjusting' ? '◐ Adjusting' : '○ Searching'}
        </div>
      </div>
    </div>
  )
}
