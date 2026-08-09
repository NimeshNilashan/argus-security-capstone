import socket
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

COMMON_PORTS = {
    20: "FTP-DATA", 21: "FTP", 22: "SSH", 23: "Telnet",
    25: "SMTP", 53: "DNS", 80: "HTTP", 110: "POP3",
    143: "IMAP", 443: "HTTPS", 3306: "MySQL", 3389: "RDP",
    5432: "PostgreSQL", 5900: "VNC", 8080: "HTTP-Proxy",
}


def scan_single_port(target: str, port: int) -> dict | None:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(1.5)

    try:
        sock.connect((target, port))
        banner = None

        try:
            sock.settimeout(1.5)
            sock.send(b'HEAD / HTTP/1.1\r\n\r\n')
            banner = sock.recv(1024).decode(errors="ignore").strip()
        except socket.timeout:
            pass

        return {
            "port": port,
            "status": "OPEN",
            "service": COMMON_PORTS.get(port, "Unknown"),
            "banner": banner
        }
    except (ConnectionRefusedError, socket.timeout):
        return None
    except Exception as e:
        return {"port": port, "status": "ERROR", "error": str(e)}
    finally:
        sock.close()


def run_port_scan(target: str, max_port: int = 100, max_workers: int = 50) -> dict:
    start_time = time.time()
    open_ports = []

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [
            executor.submit(scan_single_port, target, port)
            for port in range(1, max_port + 1)
        ]

        for future in as_completed(futures):
            res = future.result()
            if res:
                open_ports.append(res)

    duration = round(time.time() - start_time, 2)
    open_ports.sort(key=lambda x: x["port"])

    return {
        "target": target,
        "total_ports_scanned": max_port,
        "open_ports_count": len(open_ports),
        "open_ports": open_ports,
        "duration_seconds": duration
    }