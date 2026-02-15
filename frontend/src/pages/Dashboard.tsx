import { Link } from 'react-router-dom'
import { PatientCard } from '@/components/molecules/PatientCard'
import { mockPatients } from '@/assets/mock-data/mock-patients'
import { Play, ArrowRight, Activity, Heart, Brain, Baby, Stethoscope, Cross, Smile } from 'lucide-react'

export function Dashboard() {
  return (
    <div>
      {/* 
        Hero Section: "Compassionate care..." using gradient background 
        simulating the blue overlay from the reference image 
      */}
      <section className="relative bg-gradient-to-br from-blue-700 to-blue-900 text-white min-h-[600px] flex items-center pt-20 overflow-hidden">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-10">
           <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
        </div>
        
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
              Compassionate care, <br/>
              <span className="text-blue-200">exceptional results.</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-lg leading-relaxed">
              Our team of experienced doctors and healthcare professionals are committed to providing quality care and personalized attention to our patients.
            </p>
            
            <div className="flex items-center gap-6">
               <button className="bg-white text-blue-700 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all active:scale-95 flex items-center gap-2">
                 See how we work
                 <Play className="w-4 h-4 fill-current" />
               </button>
            </div>
          </div>

          {/* Right side Image Placeholder - Doctor Image Mockup */}
          <div className="relative hidden lg:block animate-fade-in">
             <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 transform hover:-translate-y-2 transition-transform duration-500">
               {/* Using a solid color placeholder that looks professional if image fails, or use a reliable unsplash ID */}
               <img 
                 src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1000&auto=format&fit=crop" 
                 alt="Doctor Team"
                 className="w-full h-[500px] object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
               
               {/* Floating Badge */}
               <div className="absolute top-8 right-8 bg-white/90 backdrop-blur text-blue-900 p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-float">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Smile className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">150K+</p>
                    <p className="text-xs font-medium text-slate-500">Patient Recovered</p>
                  </div>
               </div>
             </div>
          </div>
        </div>

        {/* Floating Stats Strip - Overlapping the Hero and Next Section */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2">
           <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-float p-8 grid grid-cols-2 md:grid-cols-4 divide-slate-100 md:divide-x gap-8">
              {[
                { label: 'Years of Experience', value: '20+' },
                { label: 'Patient Satisfaction', value: '95%' },
                { label: 'Patients Annually', value: '5,000+' },
                { label: 'Doctors on Staff', value: '10+' },
              ].map((stat, i) => (
                <div key={i} className="text-center group hover:-translate-y-1 transition-transform">
                  <p className="text-3xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{stat.value}</p>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
               <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">About Us</p>
               <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                 ProHealth is a team of experienced medical professionals
               </h2>
               <p className="text-slate-600 leading-relaxed mb-6">
                 Dedicated to providing top-quality healthcare services. We believe in a holistic approach to healthcare that focuses on treating the whole person, not just the illness or symptoms.
               </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80" className="rounded-2xl shadow-lg mt-8" alt="Team" />
              <img src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&q=80" className="rounded-2xl shadow-lg" alt="Lab" />
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
           <div className="text-center">
             <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2">Our Departments</p>
             <h2 className="text-4xl font-bold text-slate-900">For Your Health</h2>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[
             { title: 'Emergency Department', icon: Cross, desc: 'Urgent care for critical conditions.' },
             { title: 'Pediatric Department', icon: Baby, desc: 'Specialized care for infants and children.' },
             { title: 'Cardiology Department', icon: Heart, desc: 'Comprehensive heart and vascular care.' },
             { title: 'Neurology Department', icon: Brain, desc: 'Treatment for disorders of the nervous system.' },
             { title: 'Psychiatry Department', icon: Activity, desc: 'Mental health diagnosis and therapy.' },
           ].map((dept, i) => (
             <div key={i} className="group p-8 rounded-3xl border border-slate-100 hover:bg-blue-600 hover:shadow-xl transition-all duration-300 cursor-pointer text-left">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <dept.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-white">{dept.title}</h3>
                <p className="text-slate-500 group-hover:text-blue-100">{dept.desc}</p>
             </div>
           ))}
             <div className="group p-8 rounded-3xl border-2 border-dashed border-slate-200 hover:border-blue-600 transition-all duration-300 cursor-pointer text-left flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Clinical Partners</h3>
                <p className="text-sm text-slate-500 mb-2">AIIMS Dermatology Dept</p>
                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Validating Partner</div>
             </div>
        </div>
      </section>

      {/* Recent Activity / Patients (Keeping functional parts) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
           <div className="flex justify-between items-end mb-12">
             <div>
               <h2 className="text-3xl font-bold text-slate-900">Recent Patients</h2>
               <p className="text-slate-500 mt-2">Latest cases from the PHC network</p>
             </div>
             <Link to="/analysis" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
               View All <ArrowRight className="w-4 h-4" />
             </Link>
           </div>
           
           <div className="grid md:grid-cols-2 gap-6">
             {mockPatients.map((patient) => (
               <PatientCard key={patient.id} patient={patient} />
             ))}
           </div>
        </div>
      </section>
    </div>
  )
}
