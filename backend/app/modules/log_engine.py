import re

ATTACK_PATTERNS = {
    "SQL Injection": r"union|select|drop|insert|or 1=1",
    "Directory Traversal": r"\.\./",
    "XSS": r"<script>|onerror=|javascript:",
    "Scanner Detected": r"nikto|sqlmap|nmap"
}


def analyze_log_content(log_text: str) -> dict:
    lines = log_text.splitlines()
    total_lines = len(lines)
    findings = {key: [] for key in ATTACK_PATTERNS}

    for line in lines:
        ip_match = re.search(r'\b\d{1,3}(?:\.\d{1,3}){3}\b', line)
        ip_addr = ip_match.group() if ip_match else "UNKNOWN"

        path_match = re.search(r'"([A-Z]+) (.+?) HTTP\/([0-9.]+)"', line, re.IGNORECASE)
        path = path_match.group(2) if path_match else ""

        ua_match = re.search(r'"([^"]*)"$', line.strip(), re.IGNORECASE)
        ua = ua_match.group(1) if ua_match else ""

        for attack_name, pattern in ATTACK_PATTERNS.items():
            if (path and re.search(pattern, path, re.IGNORECASE)) or \
               (ua and re.search(pattern, ua, re.IGNORECASE)):
                if ip_addr not in findings[attack_name]:
                    findings[attack_name].append(ip_addr)

    total_attacks = sum(len(ips) for ips in findings.values())

    return {
        "total_lines_analyzed": total_lines,
        "total_attacks_detected": total_attacks,
        "findings": findings
    }