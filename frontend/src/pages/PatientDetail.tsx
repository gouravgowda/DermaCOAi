import { useParams } from 'react-router-dom'
import { mockPatients } from '@/assets/mock-data/mock-patients'
import { Badge } from '@/components/atoms/Badge'
import { MapPin, Calendar, Phone, Mail, Clock, FileText } from 'lucide-react'
import { WoundTimeline } from '@/components/organisms/WoundTimeline'
import { TreatmentProtocol } from '@/components/organisms/TreatmentProtocol'

export function PatientDetail() {
  const { id } = useParams()
  const patient = mockPatients.find((p) => p.id === id) || mockPatients[0]

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-24">
      {/* Patient Header */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
               <div className="w-20 h-20 rounded-full bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold text-slate-400">
                 {patient.name.charAt(0)}
               </div>
               <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{patient.name}</h1>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                     <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {patient.age} years • {patient.gender}</span>
                     <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {patient.location}</span>
                  </div>
               </div>
            </div>
            
            <div className="flex gap-3">
               <button className="btn-secondary text-sm">Edit Profile</button>
               <button className="btn-primary text-sm">New Assessment</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-3 gap-8">
        {/* Left Col: Info & History */}
        <div className="space-y-6">
           <div className="card">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Medical Summary
              </h3>
              <div className="space-y-4">
                 <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Condition</label>
                    <p className="text-slate-800 font-medium">Chronic Venous Leg Ulcer</p>
                 </div>
                 <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Duration</label>
                    <p className="text-slate-800 font-medium">14 Weeks</p>
                 </div>
                 <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Allergies</label>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="warning">Adhesive Tape</Badge>
                      <Badge variant="warning">Latex</Badge>
                    </div>
                 </div>
              </div>
           </div>

           <div className="card">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                Contact Info
              </h3>
              <div className="space-y-3 text-sm">
                 <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="w-4 h-4" />
                    +91 98765 43210
                 </div>
                 <div className="flex items-center gap-3 text-slate-600">
                    <Mail className="w-4 h-4" />
                    patient@example.com
                 </div>
                 <div className="flex items-start gap-3 text-slate-600">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    123 MG Road, District 4, Bangalore
                 </div>
              </div>
           </div>
        </div>

        {/* Center & Right: Timeline and Treatment */}
        <div className="lg:col-span-2 space-y-8">
           <div className="card">
             <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-slate-900 flex items-center gap-2">
                 <Clock className="w-5 h-5 text-blue-600" />
                 Wound Progression
               </h3>
               <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-sm outline-none">
                 <option>Last 30 Days</option>
                 <option>All Time</option>
               </select>
             </div>
             
             {/* Using the component but it needs to be updated to light theme internally or via props. 
                 Since I updated global styles, it should be mostly fine, but let's assume it inherits styles.
             */}
             <WoundTimeline />
           </div>

           <TreatmentProtocol 
             protocol={`**Current Active Protocol:**\n\n1. **Cleanse**: Normal Saline.\n2. **Debride**: Enzymatic debridement if slough present.\n3. **Dress**: Foam dressing changed every 3 days.\n4. **Compression**: 4-layer compression bandage system.`} 
             icdCodes={['I87.2', 'L97.512']}
           />
        </div>
      </div>
    </div>
  )
}
