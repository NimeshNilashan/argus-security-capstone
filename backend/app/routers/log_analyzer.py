import re
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.log_analyzer import LogAnalysisRequest, LogAnalysisResponse, LogEntry

router = APIRouter(prefix="/log-analyzer", tags=["Log Analyzer"])

LOG_PATTERN = re.compile(
    r'(?P<ip>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s+-\s+-\s+\[(?P<timestamp>[^\]]+)\]\s+"(?P<method>GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+(?P<endpoint>\S+)\s+HTTP/[0-9\.]+"\s+(?P<status>\d{3})'
)

SUSPICIOUS_PATTERNS = [
    (r"(\%27|\'|\-\-|\bUNION\b|\bSELECT\b)", "Possible SQL Injection"),
    (r"(<script|javascript:|alert\()", "Possible Cross-Site Scripting (XSS)"),
    (r"(\.\./|\.\.\\)", "Path Traversal Attempt"),
    (r"(etc/passwd|cmd\.exe|powershell)", "Sensitive File / Command Access"),
]


def analyze_lines(lines: List[str]) -> LogAnalysisResponse:
    entries = []
    ip_summary = {}
    suspicious_count = 0

    for line in lines:
        line = line.strip()
        if not line:
            continue

        match = LOG_PATTERN.search(line)
        is_suspicious = False
        flag_reason = None

        for pattern, reason in SUSPICIOUS_PATTERNS:
            if re.search(pattern, line, re.IGNORECASE):
                is_suspicious = True
                flag_reason = reason
                break

        if match:
            data = match.groupdict()
            ip = data["ip"]
            status = int(data["status"])

            if status in [401, 403, 500] and not is_suspicious:
                is_suspicious = True
                flag_reason = f"HTTP {status} Anomaly"

            ip_summary[ip] = ip_summary.get(ip, 0) + 1

            entries.append(
                LogEntry(
                    ip=ip,
                    timestamp=data["timestamp"],
                    method=data["method"],
                    endpoint=data["endpoint"],
                    status_code=status,
                    raw=line,
                    is_suspicious=is_suspicious,
                    flag_reason=flag_reason,
                )
            )
        else:
            entries.append(
                LogEntry(
                    raw=line,
                    is_suspicious=is_suspicious,
                    flag_reason=flag_reason,
                )
            )

        if is_suspicious:
            suspicious_count += 1

    return LogAnalysisResponse(
        total_entries=len(entries),
        suspicious_count=suspicious_count,
        ip_summary=ip_summary,
        entries=entries,
    )


@router.post("/analyze", response_model=LogAnalysisResponse)
def analyze_log_text(payload: LogAnalysisRequest):
    lines = payload.log_text.splitlines()
    return analyze_lines(lines)


@router.post("/upload", response_model=LogAnalysisResponse)
async def analyze_log_file(file: UploadFile = File(...)):
    content = await file.read()
    try:
        text = content.decode("utf-8")
    except UnicodeDecodeError:
        text = content.decode("latin-1")
    lines = text.splitlines()
    return analyze_lines(lines)