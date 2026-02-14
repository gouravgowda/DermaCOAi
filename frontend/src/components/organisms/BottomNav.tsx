import { Link, useLocation } from 'react-router-dom'
import { Home, Camera, BarChart3, FlaskConical } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/capture', icon: Camera, label: 'Scan' },
  { to: '/analysis', icon: BarChart3, label: 'Analysis' },
  { to: '/research', icon: FlaskConical, label: 'Research' },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-clinical-white/90 backdrop-blur-xl border-t border-neutral-200 shadow-clinical safe-area-bottom">
      <div className="flex items-stretch justify-around h-16">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex flex-col items-center justify-center flex-1 gap-0.5 transition-all duration-200 min-h-[44px]',
                active ? 'text-accent-teal-500' : 'text-neutral-400 hover:text-neutral-600'
              )}
            >
              <div className={cn(
                'p-1.5 rounded-xl transition-all duration-200',
                active && 'bg-accent-teal-500/10'
              )}>
                <Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 1.5} />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
