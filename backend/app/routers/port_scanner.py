from fastapi import APIRouter, HTTPException
from app.modules.scanner_engine import run_port_scan
from app.schemas.port_scanner import PortScanRequest, PortScanResponse

router = APIRouter()


@router.post("/scan", response_model=PortScanResponse)
def execute_port_scan(payload: PortScanRequest):
    try:
        results = run_port_scan(target=payload.target, max_port=payload.max_port)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Port scan failed: {str(e)}")