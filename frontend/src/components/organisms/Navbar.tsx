import { Link, useLocation } from 'react-router-dom'
import { Stethoscope, Search, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const location = useLocation()

  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/analysis', label: 'Analysis' },
    { to: '/research', label: 'Research' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-space-950/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 min-h-[44px]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nebula-400 to-nebula-600 flex items-center justify-center shadow-lg shadow-nebula-500/20">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-surgical-50 text-sm tracking-tight">DermaScope</span>
            <span className="text-nebula-400 text-sm font-bold ml-1">AI</span>
          </div>
        </Link>

        {/* Nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px] flex items-center',
                  active
                    ? 'bg-nebula-500/10 text-nebula-400 shadow-sm'
                    : 'text-surgical-100/50 hover:text-surgical-50 hover:bg-white/[0.04]'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="p-2.5 rounded-xl text-surgical-100/50 hover:text-surgical-50 hover:bg-white/[0.06] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Search"
          >
            <Search className="w-4.5 h-4.5" />
          </button>
          <button
            className="p-2.5 rounded-xl text-surgical-100/50 hover:text-surgical-50 hover:bg-white/[0.06] transition-colors relative min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-nebula-400 rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nebula-500 to-nebula-600 flex items-center justify-center text-white text-xs font-bold ml-1">
            DS
          </div>
        </div>
      </div>
    </header>
  )
}
