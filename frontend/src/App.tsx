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
    <div className="flex items-center justify-center h-screen bg-bg-primary">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading module...</p>
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
      <footer className="hidden md:block bg-gradient-to-r from-medical-blue to-medical-blue/95 text-white py-3 text-center">
        <p className="text-xs font-medium tracking-wide">
          Built for <span className="text-medical-teal">Ayushman Bharat</span> • CDSCO Compliant Path • DPDP Act 2023 • ₹0 Hardware Cost
        </p>
      </footer>
      <BottomNav />
    </>
  )
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg-primary font-sans text-text-primary antialiased">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Capture page is fullscreen – no Navbar/BottomNav */}
            <Route path="/capture" element={<Capture />} />

            {/* All other pages share the layout */}
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
