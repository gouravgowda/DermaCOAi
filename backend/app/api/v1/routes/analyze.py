from fastapi import APIRouter
from pydantic import BaseModel
import time
import random

router = APIRouter()


class AnalysisRequest(BaseModel):
    image_id: str
    patient_id: str | None = None


class WoundMeasurements(BaseModel):
    length_cm: float
    width_cm: float
    depth_mm: float
    area_cm2: float
    perimeter_cm: float


class RiskAssessment(BaseModel):
    overall_risk: str
    infection_risk: float
    healing_velocity: float
    malignancy_risk: float
    amputation_risk: float


class TissueComposition(BaseModel):
    granulation: float
    slough: float
    necrotic: float
    epithelial: float
    hypergranulation: float


class AnalysisResponse(BaseModel):
    success: bool
    analysis_id: str
    wound_type: str
    measurements: WoundMeasurements
    risk_assessment: RiskAssessment
    tissue_composition: TissueComposition
    timestamp: str


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_wound(request: AnalysisRequest):
    """
    Run wound analysis on an uploaded image.
    In production: runs SAM segmentation + ZoE-Depth + classification models.
    Hackathon: returns realistic mock data.
    """
    # Simulate ML inference delay
    import asyncio
    await asyncio.sleep(1.5)

    # Mock analysis results – realistic for diabetic ulcer
    return AnalysisResponse(
        success=True,
        analysis_id=f"analysis-{int(time.time())}",
        wound_type="diabetic_ulcer",
        measurements=WoundMeasurements(
            length_cm=round(random.uniform(2.0, 5.0), 1),
            width_cm=round(random.uniform(1.5, 4.0), 1),
            depth_mm=round(random.uniform(2.0, 8.0), 1),
            area_cm2=round(random.uniform(4.0, 15.0), 2),
            perimeter_cm=round(random.uniform(8.0, 18.0), 1),
        ),
        risk_assessment=RiskAssessment(
            overall_risk="high",
            infection_risk=round(random.uniform(0.3, 0.7), 2),
            healing_velocity=round(random.uniform(0.5, 1.5), 1),
            malignancy_risk=round(random.uniform(0.01, 0.05), 2),
            amputation_risk=round(random.uniform(0.05, 0.25), 2),
        ),
        tissue_composition=TissueComposition(
            granulation=45.0,
            slough=30.0,
            necrotic=10.0,
            epithelial=10.0,
            hypergranulation=5.0,
        ),
        timestamp=time.strftime("%Y-%m-%dT%H:%M:%S+05:30"),
    )
