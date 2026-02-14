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
            'h-4 rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:2000px_100%] animate-shimmer',
            i === lines - 1 && 'w-3/4' // last line is shorter for realism
          )}
        />
      ))}
    </div>
  )
}

export function ProtocolSkeleton() {
  return (
    <div className="bg-white rounded-lg border-l-4 border-gray-200 p-4 space-y-4">
      <div className="h-6 w-48 rounded bg-gray-200 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:2000px_100%]" />
      <Skeleton lines={4} />
      <div className="h-px bg-gray-100" />
      <Skeleton lines={3} />
      <div className="mt-4 flex gap-2">
        <div className="h-12 w-40 rounded-lg bg-gray-200 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:2000px_100%]" />
        <div className="h-12 w-32 rounded-lg bg-gray-200 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:2000px_100%]" />
      </div>
    </div>
  )
}
