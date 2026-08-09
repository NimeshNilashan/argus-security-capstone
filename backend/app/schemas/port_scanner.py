from typing import List, Optional
from pydantic import BaseModel

class PortScanRequest(BaseModel):
    target: str
    max_port: int = 1024

class PortDetail(BaseModel):
    port: int
    service: Optional[str] = "Unknown"
    status: Optional[str] = "OPEN"
    error: Optional[str] = None

class PortScanResponse(BaseModel):
    target: str
    open_ports: List[PortDetail]