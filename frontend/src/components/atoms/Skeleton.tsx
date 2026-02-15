import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className, lines = 3 }: SkeletonProps) {
  return (
    <div className={cn('space-y-3', className)} role="status" aria-label="Loading content">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 rounded-md bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-white/[0.06] bg-[length:2000px_100%] animate-shimmer',
            i === lines - 1 && 'w-3/4'
          )}
        />
      ))}
    </div>
  )
}

export function ProtocolSkeleton() {
  return (
    <div className="card border-l-4 border-white/[0.08] space-y-4">
      <div className="h-6 w-48 rounded bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-white/[0.06] bg-[length:2000px_100%] animate-shimmer" />
      <Skeleton lines={4} />
      <div className="h-px bg-white/[0.06]" />
      <Skeleton lines={3} />
      <div className="mt-4 flex gap-2">
        <div className="h-12 w-40 rounded-lg bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-white/[0.06] bg-[length:2000px_100%] animate-shimmer" />
        <div className="h-12 w-32 rounded-lg bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-white/[0.06] bg-[length:2000px_100%] animate-shimmer" />
      </div>
    </div>
  )
}
