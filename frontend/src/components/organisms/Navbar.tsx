import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Activity, Camera, BarChart3, Users, Menu, X, Wifi, WifiOff } from 'lucide-react'
import { useState } from 'react'
import { useOffline } from '@/hooks/useOffline'

export function Navbar() {
  const location = useLocation()
  const { isOffline } = useOffline()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Activity },
    { path: '/capture', label: 'New Scan', icon: Camera },
    { path: '/research', label: 'Research', icon: BarChart3 },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-medical-teal to-medical-blue flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary leading-tight">DermaScope</h1>
              <p className="text-[10px] text-medical-teal font-medium -mt-0.5 tracking-wide">AI INDIA</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px]',
                    isActive
                      ? 'bg-medical-teal/10 text-medical-teal'
                      : 'text-gray-600 hover:text-text-primary hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Offline indicator */}
            {isOffline && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-risk-medium/10 text-risk-medium text-xs font-medium">
                <WifiOff className="w-3.5 h-3.5" />
                Offline
              </div>
            )}
            {!isOffline && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-risk-low/10 text-risk-low text-xs font-medium">
                <Wifi className="w-3.5 h-3.5" />
                Online
              </div>
            )}

            {/* Team badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-medical-blue/5 border border-medical-blue/10">
              <Users className="w-3.5 h-3.5 text-medical-blue" />
              <span className="text-xs font-semibold text-medical-blue">CODEX</span>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all min-h-[48px]',
                    isActive
                      ? 'bg-medical-teal/10 text-medical-teal'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        )}
      </div>
    </header>
  )
}
