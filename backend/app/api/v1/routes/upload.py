from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import base64
import time

router = APIRouter()


class UploadResponse(BaseModel):
    success: bool
    image_id: str
    message: str
    timestamp: str


@router.post("/upload", response_model=UploadResponse)
async def upload_wound_image(file: UploadFile = File(...)):
    """
    Upload a wound image for analysis.
    Accepts JPEG/PNG, max 10MB.
    In production: stores to Cloudflare R2.
    """
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, and WebP images are accepted")

    # Validate file size (10MB max)
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image must be under 10MB")

    # Generate image ID
    image_id = f"img-{int(time.time())}-{file.filename or 'upload'}"

    # TODO: In production, upload to Cloudflare R2
    # For hackathon, we just acknowledge receipt
    encoded = base64.b64encode(contents).decode("ascii")[:50]  # Just for logging

    return UploadResponse(
        success=True,
        image_id=image_id,
        message=f"Image received ({len(contents)} bytes)",
        timestamp=time.strftime("%Y-%m-%dT%H:%M:%S+05:30"),
    )
