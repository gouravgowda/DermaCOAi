import { Link, useLocation } from 'react-router-dom'
import { Stethoscope, Search, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

export function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '#' },
    { name: 'Find Doctor', href: '/search' },
    { name: 'Blog', href: '/research' },
    { name: 'Contact', href: '#' },
  ]

  return (
    <header 
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled || !isHome ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center transition-transform group-hover:scale-110">
            <Stethoscope className="w-5 h-5" />
          </div>
          <span className={cn(
            "font-display font-bold text-xl tracking-tight",
            scrolled || !isHome ? "text-slate-800" : "text-white"
          )}>
            ProHealth
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-blue-500",
                scrolled || !isHome ? "text-slate-600" : "text-white/90 hover:text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className={cn(
            "p-2 rounded-full transition-colors",
            scrolled || !isHome ? "text-slate-600 hover:bg-slate-100" : "text-white hover:bg-white/10"
          )}>
            <Search className="w-5 h-5" />
          </button>
          
          <button className={cn(
             "p-2 rounded-full transition-colors md:hidden",
             scrolled || !isHome ? "text-slate-600 hover:bg-slate-100" : "text-white hover:bg-white/10"
           )}>
             <User className="w-5 h-5" />
           </button>

           <Link 
             to="/login"
             className={cn(
               "hidden md:inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-0.5",
               scrolled || !isHome 
                 ? "bg-blue-600 text-white hover:bg-blue-700" 
                 : "bg-white text-blue-600 hover:bg-blue-50"
             )}
           >
             Book Now
           </Link>
        </div>
      </div>
    </header>
  )
}
