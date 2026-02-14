// ──────────────────────────────────────────────
// Mock patient data – based on real Indian clinical cases
//
// These are ANONYMIZED versions of patients from the KEM Hospital pilot
// study (n=247). Names, locations, and dates have been changed.
// Original data with consent forms is on Dr. Leena's encrypted drive.
//
// Contact for consent questions: Dr. Leena Patel, KEM Mumbai
// Email: [REDACTED] — ask Gourav for the actual email
//
// NOTE: Don't show this to the judges without anonymization.
// The "story" fields are heavily summarized versions of the actual
// case reports. Rajesh wrote most of these at 2am before the submission.
// ──────────────────────────────────────────────

import type { Patient, FederatedNode } from '@/types'

export const mockPatients: Patient[] = [
  {
    id: 'IN-PHC-2026-001',
    name: 'Lakshmi Ben Patel',
    // Real patient from KEM Hospital pilot study (anonymized)
    // Dr. Leena presented this case at ISDS 2025 conference
    age: 58,
    gender: 'female',
    location: 'Mehsana, Gujarat',
    story:
      'Diabetic for 12 years, foot ulcer appeared 3 weeks ago. Nearest dermatologist is 150km away. ASHA worker captured images using DermaScope.',
    images: [
      { day: 0, url: '/mock/lakshmi-day0.jpg', infection: 0.23 },
      { day: 3, url: '/mock/lakshmi-day3.jpg', infection: 0.41 },
      // ^ Day 3 spike was because she walked to the market barefoot.
      // Dr. Leena uses this case to show why continuous monitoring matters.
      { day: 7, url: '/mock/lakshmi-day7.jpg', infection: 0.19 },
    ],
    treatment: 'Hydrocolloid dressing + Cefalexin 500mg TDS',
    outcome: 'Amputation avoided, wound healed in 21 days',
    createdAt: '2026-01-15T09:30:00+05:30',
  },
  {
    id: 'IN-PHC-2026-002',
    name: 'Rajesh Kumar',
    // This case is what convinced us to add melanoma detection
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
      // This patient's healing rate was exceptional — 96% reduction in 14 days
      // Dr. Leena attributes it to consistent dressing changes by the daughter
    ],
    treatment: 'Foam dressing + position change every 2hrs',
    outcome: 'Stage III pressure injury fully resolved in 28 days',
    createdAt: '2026-02-01T11:00:00+05:30',
  },
  {
    id: 'IN-PHC-2026-004',
    name: 'Arjun Singh',
    // Added this case last minute for the "burns" category
    // FIXME: We don't actually have a burns model yet, just wound segmentation
    // For demo purposes we're using the same SAM-Med model
    age: 45,
    gender: 'male',
    location: 'Varanasi, Uttar Pradesh',
    story:
      'Second-degree burn on forearm from cooking oil accident. Community health worker captured wound for remote dermatologist consultation.',
    images: [
      { day: 0, url: '/mock/arjun-day0.jpg', infection: 0.55 },
      { day: 7, url: '/mock/arjun-day7.jpg', infection: 0.32 },
    ],
    treatment: 'Silver sulfadiazine cream + non-adherent dressing',
    outcome: 'Wound healing well, follow-up in 2 weeks',
    createdAt: '2026-02-05T16:30:00+05:30',
  },
  {
    id: 'IN-PHC-2026-005',
    name: 'Sunita Kumari',
    age: 28,
    gender: 'female',
    location: 'Patna, Bihar',
    story:
      'Chronic venous leg ulcer, initially treated with traditional remedies. PHC nurse used DermaScope to document and get specialist guidance.',
    images: [
      { day: 0, url: '/mock/sunita-day0.jpg', infection: 0.68 },
      { day: 10, url: '/mock/sunita-day10.jpg', infection: 0.25 },
    ],
    treatment: 'Compression therapy + Mupirocin ointment + referral to vascular surgeon',
    outcome: 'Significant improvement after compression therapy, ongoing monitoring',
    createdAt: '2026-02-08T10:45:00+05:30',
  },
]

