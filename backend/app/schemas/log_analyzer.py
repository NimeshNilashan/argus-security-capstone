from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class LogAnalysisRequest(BaseModel):
    log_text: str

class LogEntry(BaseModel):
    ip: Optional[str] = None
    timestamp: Optional[str] = None
    method: Optional[str] = None
    endpoint: Optional[str] = None
    status_code: Optional[int] = None
    raw: str
    is_suspicious: bool = False
    flag_reason: Optional[str] = None

class LogAnalysisResponse(BaseModel):
    total_entries: int
    suspicious_count: int
    ip_summary: Dict[str, int]
    entries: List[LogEntry]