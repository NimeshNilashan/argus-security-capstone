from pydantic import BaseModel

class GenerateHashResponse(BaseModel):
    filename: str
    file_size_bytes: int
    sha256: str

class VerifyHashResponse(BaseModel):
    filename: str
    file_size_bytes: int
    sha256: str
    expected_hash: str
    is_match: bool
    status: str

class FileDetail(BaseModel):
    name: str
    size: int
    sha256: str

class FileCompareResponse(BaseModel):
    file_a: FileDetail
    file_b: FileDetail
    is_match: bool
    status: str