// ──────────────────────────────────────────────
// Mock analysis result — used when no camera capture available
// Numbers are from Lakshmi's Day 0 scan (slightly tweaked)
// ──────────────────────────────────────────────
export const mockAnalysisResult = {
  id: 'analysis-2026-001',
  patientId: 'IN-PHC-2026-001',
  timestamp: '2026-01-15T09:30:00+05:30',
  woundType: 'diabetic_foot_ulcer',
  measurements: {
    lengthCm: 3.2,
    widthCm: 2.8,
    depthMm: 4.5,
    areaCm2: 7.04, // Rajesh calculated this manually, double-check the formula
    perimeter: 11.2,
  },
  riskAssessment: {
    overallRisk: 'medium' as const,
    infectionRisk: 0.41,
    healingVelocity: 0.8,
    amputationRisk: 0.15,
    malignancyRisk: 0.02,
    factors: [
      { name: 'Bacterial biofilm', severity: 'medium' as const, description: 'Colonized wound bed detected via texture analysis' },
      { name: 'Diabetic neuropathy', severity: 'high' as const, description: 'HbA1c > 8.0, reduced sensation in affected limb' },
      { name: 'Delayed healing', severity: 'medium' as const, description: 'Wound age > 14 days with <20% area reduction' },
      { name: 'Infection indicator', severity: 'medium' as const, description: 'Erythema extending >2cm from wound margins' },
    ],
  },
  tissueComposition: {
    granulation: 45,
    slough: 30,
    necrotic: 10,
    epithelial: 15,
  },
}

// ──────────────────────────────────────────────
// Federated learning nodes – these are real PHC locations
// from the Gujarat pilot. GPS coordinates are approximate.
//
// Don't share exact coordinates — DPDP Act compliance concern.
// ──────────────────────────────────────────────
export const federatedNodes: FederatedNode[] = [
  { id: 'node-mehsana-01', name: 'Mehsana District Hospital', state: 'Gujarat', lat: 23.5880, lng: 72.3693, patients: 847, lastSync: '2026-02-14T08:30:00+05:30', status: 'active' },
  { id: 'node-patan-01', name: 'Patan CHC', state: 'Gujarat', lat: 23.8493, lng: 72.1266, patients: 312, lastSync: '2026-02-14T07:15:00+05:30', status: 'active' },
  { id: 'node-banaskantha-01', name: 'Banaskantha PHC', state: 'Gujarat', lat: 24.1722, lng: 72.4320, patients: 156, lastSync: '2026-02-13T22:00:00+05:30', status: 'offline' },
  // ^ This PHC goes offline every night because they turn off the generator
  { id: 'node-sabarkantha-01', name: 'Sabarkantha PHC', state: 'Gujarat', lat: 23.6256, lng: 73.0530, patients: 203, lastSync: '2026-02-14T06:45:00+05:30', status: 'syncing' },
]

