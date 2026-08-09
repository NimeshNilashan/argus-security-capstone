from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from app.modules.integrity_engine import verify_file_integrity
from app.schemas.file_integrity import FileIntegrityResponse

router = APIRouter()


@router.post("/check", response_model=FileIntegrityResponse)
async def check_file_integrity(
    baseline_hash: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        content = await file.read()
        return verify_file_integrity(file_content=content, baseline_hash=baseline_hash)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Integrity check failed: {str(e)}")