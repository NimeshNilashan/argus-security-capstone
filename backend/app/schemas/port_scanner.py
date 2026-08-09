from pydantic import BaseModel, Field


class PortScanRequest(BaseModel):
    target: str = Field(..., example="127.0.0.1", description="Target IP or hostname to scan")
    max_port: int = Field(default=100, ge=1, le=1024, description="Highest port number to scan (1 to 1024)")


class OpenPortResult(BaseModel):
    port: int
    status: str
    service: str
    banner: str | None = None
    error: str | None = None


class PortScanResponse(BaseModel):
    target: str
    total_ports_scanned: int
    open_ports_count: int
    open_ports: list[OpenPortResult]
    duration_seconds: float