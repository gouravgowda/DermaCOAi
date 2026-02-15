import ReactMarkdown from 'react-markdown'
import { FileText, Copy, Check, Download, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface TreatmentProtocolProps {
  protocol: string
  icdCodes?: string[]
  className?: string
}

export function TreatmentProtocol({ protocol, icdCodes = [], className }: TreatmentProtocolProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(protocol)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('card border-t-4 border-t-blue-600', className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Treatment Plan</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {icdCodes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {icdCodes.map((code) => (
            <span
              key={code}
              className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-medium border border-slate-200"
            >
              {code}
            </span>
          ))}
        </div>
      )}

      <div className="prose prose-sm prose-slate max-w-none">
        <ReactMarkdown>{protocol}</ReactMarkdown>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          AI-generated protocol based on visual analysis. This is a recommendation support tool and does not replace professional clinical judgment. Verify all medications and dosages.
        </p>
      </div>
    </div>
  )
}
