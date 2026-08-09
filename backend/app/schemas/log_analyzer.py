from pydantic import BaseModel, Field


class LogAnalyzeRequest(BaseModel):
    log_text: str = Field(..., description="Raw HTTP server log lines to analyze")


class LogAnalyzeResponse(BaseModel):
    total_lines_analyzed: int
    total_attacks_detected: int
    findings: dict[str, list[str]]