from fastapi import APIRouter
from app.schemas.dashboard import SystemOverviewResponse, ModuleStatus

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/status", response_model=SystemOverviewResponse)
async def get_dashboard_status():
    modules = [
        ModuleStatus(name="OSINT Recon", endpoint="/osint/recon", status="ONLINE"),
        ModuleStatus(name="Port Scanner", endpoint="/port-scanner/scan", status="ONLINE"),
        ModuleStatus(name="Log Analyzer", endpoint="/log-analyzer/analyze", status="ONLINE"),
        ModuleStatus(name="File Integrity", endpoint="/file-integrity/generate-hash", status="ONLINE"),
    ]
    return SystemOverviewResponse(
        status="OPERATIONAL",
        version="1.0.0",
        active_modules=len(modules),
        modules=modules
    )