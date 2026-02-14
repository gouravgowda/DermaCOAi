import { useState, useEffect, useMemo } from 'react'
import { generateMockPhcs } from '@/assets/mock-data/mock-patients'
import { MetricCard } from '@/components/molecules/MetricCard'
import { Badge } from '@/components/atoms/Badge'
import { cn } from '@/lib/utils'
import {
  Globe2,
  Activity,
  Users,
  TrendingUp,
  Cpu,
  Lock,
  Radio,
  Zap,
} from 'lucide-react'

export function Research() {
  const mockPhcs = useMemo(() => generateMockPhcs(), [])
  const [modelVersion, setModelVersion] = useState(3.42)
  const [accuracy, setAccuracy] = useState(94.3)
  const [totalPatients, setTotalPatients] = useState(12000)
  const [lastContribution, setLastContribution] = useState('')
  const [activePulse, setActivePulse] = useState<number | null>(null)

  // Simulate federated learning rounds
  useEffect(() => {
    const interval = setInterval(() => {
      setModelVersion((v) => +(v + 0.01).toFixed(2))
      setAccuracy((a) => +(Math.min(a + Math.random() * 0.05, 99.9)).toFixed(1))
      setTotalPatients((p) => p + Math.floor(Math.random() * 5) + 1)

      const randomPhc = mockPhcs[Math.floor(Math.random() * mockPhcs.length)]
      setLastContribution(`${randomPhc.name} contributed ${randomPhc.patients} gradients`)
      setActivePulse(Math.floor(Math.random() * mockPhcs.length))

      // Clear pulse after animation
      setTimeout(() => setActivePulse(null), 1000)
    }, 5000)

    return () => clearInterval(interval)
  }, [mockPhcs])

  const activeNodes = mockPhcs.filter((n) => n.status === 'active').length
  const syncingNodes = mockPhcs.filter((n) => n.status === 'syncing').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-medical-teal animate-pulse" />
          <span className="text-xs text-medical-teal font-medium tracking-wider uppercase">
            Federated Learning Network
          </span>
        </div>
        <h2 className="text-2xl font-bold text-text-primary">Research Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">
          Privacy-preserving model training across India's PHC network. No raw data leaves the device.
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Model Version"
          value={`v${modelVersion}`}
          icon={<Cpu className="w-5 h-5" />}
        />
        <MetricCard
          label="Global Accuracy"
          value={`${accuracy}%`}
          change={0.4}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <MetricCard
          label="Patients Trained"
          value={totalPatients.toLocaleString('en-IN')}
          change={12.5}
          icon={<Users className="w-5 h-5" />}
        />
        <MetricCard
          label="Active Nodes"
          value={`${activeNodes}/${mockPhcs.length}`}
          icon={<Radio className="w-5 h-5" />}
        />
      </div>

      {/* Map and activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* India Map Visualization */}
        <div className="lg:col-span-2 card !p-0 overflow-hidden">
          <div className="p-4 pb-2 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-medical-teal" />
                PHC Network Map
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {mockPhcs.length} Primary Health Centres across 9 states
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-medical-teal" />
                Active ({activeNodes})
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-risk-medium animate-pulse" />
                Syncing ({syncingNodes})
              </span>
            </div>
          </div>

          {/* SVG Map of India with dots */}
          <div className="relative bg-medical-blue/5 p-4" style={{ minHeight: '400px' }}>
            <svg
              viewBox="65 5 40 40"
              className="w-full h-full"
              style={{ minHeight: '380px' }}
            >
              {/* India outline (simplified) */}
              <path
                d="M75,8 L82,8 L88,10 L92,14 L94,18 L95,22 L93,26 L90,28 L88,32 L85,35 L82,38 L78,40 L76,37 L72,34 L70,30 L68,26 L67,22 L68,18 L70,14 L72,10 Z"
                fill="none"
                stroke="#00C6CF"
                strokeWidth="0.15"
                opacity="0.3"
              />

              {/* PHC dots */}
              {mockPhcs.map((phc, i) => {
                const isActive = activePulse === i
                return (
                  <g key={phc.id}>
                    <circle
                      cx={phc.lng / 1.15 + 2}
                      cy={(phc.lat - 5) * -1 + 35}
                      r={isActive ? 0.4 : 0.15}
                      fill={
                        phc.status === 'active'
                          ? '#00C6CF'
                          : phc.status === 'syncing'
                          ? '#F59E0B'
                          : '#6B7280'
                      }
                      opacity={phc.status === 'offline' ? 0.3 : 0.8}
                      className={cn(isActive && 'animate-pulse-teal')}
                    >
                      {isActive && (
                        <animate
                          attributeName="r"
                          from="0.15"
                          to="0.6"
                          dur="1s"
                          fill="freeze"
                        />
                      )}
                    </circle>
                    {isActive && (
                      <circle
                        cx={phc.lng / 1.15 + 2}
                        cy={(phc.lat - 5) * -1 + 35}
                        r="0.8"
                        fill="none"
                        stroke="#00C6CF"
                        strokeWidth="0.05"
                        opacity="0.5"
                      >
                        <animate
                          attributeName="r"
                          from="0.3"
                          to="1.2"
                          dur="1s"
                          fill="freeze"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.6"
                          to="0"
                          dur="1s"
                          fill="freeze"
                        />
                      </circle>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          {/* Privacy card */}
          <div className="card-glass border-medical-teal/20">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-medical-teal" />
              <h3 className="text-sm font-semibold text-text-primary">Privacy Guarantee</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Only model gradients are shared – never raw patient images or data.
              Compliant with DPDP Act 2023 and ICMR guidelines.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge variant="info">Differential Privacy</Badge>
              <Badge variant="info">Secure Aggregation</Badge>
              <Badge variant="info">DPDP Compliant</Badge>
            </div>
          </div>

          {/* Latest contribution */}
          <div className="card">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-medical-teal" />
              Latest Activity
            </h3>
            {lastContribution && (
              <div className="p-3 rounded-lg bg-medical-teal/5 border border-medical-teal/10 animate-fade-in">
                <p className="text-xs text-gray-600">{lastContribution}</p>
                <p className="text-[10px] text-gray-400 mt-1">Just now</p>
              </div>
            )}
          </div>

          {/* Training stats */}
          <div className="card">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-medical-teal" />
              Training Progress
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Round Progress</span>
                  <span className="font-mono text-text-primary">87%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-medical-teal rounded-full transition-all duration-1000" style={{ width: '87%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Convergence</span>
                  <span className="font-mono text-text-primary">92%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-risk-low rounded-full transition-all duration-1000" style={{ width: '92%' }} />
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-400">
                Next aggregation in ~{Math.floor(Math.random() * 30 + 10)}s
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
