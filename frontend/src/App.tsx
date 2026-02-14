import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { Navbar } from '@/components/organisms/Navbar'
import { BottomNav } from '@/components/organisms/BottomNav'
import { Dashboard } from '@/pages/Dashboard'
import { Capture } from '@/pages/Capture'
import { Analysis } from '@/pages/Analysis'
import { Research } from '@/pages/Research'
import { PatientDetail } from '@/pages/PatientDetail'

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
      </div>
    </Router>
  )
}
