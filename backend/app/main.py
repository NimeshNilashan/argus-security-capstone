from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    dashboard,
    osint,
    port_scanner,
    log_analyzer,
    file_integrity,
)

app = FastAPI(
    title="Security Operations Toolkit API",
    version="1.0.0",
    description="Unified backend API for security operations and diagnostic modules.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://argus-security-capstone.vercel.app/osint"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(osint.router)
app.include_router(port_scanner.router)
app.include_router(log_analyzer.router)
app.include_router(file_integrity.router)

@app.get("/")
async def root():
    return {"status": "ONLINE", "message": "Security Operations API Core operational."}