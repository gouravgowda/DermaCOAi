import { cn } from '@/lib/utils'

interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'default'
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeProps['variant'], string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-medical-blue-600 border-blue-200',
  default: 'bg-neutral-100 text-neutral-600 border-neutral-200',
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
