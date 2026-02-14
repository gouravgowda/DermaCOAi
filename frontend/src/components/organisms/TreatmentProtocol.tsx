import ReactMarkdown from 'react-markdown'
import { useProtocolStore } from '@/lib/stores'
import { ProtocolSkeleton } from '@/components/atoms/Skeleton'
import { FileText, Edit, Check, AlertCircle } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// TreatmentProtocol.tsx — AI-generated treatment plan
//
// Was using GPT-4 to generate these, switched to Claude 3.5 Sonnet
// because it was 3x faster and actually followed the ICMR format better.
// Then switched again to local Gemma 2B for offline PHCs.
//
// TODO: The "Edit for Local Formulary" button doesn't work yet.
//   Dr. Leena wants ASHA workers to be able to swap out unavailable
//   medicines (e.g., replace Cefalexin with Amoxicillin if the PHC
//   doesn't stock it). Need a dropdown per medicine line.
// ─────────────────────────────────────────────────────────────────────────────

export function TreatmentProtocol() {
  const { protocol, loading, error, generate } = useProtocolStore()

  if (error) {
    return (
      <div className="bg-red-50 rounded-[10px] border-l-4 border-risk-high p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-risk-high flex-shrink-0 mt-[3px]" />
        <div>
          <p className="text-sm font-medium text-risk-high">{error}</p>
          <button
            onClick={() => generate('retry')}
            className="text-sm text-accent-teal-500 mt-2 hover:underline"
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
        <FileText className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
        <p className="text-sm text-neutral-500">
          Treatment protocol will be generated after analysis
        </p>
      </div>
    )
  }

  return (
    <div className="card border-l-4 border-accent-teal-500">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-accent-teal-500" />
        <h3 className="text-sm font-semibold text-neutral-800">Treatment Protocol</h3>
        <span className="text-[10px] text-neutral-400 ml-auto font-mono">
          Generated {new Date(protocol.generatedAt).toLocaleTimeString('en-IN')}
        </span>
      </div>

      <div className="prose prose-sm max-w-none prose-headings:text-neutral-800 prose-p:text-neutral-600 prose-li:text-neutral-600 prose-strong:text-neutral-800 prose-code:text-accent-teal-600 prose-code:bg-accent-teal-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
        <ReactMarkdown>{protocol.markdown}</ReactMarkdown>
      </div>

      {/* ICD codes */}
      {protocol.icdCodes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-neutral-200">
          <p className="text-xs text-neutral-400 mb-1.5">ICD-10 Codes</p>
          <div className="flex flex-wrap gap-1.5">
            {protocol.icdCodes.map((code) => (
              <code
                key={code}
                className="text-xs px-2 py-0.5 rounded-[6px] bg-neutral-100 text-neutral-600 font-mono border border-neutral-200"
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
          {/* FIXME: This button does nothing right now. See TODO above. */}
        </button>
        <button className="btn-primary text-sm gap-1.5">
          <Check className="w-3.5 h-3.5" />
          Approve & Save
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-neutral-400 mt-3 leading-relaxed">
        ⚠️ AI-generated suggestion only. Must be reviewed by qualified medical professional
        before implementation. Follow DPDP Act 2023 and ICMR guidelines.
      </p>
    </div>
  )
}
