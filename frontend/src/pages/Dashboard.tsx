import { Link } from 'react-router-dom'
import { PatientCard } from '@/components/molecules/PatientCard'
import { MetricCard } from '@/components/molecules/MetricCard'
import { mockPatients } from '@/assets/mock-data/mock-patients'
import { Camera, Activity, Users, TrendingUp, Shield, Zap, Stethoscope, Heart } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

/**
 * Animated counter component for hero stat
 */
function CountUp({ end, duration = 2500 }: { end: number; duration?: number }) {
  const [value, setValue] = useState(0)
  const ref = useRef(0)

  useEffect(() => {
    const start = performance.now()
    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(end * eased))
      if (progress < 1) ref.current = requestAnimationFrame(tick)
    }
    ref.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(ref.current)
  }, [end, duration])

  return <>{value.toLocaleString('en-IN')}</>
}

export function Dashboard() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'शुभ प्रभात' : hour < 18 ? 'नमस्ते' : 'शुभ संध्या'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
      {/* Hero – "Limbs Saved" counter */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-space-800 via-space-900 to-space-950 border border-white/[0.06] p-6 sm:p-10 mb-8 animate-hero-in">
        <div className="relative z-10">
          {/* Greeting */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nebula-400 to-nebula-600 flex items-center justify-center shadow-lg shadow-nebula-500/30">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-surgical-100/50 text-sm">{greeting}, Dr. Sharma</p>
              <p className="text-surgical-100/30 text-xs">Ready to save another limb today?</p>
            </div>
          </div>

          {/* Main counter */}
          <div className="text-center py-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-crimson-400 animate-pulse" />
              <span className="text-xs text-surgical-100/40 uppercase tracking-widest font-medium">Lives Impacted</span>
            </div>
            <h2 className="font-display text-6xl sm:text-7xl font-bold gradient-text-teal tracking-tight">
              <CountUp end={3427} />
            </h2>
            <p className="text-surgical-100/50 mt-2 text-sm">Limbs saved this month across 523 PHCs</p>
          </div>

          {/* CTA */}
          <div className="flex justify-center mt-4">
            <Link to="/capture" className="btn-primary gap-2 px-8 shadow-2xl shadow-nebula-500/20 hover:scale-105 transition-transform">
              <Camera className="w-5 h-5" />
              Start New Scan
            </Link>
          </div>
        </div>

        {/* Decorative */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-nebula-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-20 w-32 h-32 bg-nebula-500/3 rounded-full blur-2xl" />
        <div className="absolute top-6 right-8 hidden sm:block opacity-[0.04]">
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-6 h-6 rounded border border-nebula-500" />
            ))}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="animate-stagger-fade"><MetricCard label="Total Scans" value="12,847" change={12.5} icon={<Camera className="w-5 h-5" />} /></div>
        <div className="animate-stagger-fade" style={{ animationDelay: '100ms' }}><MetricCard label="PHCs Active" value="523" change={8.2} icon={<Activity className="w-5 h-5" />} /></div>
        <div className="animate-stagger-fade" style={{ animationDelay: '200ms' }}><MetricCard label="Patients Served" value="9,421" change={15.3} icon={<Users className="w-5 h-5" />} /></div>
        <div className="animate-stagger-fade" style={{ animationDelay: '300ms' }}><MetricCard label="AI Accuracy" value="94.7%" change={0.4} icon={<TrendingUp className="w-5 h-5" />} /></div>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card group hover:border-nebula-500/30 transition-all duration-300 animate-stagger-fade" style={{ animationDelay: '400ms' }}>
          <div className="p-2.5 rounded-xl bg-nebula-500/10 text-nebula-400 w-fit mb-3 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-surgical-50 text-sm">Edge AI Analysis</h3>
          <p className="text-xs text-surgical-100/40 mt-1">ONNX-powered analysis runs on smartphone. No internet required.</p>
        </div>
        <div className="card group hover:border-emerald-500/30 transition-all duration-300 animate-stagger-fade" style={{ animationDelay: '500ms' }}>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-3 group-hover:scale-110 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-surgical-50 text-sm">DPDP Act Compliant</h3>
          <p className="text-xs text-surgical-100/40 mt-1">Patient data stays on device. Federated learning ensures privacy.</p>
        </div>
        <div className="card group hover:border-amber-500/30 transition-all duration-300 animate-stagger-fade" style={{ animationDelay: '600ms' }}>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit mb-3 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-surgical-50 text-sm">ASHA Worker Ready</h3>
          <p className="text-xs text-surgical-100/40 mt-1">Hinglish protocols. Simple interface for community health workers.</p>
        </div>
      </div>

      {/* Recent patients */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-surgical-50">Recent Patients</h3>
          <span className="text-xs text-surgical-100/30 font-mono">{mockPatients.length} records</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockPatients.map((patient, i) => (
            <div key={patient.id} className="animate-stagger-fade" style={{ animationDelay: `${700 + i * 100}ms` }}>
              <PatientCard patient={patient} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
