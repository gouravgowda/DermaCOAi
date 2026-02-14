import { create } from 'zustand'
import type { AnalysisResult, TreatmentProtocol } from '@/types'
import { mockAnalysisResult, mockTreatmentProtocol } from '@/assets/mock-data/mock-patients'

// ──────────────────────────────────────────────
// Analysis Store – manages current wound analysis state
// ──────────────────────────────────────────────

interface AnalysisState {
  currentAnalysis: AnalysisResult | null
  isAnalyzing: boolean
  error: string | null

  setAnalysis: (analysis: AnalysisResult) => void
  startAnalysis: (imageUrl: string) => Promise<void>
  clearAnalysis: () => void
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  currentAnalysis: null,
  isAnalyzing: false,
  error: null,

  setAnalysis: (analysis) => set({ currentAnalysis: analysis, error: null }),

  // Simulates ML analysis pipeline – in production this calls the backend
  startAnalysis: async (imageUrl: string) => {
    set({ isAnalyzing: true, error: null })

    try {
      // Simulate network/inference delay (1-2s)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Use mock result with the provided image URL
      const result: AnalysisResult = {
        ...mockAnalysisResult,
        imageUrl,
        timestamp: new Date().toISOString(),
      }

      set({ currentAnalysis: result, isAnalyzing: false })
    } catch {
      set({ error: 'Analysis failed – retrying with fallback model', isAnalyzing: false })
    }
  },

  clearAnalysis: () => set({ currentAnalysis: null, error: null }),
}))

// ──────────────────────────────────────────────
// Protocol Store – manages treatment protocol generation
// ──────────────────────────────────────────────

interface ProtocolState {
  protocol: TreatmentProtocol | null
  loading: boolean
  error: string | null

  generate: (analysisId: string) => Promise<void>
  clearProtocol: () => void
}

export const useProtocolStore = create<ProtocolState>((set) => ({
  protocol: null,
  loading: false,
  error: null,

  generate: async (analysisId: string) => {
    set({ loading: true, error: null })

    try {
      // Simulate LLM generation (2-3s)
      await new Promise((resolve) => setTimeout(resolve, 2500))

      const protocol: TreatmentProtocol = {
        id: `proto-${Date.now()}`,
        analysisId,
        markdown: mockTreatmentProtocol,
        dressingType: 'Hydrocolloid',
        debridementNeeded: true,
        antibiotics: 'Cefalexin 500mg TDS × 7 days',
        followUpDays: 3,
        referralNeeded: false,
        icdCodes: ['E11.621', 'L97.529'],
        generatedAt: new Date().toISOString(),
      }

      set({ protocol, loading: false })
    } catch {
      set({ error: 'Protocol generation failed', loading: false })
    }
  },

  clearProtocol: () => set({ protocol: null, error: null }),
}))

// ──────────────────────────────────────────────
// Capture Store – manages camera/capture state
// ──────────────────────────────────────────────

interface CaptureState {
  stream: MediaStream | null
  capturedImage: string | null
  confidence: number
  guidance: 'searching' | 'adjusting' | 'optimal'
  isAnalyzing: boolean

  setStream: (stream: MediaStream | null) => void
  setCapturedImage: (image: string | null) => void
  setConfidence: (confidence: number) => void
  setGuidance: (guidance: 'searching' | 'adjusting' | 'optimal') => void
  setIsAnalyzing: (isAnalyzing: boolean) => void
  reset: () => void
}

export const useCaptureStore = create<CaptureState>((set) => ({
  stream: null,
  capturedImage: null,
  confidence: 0,
  guidance: 'searching',
  isAnalyzing: false,

  setStream: (stream) => set({ stream }),
  setCapturedImage: (capturedImage) => set({ capturedImage }),
  setConfidence: (confidence) => set({ confidence }),
  setGuidance: (guidance) => set({ guidance }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  reset: () =>
    set({
      stream: null,
      capturedImage: null,
      confidence: 0,
      guidance: 'searching',
      isAnalyzing: false,
    }),
}))
