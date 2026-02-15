import { cn } from '@/lib/utils'
import { Check, Calendar } from 'lucide-react'

// Mock timeline data to replace the previous complex logic for now
// In a real app, this would be passed as props
const timelineEvents = [
  { date: 'Today', status: 'current', title: 'Assessment', desc: 'Healing progress detected' },
  { date: '3 Days Ago', status: 'completed', title: 'Dressing Change', desc: 'Foam dressing applied' },
  { date: '1 Week Ago', status: 'completed', title: 'Initial Visit', desc: 'Baseline captured' },
]

export function WoundTimeline({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {timelineEvents.map((event, i) => (
        <div key={i} className="relative flex gap-4">
          {/* Line */}
          {i !== timelineEvents.length - 1 && (
            <div className="absolute left-[19px] top-10 bottom-[-24px] w-0.5 bg-slate-100" />
          )}
          
          {/* Dot */}
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10",
            event.status === 'current' 
              ? "bg-blue-100 text-blue-600 ring-4 ring-white shadow-lg" 
              : "bg-slate-100 text-slate-400"
          )}>
            {event.status === 'completed' ? <Check className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
          </div>

          <div className="flex-1 pt-1 pb-2">
             <div className="flex justify-between items-start mb-1">
               <h4 className={cn("font-bold text-sm", event.status === 'current' ? "text-slate-900" : "text-slate-600")}>
                 {event.title}
               </h4>
               <span className="text-xs text-slate-400 font-medium">{event.date}</span>
             </div>
             <p className="text-sm text-slate-500">{event.desc}</p>
          </div>
        </div>
      ))}
      <div className="flex justify-center pt-2">
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 uppercase tracking-wide">
          View Full History
        </button>
      </div>
    </div>
  )
}
