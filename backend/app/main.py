from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from app.routers import osint, port_scanner, log_analyzer, file_integrity

app = FastAPI(title="Argus Security Platform API", version="2.0")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Router Modules
app.include_router(osint.router)
app.include_router(port_scanner.router)
app.include_router(log_analyzer.router)
app.include_router(file_integrity.router)

@app.get("/")
def root():
    return {"status": "online", "system": "Argus Security Platform API v2.0"}