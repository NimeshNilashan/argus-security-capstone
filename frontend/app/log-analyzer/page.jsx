"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import ResultsCard from "@/components/ResultsCard";
import LoadingState from "@/components/LoadingState";
import StatusBadge from "@/components/StatusBadge";

export default function LogAnalyzerPage() {
    const [activeTab, setActiveTab] = useState("text");
    const [logText, setLogText] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const handleTextSubmit = async (e) => {
        e.preventDefault();
        if (!logText.trim()) return;

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await api.postAnalyzeLogText(logText);
            setData(response);
        } catch (err) {
            setError(err.message || "Failed to analyze log text.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setLoading(true);
        setError(null);
        setData(null);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await api.postAnalyzeLogFile(formData);
            setData(response);
        } catch (err) {
            setError(err.message || "Failed to analyze uploaded file.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
        <span className="font-mono text-accent text-xs uppercase tracking-wider block mb-1">
          MODULE // 03
        </span>
                <h1 className="text-2xl font-semibold text-white tracking-tight">
                    Log File Analyzer
                </h1>
                <p className="text-muted text-sm mt-1">
                    Parse HTTP server logs to detect web attack signatures, path traversals, and anomalous response codes.
                </p>
            </div>

            {/* Control Tabs */}
            <div className="bg-bg-secondary border border-border p-6 rounded space-y-4">
                <div className="flex space-x-4 border-b border-border pb-3">
                    <button
                        type="button"
                        onClick={() => setActiveTab("text")}
                        className={`font-mono text-xs uppercase pb-1 transition-colors ${
                            activeTab === "text"
                                ? "text-accent border-b-2 border-accent font-semibold"
                                : "text-muted hover:text-white"
                        }`}
                    >
                        Raw Log Input
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("file")}
                        className={`font-mono text-xs uppercase pb-1 transition-colors ${
                            activeTab === "file"
                                ? "text-accent border-b-2 border-accent font-semibold"
                                : "text-muted hover:text-white"
                        }`}
                    >
                        File Upload (.log / .txt)
                    </button>
                </div>

                {activeTab === "text" ? (
                    <form onSubmit={handleTextSubmit} className="space-y-4">
            <textarea
                rows={6}
                value={logText}
                onChange={(e) => setLogText(e.target.value)}
                placeholder='192.168.1.10 - - [10/Aug/2026:14:32:10 +0000] "GET /admin/login.php?id=1%27%20OR%201=1 HTTP/1.1" 200 4500'
                required
                className="w-full bg-white/5 border border-border p-3 text-white font-mono text-xs rounded focus:outline-none focus:border-accent/50 placeholder:text-disabled resize-none"
            />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-accent text-black font-mono font-semibold text-xs uppercase px-6 py-2 rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
                        >
                            {loading ? "Analyzing..." : "Analyze Log Stream"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleFileSubmit} className="space-y-4">
                        <input
                            type="file"
                            accept=".log,.txt"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                            required
                            className="block w-full font-mono text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-bg-elevated file:text-white hover:file:bg-border"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-accent text-black font-mono font-semibold text-xs uppercase px-6 py-2 rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
                        >
                            {loading ? "Processing File..." : "Upload & Analyze"}
                        </button>
                    </form>
                )}
            </div>

            {error && (
                <div className="p-4 bg-status-danger/10 border border-status-danger/30 text-status-danger font-mono text-xs rounded">
                    ERROR: {error}
                </div>
            )}

            {loading && <LoadingState label="PARSING LOG PATTERNS AND THREAT SIGNATURES..." />}

            {data && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-bg-surface p-4 border border-border rounded font-mono text-xs">
                            <span className="text-muted block text-[10px] uppercase">Total Logs Analyzed</span>
                            <span className="text-xl font-bold text-white mt-1 block">{data.total_entries}</span>
                        </div>
                        <div className="bg-bg-surface p-4 border border-border rounded font-mono text-xs">
                            <span className="text-muted block text-[10px] uppercase">Suspicious Threats</span>
                            <span className={`text-xl font-bold mt-1 block ${data.suspicious_count > 0 ? "text-status-danger" : "text-status-success"}`}>
                {data.suspicious_count}
              </span>
                        </div>
                        <div className="bg-bg-surface p-4 border border-border rounded font-mono text-xs">
                            <span className="text-muted block text-[10px] uppercase">Unique IP Sources</span>
                            <span className="text-xl font-bold text-accent mt-1 block">
                {Object.keys(data.ip_summary || {}).length}
              </span>
                        </div>
                    </div>

                    <ResultsCard title="Parsed Log Stream">
                        <div className="overflow-x-auto">
                            <table className="w-full font-mono text-xs text-left">
                                <thead>
                                <tr className="border-b border-border text-muted uppercase text-[10px]">
                                    <th className="py-2 px-3">IP Address</th>
                                    <th className="py-2 px-3">Method</th>
                                    <th className="py-2 px-3">Endpoint</th>
                                    <th className="py-2 px-3">Status</th>
                                    <th className="py-2 px-3">Analysis Flag</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                {data.entries.map((entry, idx) => (
                                    <tr
                                        key={idx}
                                        className={entry.is_suspicious ? "bg-status-danger/5 hover:bg-status-danger/10" : "hover:bg-bg-elevated/50"}
                                    >
                                        <td className="py-2 px-3 text-white">{entry.ip || "N/A"}</td>
                                        <td className="py-2 px-3 text-accent font-semibold">{entry.method || "-"}</td>
                                        <td className="py-2 px-3 text-white max-w-xs truncate">{entry.endpoint || entry.raw}</td>
                                        <td className="py-2 px-3 text-white">{entry.status_code || "-"}</td>
                                        <td className="py-2 px-3">
                                            {entry.is_suspicious ? (
                                                <StatusBadge status={entry.flag_reason || "SUSPICIOUS"} type="danger" />
                                            ) : (
                                                <StatusBadge status="CLEAN" type="success" />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </ResultsCard>
                </div>
            )}
        </div>
    );
}