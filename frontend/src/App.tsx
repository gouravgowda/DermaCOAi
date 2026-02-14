import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { Navbar } from '@/components/organisms/Navbar'
import { BottomNav } from '@/components/organisms/BottomNav'
import { Spinner } from '@/components/atoms/Spinner'
import { Dashboard } from '@/pages/Dashboard'

// Lazy-load heavy pages (3D, markdown, charts)
const Capture = lazy(() => import('@/pages/Capture').then(m => ({ default: m.Capture })))
const Analysis = lazy(() => import('@/pages/Analysis').then(m => ({ default: m.Analysis })))
const Research = lazy(() => import('@/pages/Research').then(m => ({ default: m.Research })))
const PatientDetail = lazy(() => import('@/pages/PatientDetail').then(m => ({ default: m.PatientDetail })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-space-950">
      <div className="text-center animate-hero-in">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-sm text-surgical-100/50">Loading module...</p>
      </div>
    </div>
  )
}

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      {/* Trust footer */}
      <footer className="hidden md:block bg-space-800/50 border-t border-white/[0.06] py-4 text-center">
        <p className="text-xs font-medium text-surgical-100/30 tracking-wide">
          Built for <span className="text-nebula-400">Ayushman Bharat</span> • CDSCO Compliant Path • DPDP Act 2023 • ₹0 Hardware Cost
        </p>
      </footer>
      <BottomNav />
    </>
  )
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-space-950 font-sans text-surgical-50 antialiased">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/capture" element={<Capture />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/research" element={<Research />} />
              <Route path="/patient/:id" element={<PatientDetail />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}
