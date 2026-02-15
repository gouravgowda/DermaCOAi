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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-bottom">
      <div className="flex items-stretch justify-around h-16">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex flex-col items-center justify-center flex-1 gap-1 transition-colors min-h-[44px]',
                active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <Icon className={cn("w-6 h-6", active && "fill-blue-600/10")} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
