from fastapi import APIRouter
from pydantic import BaseModel
import time

router = APIRouter()


class TreatmentRequest(BaseModel):
    analysis_id: str
    patient_age: int = 58
    patient_gender: str = "female"
    patient_location: str = "Mehsana, Gujarat"


class TreatmentResponse(BaseModel):
    success: bool
    protocol_id: str
    markdown: str
    dressing_type: str
    debridement_needed: bool
    antibiotics: str | None
    follow_up_days: int
    referral_needed: bool
    icd_codes: list[str]
    timestamp: str


MOCK_PROTOCOL = """## Recommended Treatment Protocol

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

### 4. Follow-up
- Day 3: Photo + dressing change
- Day 7: Wound measurement
- Day 14: Healing assessment

### 5. Referral Indicators
⚠️ Refer to district hospital agar:
- Wound area badh rahi ho
- Fever >101°F
- 14 din mein improvement na ho

### ICD-10: `E11.621`, `L97.529`
"""


@router.post("/treatment", response_model=TreatmentResponse)
async def generate_treatment(request: TreatmentRequest):
    """
    Generate treatment protocol based on analysis.
    In production: calls LLM API with wound context.
    Hackathon: returns Hinglish mock protocol.
    """
    import asyncio
    await asyncio.sleep(2.0)  # Simulate LLM generation time

    return TreatmentResponse(
        success=True,
        protocol_id=f"proto-{int(time.time())}",
        markdown=MOCK_PROTOCOL,
        dressing_type="Hydrocolloid",
        debridement_needed=True,
        antibiotics="Cefalexin 500mg TDS × 7 days",
        follow_up_days=3,
        referral_needed=False,
        icd_codes=["E11.621", "L97.529"],
        timestamp=time.strftime("%Y-%m-%dT%H:%M:%S+05:30"),
    )
