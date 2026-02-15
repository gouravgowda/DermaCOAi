import { useState, useEffect, Suspense, lazy } from 'react'
import { Activity, Thermometer, Ruler, Info } from 'lucide-react'
import { MetricCard } from '@/components/molecules/MetricCard'
import { RiskCard } from '@/components/molecules/RiskCard'
import { TreatmentProtocol } from '@/components/organisms/TreatmentProtocol'
import { Badge } from '@/components/atoms/Badge'
import { Spinner } from '@/components/atoms/Spinner'
import { useAnalysisStore } from '@/lib/stores'
import { generateId } from '@/lib/utils'

const Wound3DViewer = lazy(() => import('@/components/organisms/Wound3DViewer'))

export function Analysis() {
  const { currentAnalysis, isAnalyzing, setAnalyzing } = useAnalysisStore()
  const [activeTab, setActiveTab] = useState<'overview' | '3d'>('overview')

  // Simulate analysis if empty
  useEffect(() => {
    if (!currentAnalysis && !isAnalyzing) {
      setAnalyzing(true)
      setTimeout(() => {
        useAnalysisStore.getState().setAnalysis({
          id: generateId(),
          timestamp: new Date().toISOString(),
          riskScore: 0.72,
          imageUrl: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80',
          depthMapUrl: 'placeholder',
          measurements: { area: 12.4, depth: 0.8, tissueType: 'Granulation' },
          factors: ['Irregular borders', 'Erythema detected', 'Exudate presence'],
          treatment: `**Recommended Protocol:**\n\n1. **Cleanse**: Saline irrigation.\n2. **Debride**: Sharp debridement of necrotic tissue.\n3. **Dress**: Alginate dressing for exudate management.\n4. **Monitor**: Check for signs of infection daily.`
        })
        setAnalyzing(false)
      }, 2000)
    }
  }, [currentAnalysis, isAnalyzing, setAnalyzing])

  if (isAnalyzing || !currentAnalysis) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-20 flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-20 h-20">
             <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
               <Activity className="w-10 h-10 text-blue-600" />
             </div>
             <Spinner size="lg" className="absolute inset-0 m-auto" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Analyzing Wound...</h2>
          <p className="text-slate-500">Generating 3D topology and clinical metrics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">Analysis Report</h1>
              <Badge variant="danger">High Severity</Badge>
            </div>
            <p className="text-slate-500 text-sm">Case ID: #CASE-{currentAnalysis.id.slice(0, 8)}</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm py-2">Export PDF</button>
            <button className="btn-primary text-sm py-2">Save to Record</button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Image & 3D */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card overflow-hidden p-0 border-0 shadow-lg bg-slate-900 h-[400px] relative">
               <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                 <span className="text-white/50 text-sm">Interactive 3D View</span>
               </div>
               <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-white">Loading Viewer...</div>}>
                 <Wound3DViewer className="h-full w-full" />
               </Suspense>
               
               {/* Controls */}
               <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur transition-all ${activeTab === 'overview' ? "bg-white text-blue-600 shadow-lg" : "bg-black/40 text-white hover:bg-black/60"}`}
                  >
                    Original
                  </button>
                  <button 
                    onClick={() => setActiveTab('3d')}
                    className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur transition-all ${activeTab === '3d' ? "bg-white text-blue-600 shadow-lg" : "bg-black/40 text-white hover:bg-black/60"}`}
                  >
                    Depth Map
                  </button>
               </div>
            </div>

            {/* Metrics Row */}
            <div className="grid sm:grid-cols-3 gap-4">
               <MetricCard 
                 label="Surface Area" 
                 value={`${currentAnalysis.measurements.area} cm²`} 
                 icon={<Ruler className="w-5 h-5" />} 
                 className="bg-white"
               />
               <MetricCard 
                 label="Max Depth" 
                 value={`${currentAnalysis.measurements.depth} mm`} 
                 icon={<Activity className="w-5 h-5" />} 
                 className="bg-white"
               />
               <MetricCard 
                 label="Tissue Temp" 
                 value="37.2°C" 
                 icon={<Thermometer className="w-5 h-5" />} 
                 className="bg-white"
               />
            </div>
            
            <TreatmentProtocol protocol={currentAnalysis.treatment} icdCodes={['L97.512', 'I87.2']} />
          </div>

          {/* Right Column: Risk & AI Insights */}
          <div className="space-y-6">
            <RiskCard riskScore={currentAnalysis.riskScore} factors={currentAnalysis.factors} />
            
            <div className="card bg-blue-600 text-white border-none shadow-xl shadow-blue-600/20">
               <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                   <Info className="w-6 h-6 text-white" />
                 </div>
                 <div>
                   <h3 className="font-bold text-lg mb-2">AI Insight</h3>
                   <p className="text-blue-100 text-sm leading-relaxed">
                     This wound shows signs of early granulation but high bacterial load risk. Recommended decreasing dressing change interval to 12h.
                   </p>
                 </div>
               </div>
            </div>

             <div className="card">
               <h3 className="font-bold text-slate-800 mb-4">Healing Velocity</h3>
               <div className="h-40 flex items-end gap-2">
                  {[40, 65, 50, 80, 75, 90, 85].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-100 rounded-t-lg relative group hover:bg-blue-200 transition-colors">
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg transition-all duration-1000" 
                        style={{ height: `${h}%` }} 
                      />
                    </div>
                  ))}
               </div>
               <div className="flex justify-between mt-2 text-xs text-slate-400">
                 <span>Week 1</span>
                 <span>Week 4</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
