import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { Navbar } from '@/components/organisms/Navbar'
import { BottomNav } from '@/components/organisms/BottomNav'
import { Spinner } from '@/components/atoms/Spinner'
import { Dashboard } from '@/pages/Dashboard'

const Capture = lazy(() => import('@/pages/Capture').then(m => ({ default: m.Capture })))
const Analysis = lazy(() => import('@/pages/Analysis').then(m => ({ default: m.Analysis })))
const Research = lazy(() => import('@/pages/Research').then(m => ({ default: m.Research })))
const PatientDetail = lazy(() => import('@/pages/PatientDetail').then(m => ({ default: m.PatientDetail })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-sm text-slate-500">Loading ProHealth...</p>
      </div>
    </div>
  )
}

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="font-bold">P</span>
              </div>
              <span className="font-display font-bold text-xl">ProHealth</span>
            </div>
            <p className="text-slate-400 text-sm">
              Leading the way in medical excellence, trusted care.
            </p>
          </div>
          {/* Footer links placeholder */}
          <div>
            <h4 className="font-semibold mb-4 text-slate-100">Departments</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Cardiology</li>
              <li>Neurology</li>
              <li>Pediatrics</li>
            </ul>
          </div>
        </div>
      </footer>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <Router>
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
    </Router>
  )
}
