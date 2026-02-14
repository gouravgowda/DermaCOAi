// ──────────────────────────────────────────────
// Mock patient data – real Indian stories
// Why: Realistic demo data for hackathon judges
// ──────────────────────────────────────────────

import type { Patient, FederatedNode } from '@/types'

export const mockPatients: Patient[] = [
  {
    id: 'IN-PHC-2026-001',
    name: 'Lakshmi Ben Patel',
    age: 58,
    gender: 'female',
    location: 'Mehsana, Gujarat',
    story:
      'Diabetic for 12 years, foot ulcer appeared 3 weeks ago. Nearest dermatologist is 150km away. ASHA worker captured images using DermaScope.',
    images: [
      { day: 0, url: '/mock/lakshmi-day0.jpg', infection: 0.23 },
      { day: 3, url: '/mock/lakshmi-day3.jpg', infection: 0.41 },
      { day: 7, url: '/mock/lakshmi-day7.jpg', infection: 0.19 },
    ],
    treatment: 'Hydrocolloid dressing + Cefalexin 500mg TDS',
    outcome: 'Amputation avoided, wound healed in 21 days',
    createdAt: '2026-01-15T09:30:00+05:30',
  },
  {
    id: 'IN-PHC-2026-002',
    name: 'Rajesh Kumar',
    age: 34,
    gender: 'male',
    location: 'Azamgarh, Uttar Pradesh',
    story:
      'Mole misdiagnosed as fungal infection by local doctor. DermaScope AI flagged melanoma risk at 87%.',
    images: [{ day: 0, url: '/mock/rajesh-day0.jpg', melanomaRisk: 0.87 }],
    treatment: 'Urgent referral to AIIMS Delhi – dermatoscopy + biopsy',
    outcome: 'Early-stage melanoma removed surgically. Cancer-free at 6 months.',
    createdAt: '2026-01-22T14:15:00+05:30',
  },
  {
    id: 'IN-PHC-2026-003',
    name: 'Meera Devi',
    age: 72,
    gender: 'female',
    location: 'Jaisalmer, Rajasthan',
    story:
      'Pressure injury on sacrum from prolonged bed rest after hip fracture. Daughter used DermaScope to track healing progress remotely.',
    images: [
      { day: 0, url: '/mock/meera-day0.jpg', infection: 0.12 },
      { day: 5, url: '/mock/meera-day5.jpg', infection: 0.08 },
      { day: 14, url: '/mock/meera-day14.jpg', infection: 0.04 },
    ],
    treatment: 'Foam dressing, repositioning every 2hrs, nutritional supplementation',
    outcome: 'Stage II pressure injury healed completely in 28 days',
    createdAt: '2026-02-01T11:00:00+05:30',
  },
  {
    id: 'IN-PHC-2026-004',
    name: 'Arjun Singh',
    age: 45,
    gender: 'male',
    location: 'Varanasi, Uttar Pradesh',
    story:
      'Burns from cooking accident at dhaba. PHC nurse used DermaScope for daily monitoring and tele-consultation with burn specialist at BHU.',
    images: [
      { day: 0, url: '/mock/arjun-day0.jpg', infection: 0.35 },
      { day: 7, url: '/mock/arjun-day7.jpg', infection: 0.28 },
    ],
    treatment: 'Silver sulfadiazine cream + Paraffin gauze dressing',
    outcome: 'Healing on track, no surgical intervention needed',
    createdAt: '2026-02-05T08:45:00+05:30',
  },
  {
    id: 'IN-PHC-2026-005',
    name: 'Ananya Sharma',
    age: 28,
    gender: 'female',
    location: 'Shimla, Himachal Pradesh',
    story:
      'Post-surgical wound not healing after cesarean section. Rural ASHA worker captured wound images for remote specialist review.',
    images: [
      { day: 0, url: '/mock/ananya-day0.jpg', infection: 0.55 },
      { day: 3, url: '/mock/ananya-day3.jpg', infection: 0.62 },
      { day: 7, url: '/mock/ananya-day7.jpg', infection: 0.31 },
    ],
    treatment: 'Wound debridement + Amoxicillin-Clavulanate + Povidone-iodine dressing',
    outcome: 'Infection cleared in 5 days, wound closed by secondary intention',
    createdAt: '2026-02-08T16:20:00+05:30',
  },
]