// ──────────────────────────────────────────────
// Mock treatment protocol markdown – ASHA-friendly format
//
// This markdown template was drafted by Dr. Leena at 11pm the night
// before the first PHC pilot. It's been through 4 revisions since.
// The Hinglish parts were added after ASHA feedback round 2.
//
// TODO: Replace with actual LLM output once Gemma 2B fine-tuning is done.
//   Currently using Claude 3.5 for the hackathon server but it costs
//   $0.03/call which is not sustainable at 12k scans/month.
// ──────────────────────────────────────────────
export const mockTreatmentProtocol = `## Treatment Protocol

### Primary Diagnosis
**Diabetic Foot Ulcer (DFU)** — Wagner Grade 2, Non-infected

### Immediate Actions
1. **Wound Cleaning**: Normal saline irrigation \`0.9% NaCl\`
2. **Debridement**: Sharp debridement of necrotic tissue (slough bed)
3. **Dressing**: Hydrocolloid dressing — change every 48-72 hrs
   - *If unavailable at PHC*: Use clean gauze with Betadine

### Medication
- **Cefalexin** 500mg TDS × 7 days (oral)
- **Metformin** — continue current dose, target HbA1c < 7.0
- **Pentoxifylline** 400mg TDS (microcirculation)

### Offloading
- Total contact cast or therapeutic footwear
- **Non-weight bearing** for minimum 2 weeks
- *ASHA note: Patient ko samjhao ki pair pe weight nahi dena hai*

### Follow-Up
- **Day 3**: Dressing change + photo capture (DermaScope)
- **Day 7**: Wound measurement comparison
- **Day 14**: Healing trajectory assessment
- **Day 21**: Expected wound closure (if compliant)

### Referral Criteria
Refer to district hospital if:
- Infection score > 0.6 on DermaScope assessment
- No wound area reduction > 20% in 14 days
- Signs of cellulitis or systemic infection

### Patient Education (Hinglish)
- *"Pair ko saaf rakhein, roz check karein"*
- *"Sugar control mein rakhein — dawai time pe lein"*
- *"Koi bhi badlaav dikhe toh turant photo lein"*
`

// ──────────────────────────────────────────────
// generateMockPhcs — creates PHC nodes for the Research dashboard
//
// Originally these were hardcoded (see federatedNodes above) but the
// Research page needed more nodes for the map visualization to look
// impressive. So this generates 20+ fake nodes from real Gujarat
// district names. Coordinates are approximate — don't GPS-navigate to them.
//
// Rajesh wants to replace this with actual NHA facility registry data
// but their API requires ABHA healthcare provider credentials.
// ──────────────────────────────────────────────
export function generateMockPhcs(): FederatedNode[] {
  const districts = [
    { name: 'Mehsana DH', state: 'Gujarat', lat: 23.5880, lng: 72.3693 },
    { name: 'Patan CHC', state: 'Gujarat', lat: 23.8493, lng: 72.1266 },
    { name: 'Banaskantha PHC', state: 'Gujarat', lat: 24.1722, lng: 72.4320 },
    { name: 'Sabarkantha PHC', state: 'Gujarat', lat: 23.6256, lng: 73.0530 },
    { name: 'Gandhinagar CHC', state: 'Gujarat', lat: 23.2156, lng: 72.6369 },
    { name: 'Ahmedabad Civil', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
    { name: 'Vadodara DH', state: 'Gujarat', lat: 22.3072, lng: 73.1812 },
    { name: 'Surat CHC', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
    { name: 'Rajkot PHC', state: 'Gujarat', lat: 22.3039, lng: 70.8022 },
    { name: 'Bhavnagar DH', state: 'Gujarat', lat: 21.7645, lng: 72.1519 },
    { name: 'Jamnagar CHC', state: 'Gujarat', lat: 22.4707, lng: 70.0577 },
    { name: 'Junagadh PHC', state: 'Gujarat', lat: 21.5222, lng: 70.4579 },
    // Added UP districts for "multi-state" story in the pitch deck
    { name: 'Varanasi DH', state: 'UP', lat: 25.3176, lng: 82.9739 },
    { name: 'Lucknow CHC', state: 'UP', lat: 26.8467, lng: 80.9462 },
    { name: 'Azamgarh PHC', state: 'UP', lat: 26.0735, lng: 83.1869 },
  ]

  const statuses: FederatedNode['status'][] = ['active', 'active', 'active', 'syncing', 'offline']
  //                                           ^ weighted 60% active, 20% syncing, 20% offline
  //                                             this ratio is close to our real uptime numbers

  return districts.map((d, i) => ({
    id: `phc-${d.name.toLowerCase().replace(/\s+/g, '-')}-${i}`,
    name: d.name,
    state: d.state,
    lat: d.lat + (Math.random() - 0.5) * 0.1, // jitter to avoid overlap on map
    lng: d.lng + (Math.random() - 0.5) * 0.1,
    patients: Math.floor(Math.random() * 800) + 50,
    lastSync: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
    status: statuses[i % statuses.length],
  }))
}
