import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Activity, Camera, BarChart3, User } from 'lucide-react'

export function BottomNav() {
  const location = useLocation()

  const items = [
    { path: '/', label: 'Home', icon: Activity },
    { path: '/capture', label: 'Scan', icon: Camera },
    { path: '/research', label: 'Research', icon: BarChart3 },
    { path: '/patient/IN-PHC-2026-001', label: 'Patient', icon: User },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200/50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          const isScan = item.path === '/capture'

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 min-h-[48px] min-w-[48px] px-3 py-1.5 rounded-xl transition-all duration-200',
                isActive && !isScan && 'text-medical-teal',
                !isActive && !isScan && 'text-gray-400 hover:text-gray-600',
              )}
            >
              {isScan ? (
                <div
                  className={cn(
                    'w-12 h-12 -mt-5 rounded-full flex items-center justify-center shadow-lg transition-all duration-200',
                    isActive
                      ? 'bg-medical-teal text-white shadow-medical-teal/30'
                      : 'bg-medical-teal/90 text-white hover:bg-medical-teal'
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span
                className={cn(
                  'text-[10px] font-medium',
                  isScan && '-mt-0.5'
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
