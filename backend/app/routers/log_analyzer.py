from fastapi import APIRouter, File, HTTPException, UploadFile
from app.modules.log_engine import analyze_log_content
from app.schemas.log_analyzer import LogAnalyzeRequest, LogAnalyzeResponse

router = APIRouter()


@router.post("/analyze", response_model=LogAnalyzeResponse)
def analyze_log_text(payload: LogAnalyzeRequest):
    try:
        return analyze_log_content(payload.log_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Log analysis failed: {str(e)}")


@router.post("/upload", response_model=LogAnalyzeResponse)
async def analyze_log_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        log_text = contents.decode("utf-8", errors="ignore")
        return analyze_log_content(log_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File processing failed: {str(e)}")