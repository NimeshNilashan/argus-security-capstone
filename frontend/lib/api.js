const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request(endpoint, options = {}) {
    const isFormData = options.body instanceof FormData;
    const headers = isFormData
        ? { ...options.headers }
        : { "Content-Type": "application/json", ...options.headers };

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    return response.json();
}

export const api = {
    // OSINT
    postOsintRecon: (domain) =>
        request("/osint/recon", {
            method: "POST",
            body: JSON.stringify({ domain }),
        }),

    // Port Scanner
    postPortScan: (target, maxPort) =>
        request("/port-scanner/scan", {
            method: "POST",
            body: JSON.stringify({ target, max_port: maxPort }),
        }),

    // Log Analyzer
    postAnalyzeLogText: (logText) =>
        request("/log-analyzer/analyze", {
            method: "POST",
            body: JSON.stringify({ log_text: logText }),
        }),

    postAnalyzeLogFile: (formData) =>
        request("/log-analyzer/upload", {
            method: "POST",
            body: formData,
        }),

    // File Integrity (SHA-256 Only)
    postGenerateHash: (formData) =>
        request("/file-integrity/generate-hash", {
            method: "POST",
            body: formData,
        }),

    postVerifyHash: (formData) =>
        request("/file-integrity/verify-hash", {
            method: "POST",
            body: formData,
        }),

    postCompareFiles: (formData) =>
        request("/file-integrity/compare-files", {
            method: "POST",
            body: formData,
        }),
}