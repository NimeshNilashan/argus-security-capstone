from fastapi import APIRouter, HTTPException
from app.modules.osint_engine import run_osint_recon
from app.schemas.osint import OSINTRequest, OSINTResponse

router = APIRouter()


@router.post("/recon", response_model=OSINTResponse)
def execute_osint_recon(payload: OSINTRequest):
    try:
        results = run_osint_recon(payload.domain)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OSINT execution failed: {str(e)}")