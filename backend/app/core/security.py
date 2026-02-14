# ──────────────────────────────────────────────
# Security & Compliance Module
# DermaScope AI – Healthcare Data Protection
# ──────────────────────────────────────────────

# NOTE: Hackathon prototype. For India production:
# 1. Comply with DPDP Act 2023, Health Data Management Policy
# 2. Implement Data Fiduciary agreements with state governments
# 3. Use KMS for encryption at rest (AWS India region)
# 4. Get CDSCO approval for diagnostic features
# 5. IRB approval from ICMR for research
# 6. Ayushman Bharat integration requires NHA certification

from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import time
import logging

logger = logging.getLogger("dermascope.security")


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses."""

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)

        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(self), geolocation=(self)"

        # Performance logging
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(round(process_time * 1000, 2))

        logger.info(
            f"{request.method} {request.url.path} - {response.status_code} - {process_time:.3f}s"
        )

        return response


def validate_patient_consent(patient_id: str) -> bool:
    """
    Validate that patient has given consent for data processing.
    TODO: Implement proper consent management per DPDP Act 2023
    - Informed consent in patient's preferred language
    - Right to withdraw consent
    - Data retention policies
    """
    # Hackathon: always return True
    # Production: check consent database
    return True


def anonymize_patient_data(data: dict) -> dict:
    """
    Remove PII from patient data before federated learning.
    TODO: Implement k-anonymity or differential privacy
    """
    sensitive_fields = ["name", "phone", "aadhaar", "address"]
    return {k: v for k, v in data.items() if k not in sensitive_fields}
