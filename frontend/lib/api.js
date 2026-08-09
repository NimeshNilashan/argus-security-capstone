const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP Error: ${response.status}`);
    }

    return response.json();
}

export const api = {
    // OSINT
    postOsintRecon: (domain) =>
        request("/osint/recon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domain }),
        }),

    // Port Scanner
    postPortScan: (target, max_port) =>
        request("/port-scanner/scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ target, max_port: parseInt(max_port, 10) }),
        }),

    // Log Analyzer
    postAnalyzeLogText: (log_text) =>
        request("/log-analyzer/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ log_text }),
        }),

    postAnalyzeLogFile: (formData) =>
        request("/log-analyzer/upload", {
            method: "POST",
            body: formData,
        }),

    // File Integrity
    postCheckIntegrity: (formData) =>
        request("/file-integrity/check", {
            method: "POST",
            body: formData,
        }),
};