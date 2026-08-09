import hashlib
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.schemas.file_integrity import (
    GenerateHashResponse,
    VerifyHashResponse,
    FileCompareResponse,
)

router = APIRouter(prefix="/file-integrity", tags=["File Integrity"])

@router.post("/generate-hash", response_model=GenerateHashResponse)
async def generate_file_hash(file: UploadFile = File(...)):
    try:
        content = await file.read()
        sha256_hash = hashlib.sha256(content).hexdigest().lower()

        return GenerateHashResponse(
            filename=file.filename or "unknown",
            file_size_bytes=len(content),
            sha256=sha256_hash,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-hash", response_model=VerifyHashResponse)
async def verify_hash_against_file(
    expected_hash: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        content = await file.read()
        sha256_hash = hashlib.sha256(content).hexdigest().lower()
        clean_expected = expected_hash.strip().lower()

        is_match = (sha256_hash == clean_expected)

        return VerifyHashResponse(
            filename=file.filename or "unknown",
            file_size_bytes=len(content),
            sha256=sha256_hash,
            expected_hash=clean_expected,
            is_match=is_match,
            status="MATCH" if is_match else "MISMATCH"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/compare-files", response_model=FileCompareResponse)
async def compare_two_files(
    file_a: UploadFile = File(...),
    file_b: UploadFile = File(...)
):
    try:
        content_a = await file_a.read()
        content_b = await file_b.read()

        sha256_a = hashlib.sha256(content_a).hexdigest().lower()
        sha256_b = hashlib.sha256(content_b).hexdigest().lower()

        is_match = (sha256_a == sha256_b)

        return FileCompareResponse(
            file_a={"name": file_a.filename or "file_a", "size": len(content_a), "sha256": sha256_a},
            file_b={"name": file_b.filename or "file_b", "size": len(content_b), "sha256": sha256_b},
            is_match=is_match,
            status="MATCH" if is_match else "MISMATCH"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))