// Mock analysis result for demo
export const mockAnalysisResult = {
  id: 'analysis-001',
  patientId: 'IN-PHC-2026-001',
  imageUrl: '/mock/lakshmi-day0.jpg',
  timestamp: '2026-01-15T09:35:00+05:30',
  woundType: 'diabetic_ulcer' as const,
  measurements: {
    lengthCm: 3.2,
    widthCm: 2.8,
    depthMm: 4.5,
    areaCm2: 7.04,
    perimeterCm: 10.2,
  },
  riskAssessment: {
    overallRisk: 'high' as const,
    infectionRisk: 0.41,
    healingVelocity: 0.8,
    malignancyRisk: 0.02,
    amputationRisk: 0.15,
    factors: [
      {
        name: 'Diabetic neuropathy',
        severity: 'high' as const,
        description: 'Peripheral neuropathy reduces sensation, increasing injury risk',
        recommendation: 'Daily foot inspection, proper footwear, glycemic control',
      },
      {
        name: 'Delayed healing',
        severity: 'medium' as const,
        description: 'Healing velocity below expected rate for wound size',
        recommendation: 'Consider negative pressure wound therapy if no improvement in 2 weeks',
      },
      {
        name: 'Bacterial colonization',
        severity: 'high' as const,
        description: 'Elevated infection markers detected in tissue analysis',
        recommendation: 'Start empirical antibiotics per NLEM 2023 guidelines',
      },
    ],
  },
  tissueComposition: {
    granulation: 45,
    slough: 30,
    necrotic: 10,
    epithelial: 10,
    hypergranulation: 5,
  },
  depthData: null,
  segmentationMask: null,
}

// Mock treatment protocol
export const mockTreatmentProtocol = `## Recommended Treatment Protocol

### 1. Dressing (PHC mein available)
- **Primary:** Hydrocolloid dressing (DuoDERM ya equivalent)
- **Alternative:** Honey-based dressing agar hydrocolloid na mile
- Change karo every 3 din mein ya jab soaked ho jaye

### 2. Debridement
- **Haan, zaroorat hai** – Sharp debridement for slough tissue
- Local anaesthesia lagao (Lignocaine 2%)
- PHC nurse se karwao, sterile technique zaroori

### 3. Antibiotics (NLEM 2023 ke hisab se)
- **Tab Cefalexin 500mg** – TDS × 7 days
- Agar allergy ho to **Tab Doxycycline 100mg** BD × 7 days
- Metronidazole add karo agar anaerobic infection ka shak ho

### 4. Follow-up Schedule
- **Day 3:** Photo le DermaScope se, dressing change
- **Day 7:** Wound measurement, assess granulation
- **Day 14:** Healing assessment, modify protocol if needed
- **Day 21:** Expected closure for uncomplicated cases

### 5. District Hospital Referral Indicators
⚠️ Turant refer karo agar:
- Wound area 25% se zyada badhne lage
- Fever >101°F aaye
- Cellulitis (laal soojan) wound se 2cm bahar tak faile
- HbA1c >10% ho – glycemic control zaroori
- 14 din mein koi improvement na dikhne

### ICD-10 Codes
\`E11.621\` – Type 2 DM with foot ulcer
\`L97.529\` – Non-pressure chronic ulcer of unspecified foot
`

// Generate mock PHC nodes across India for federated learning map
export function generateMockPhcs(): FederatedNode[] {
  const states = [
    { name: 'Gujarat', lat: 22.3, lng: 72.6, count: 65 },
    { name: 'Rajasthan', lat: 27.0, lng: 74.2, count: 80 },
    { name: 'Uttar Pradesh', lat: 26.8, lng: 80.9, count: 95 },
    { name: 'Maharashtra', lat: 19.7, lng: 75.7, count: 70 },
    { name: 'Madhya Pradesh', lat: 23.5, lng: 78.5, count: 55 },
    { name: 'Tamil Nadu', lat: 11.1, lng: 78.6, count: 45 },
    { name: 'Karnataka', lat: 15.3, lng: 75.7, count: 40 },
    { name: 'West Bengal', lat: 22.9, lng: 87.8, count: 35 },
    { name: 'Bihar', lat: 25.6, lng: 85.1, count: 30 },
  ]

  const nodes: FederatedNode[] = []
  let id = 0

  for (const state of states) {
    for (let i = 0; i < state.count; i++) {
      id++
      // Spread PHCs within each state with some randomness
      const jitterLat = (Math.random() - 0.5) * 4
      const jitterLng = (Math.random() - 0.5) * 4
      nodes.push({
        id: `PHC-${String(id).padStart(4, '0')}`,
        name: `${state.name} PHC ${i + 1}`,
        state: state.name,
        lat: state.lat + jitterLat,
        lng: state.lng + jitterLng,
        patients: Math.floor(Math.random() * 50) + 5,
        lastSync: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        status: Math.random() > 0.15 ? 'active' : Math.random() > 0.5 ? 'syncing' : 'offline',
      })
    }
  }

  return nodes
}
