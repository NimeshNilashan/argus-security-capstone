from typing import Dict, List, Optional, Any
from pydantic import BaseModel

class OsintRequest(BaseModel):
    domain: str

class OsintResponse(BaseModel):
    target: str
    whois: Optional[Dict[str, Any]] = None
    dns: Optional[Dict[str, Any]] = None
    reputation: Optional[Dict[str, Any]] = None