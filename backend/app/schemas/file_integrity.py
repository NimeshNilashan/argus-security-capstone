from pydantic import BaseModel, Field


class FileIntegrityRequest(BaseModel):
    baseline_hash: str = Field(..., min_length=64, max_length=64, description="Expected SHA-256 baseline hash")


class FileIntegrityResponse(BaseModel):
    computed_hash: str
    baseline_hash: str
    is_intact: bool
    status: str