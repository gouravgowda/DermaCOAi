import ReactMarkdown from 'react-markdown'
import { useProtocolStore } from '@/lib/stores'
import { ProtocolSkeleton } from '@/components/atoms/Skeleton'
import { FileText, Edit, Check, AlertCircle } from 'lucide-react'

export function TreatmentProtocol() {
  const { protocol, loading, error, generate } = useProtocolStore()

  if (error) {
    return (
      <div className="bg-medical-red/5 rounded-lg border-l-4 border-medical-red p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-medical-red flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-medical-red">{error}</p>
          <button
            onClick={() => generate('retry')}
            className="text-sm text-medical-teal mt-2 hover:underline"
          >
            Retry generation
          </button>
        </div>
      </div>
    )
  }

  if (loading) return <ProtocolSkeleton />

  if (!protocol) {
    return (
      <div className="card text-center py-8">
        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">
          Treatment protocol will be generated after analysis
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border-l-4 border-medical-teal p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-medical-teal" />
        <h3 className="text-sm font-semibold text-text-primary">Treatment Protocol</h3>
        <span className="text-[10px] text-gray-400 ml-auto font-mono">
          Generated {new Date(protocol.generatedAt).toLocaleTimeString('en-IN')}
        </span>
      </div>

      <div className="prose prose-sm max-w-none prose-headings:text-text-primary prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-text-primary prose-code:text-medical-teal prose-code:bg-medical-teal/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
        <ReactMarkdown>{protocol.markdown}</ReactMarkdown>
      </div>

      {/* ICD codes */}
      {protocol.icdCodes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-1.5">ICD-10 Codes</p>
          <div className="flex flex-wrap gap-1.5">
            {protocol.icdCodes.map((code) => (
              <code
                key={code}
                className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-mono"
              >
                {code}
              </code>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button className="btn-secondary text-sm gap-1.5">
          <Edit className="w-3.5 h-3.5" />
          Edit for Local Formulary
        </button>
        <button className="btn-primary text-sm gap-1.5">
          <Check className="w-3.5 h-3.5" />
          Approve & Save
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-gray-400 mt-3 leading-relaxed">
        ⚠️ AI-generated suggestion only. Must be reviewed by qualified medical professional
        before implementation. Follow DPDP Act 2023 and ICMR guidelines.
      </p>
    </div>
  )
}
