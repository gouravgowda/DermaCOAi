import { Link } from 'react-router-dom'
import { PatientCard } from '@/components/molecules/PatientCard'
import { MetricCard } from '@/components/molecules/MetricCard'
import { mockPatients } from '@/assets/mock-data/mock-patients'
import { Camera, Activity, Users, TrendingUp, Shield, Zap } from 'lucide-react'

export function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
      {/* Hero section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-medical-blue via-medical-blue to-medical-teal/80 p-6 sm:p-8 mb-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-risk-low animate-pulse" />
            <span className="text-xs text-medical-teal font-medium tracking-wider uppercase">
              AI-Powered Wound Intelligence
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome to DermaScope AI
          </h2>
          <p className="text-sm text-white/70 max-w-lg mb-6">
            Smartphone-based wound analysis for India's Primary Health Centres.
            Bridging the gap between rural clinics and specialist care with AI.
          </p>
          <Link to="/capture" className="btn-primary gap-2 shadow-lg shadow-medical-teal/20">
            <Camera className="w-5 h-5" />
            Start New Scan
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-medical-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-medical-teal/5 rounded-full blur-2xl" />
        <div className="absolute top-4 right-8 hidden sm:block">
          <div className="grid grid-cols-3 gap-3 opacity-20">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-lg border border-white/20" />
            ))}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Total Scans"
          value="12,847"
          change={12.5}
          icon={<Camera className="w-5 h-5" />}
        />
        <MetricCard
          label="PHCs Active"
          value="523"
          change={8.2}
          icon={<Activity className="w-5 h-5" />}
        />
        <MetricCard
          label="Patients Served"
          value="9,421"
          change={15.3}
          icon={<Users className="w-5 h-5" />}
        />
        <MetricCard
          label="AI Accuracy"
          value="94.7%"
          change={0.4}
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card group hover:border-medical-teal/30 transition-all duration-300">
          <div className="p-2.5 rounded-lg bg-medical-teal/10 text-medical-teal w-fit mb-3 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-text-primary text-sm">Edge AI Analysis</h3>
          <p className="text-xs text-gray-500 mt-1">
            ONNX-powered wound analysis runs directly on smartphone. No internet required.
          </p>
        </div>
        <div className="card group hover:border-medical-teal/30 transition-all duration-300">
          <div className="p-2.5 rounded-lg bg-medical-green/10 text-medical-green w-fit mb-3 group-hover:scale-110 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-text-primary text-sm">DPDP Act Compliant</h3>
          <p className="text-xs text-gray-500 mt-1">
            Patient data stays on device. Federated learning ensures privacy.
          </p>
        </div>
        <div className="card group hover:border-medical-teal/30 transition-all duration-300">
          <div className="p-2.5 rounded-lg bg-risk-medium/10 text-risk-medium w-fit mb-3 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-text-primary text-sm">ASHA Worker Ready</h3>
          <p className="text-xs text-gray-500 mt-1">
            Hinglish treatment protocols. Simple interface for community health workers.
          </p>
        </div>
      </div>

      {/* Recent patients */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Recent Patients</h3>
          <span className="text-xs text-gray-400">{mockPatients.length} records</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      </div>
    </div>
  )
}
