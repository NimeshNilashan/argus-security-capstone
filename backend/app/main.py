from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import file_integrity, log_analyzer, osint, port_scanner

app = FastAPI(
    title=settings.PROJECT_NAME,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(osint.router, prefix="/osint", tags=["OSINT Recon"])
app.include_router(port_scanner.router, prefix="/port-scanner", tags=["Port Scanner"])
app.include_router(log_analyzer.router, prefix="/log-analyzer", tags=["Log Analyzer"])
app.include_router(file_integrity.router, prefix="/file-integrity", tags=["File Integrity"])


@app.get("/health")
def health_check():
    return {"status": "ok", "service": settings.PROJECT_NAME}