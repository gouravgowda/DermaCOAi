// ──────────────────────────────────────────────
// DermaScope AI – Core Type Definitions
// Why: Single source of truth for all data shapes
// ──────────────────────────────────────────────

export interface Patient {
  id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  location: string
  story: string
  images: WoundImage[]
  treatment: string
  outcome: string
  createdAt: string
}

export interface WoundImage {
  day: number
  url: string
  infection?: number
  melanomaRisk?: number
  measurements?: WoundMeasurements
  timestamp?: string
}

export interface WoundMeasurements {
  lengthCm: number
  widthCm: number
  depthMm: number
  areaCm2: number
  perimeterCm: number
}

export interface AnalysisResult {
  id: string
  patientId: string
  imageUrl: string
  timestamp: string
  woundType: WoundType
  measurements: WoundMeasurements
  riskAssessment: RiskAssessment
  tissueComposition: TissueComposition
  depthData: number[] | null
  segmentationMask: string | null // base64 encoded mask
}

export type WoundType =
  | 'diabetic_ulcer'
  | 'pressure_injury'
  | 'venous_ulcer'
  | 'surgical_wound'
  | 'burn'
  | 'laceration'
  | 'melanoma_suspect'
  | 'unknown'

export interface RiskAssessment {
  overallRisk: RiskLevel
  infectionRisk: number // 0-1 probability
  healingVelocity: number // cm²/week
  malignancyRisk: number // 0-1 probability
  amputationRisk: number // 0-1 probability
  factors: RiskFactor[]
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface RiskFactor {
  name: string
  severity: RiskLevel
  description: string
  recommendation: string
}

export interface TissueComposition {
  granulation: number // percentage
  slough: number
  necrotic: number
  epithelial: number
  hypergranulation: number
}

export interface TreatmentProtocol {
  id: string
  analysisId: string
  markdown: string
  dressingType: string
  debridementNeeded: boolean
  antibiotics: string | null
  followUpDays: number
  referralNeeded: boolean
  icdCodes: string[]
  generatedAt: string
}

export interface PatientContext {
  age: number
  gender: string
  location: string
  comorbidities: string[]
  currentMedications: string[]
  allergies: string[]
}

export interface FederatedNode {
  id: string
  name: string
  state: string
  lat: number
  lng: number
  patients: number
  lastSync: string
  status: 'active' | 'syncing' | 'offline'
}

export interface FederatedMetrics {
  modelVersion: number
  globalAccuracy: number
  totalPatients: number
  activeNodes: number
  lastRoundTime: string
}

// Camera/capture states
export type CaptureGuidance = 'searching' | 'adjusting' | 'optimal'

export interface CaptureState {
  stream: MediaStream | null
  capturedImage: string | null
  confidence: number
  guidance: CaptureGuidance
  isAnalyzing: boolean
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: string | null
  timestamp: string
}
