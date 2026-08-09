import socket
from concurrent.futures import ThreadPoolExecutor
from typing import Optional
from fastapi import APIRouter, HTTPException
from app.schemas.port_scanner import PortScanRequest, PortScanResponse, PortDetail

router = APIRouter(prefix="/port-scanner", tags=["Port Scanner"])

def scan_port(target_ip: str, port: int) -> Optional[PortDetail]:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(0.5)
    try:
        result = sock.connect_ex((target_ip, port))
        if result == 0:
            try:
                service = socket.getservbyport(port, "tcp")
            except (OSError, socket.error):
                service = "Unknown"
            return PortDetail(port=port, service=service, status="OPEN")
    except Exception:
        pass
    finally:
        sock.close()
    return None

@router.post("/scan", response_model=PortScanResponse)
def execute_port_scan(payload: PortScanRequest):
    try:
        target_ip = socket.gethostbyname(payload.target)
    except socket.gaierror:
        raise HTTPException(status_code=400, detail="Invalid target host or IP address.")

    max_port = max(1, min(payload.max_port, 65535))
    open_ports = []

    with ThreadPoolExecutor(max_workers=50) as executor:
        futures = [
            executor.submit(scan_port, target_ip, p)
            for p in range(1, max_port + 1)
        ]
        for future in futures:
            result = future.result()
            if result is not None:
                open_ports.append(result)

    return PortScanResponse(target=payload.target, open_ports=open_ports)