"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import ResultsCard from "@/components/ResultsCard";
import LoadingState from "@/components/LoadingState";
import StatusBadge from "@/components/StatusBadge";

export default function OsintPage() {
    const [domain, setDomain] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!domain.trim()) return;

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await api.postOsintRecon(domain.trim());
            setData(response);
        } catch (err) {
            setError(err.message || "Failed to complete OSINT reconnaissance.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Module Header */}
            <div>
        <span className="font-mono text-accent text-xs uppercase tracking-wider block mb-1">
          MODULE // 01
        </span>
                <h1 className="text-2xl font-semibold text-white tracking-tight">
                    OSINT Reconnaissance
                </h1>
                <p className="text-muted text-sm mt-1">
                    Query domain ownership, DNS record configurations, and threat intelligence metrics.
                </p>
            </div>

            {/* Input / Control Panel */}
            <form onSubmit={handleSubmit} className="bg-bg-secondary border border-border p-6 rounded space-y-4">
                <label className="block font-mono text-xs uppercase tracking-wide text-white">
                    Target Domain
                </label>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="example.com"
                        required
                        className="flex-1 bg-white/5 border border-border px-4 py-2 text-white font-mono text-sm rounded focus:outline-none focus:border-accent/50 placeholder:text-disabled"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-accent text-black font-mono font-semibold text-xs uppercase px-6 py-2 rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
                    >
                        {loading ? "Scanning..." : "Execute Recon"}
                    </button>
                </div>
            </form>

            {/* Error State */}
            {error && (
                <div className="p-4 bg-status-danger/10 border border-status-danger/30 text-status-danger font-mono text-xs rounded">
                    ERROR: {error}
                </div>
            )}

            {/* Loading State */}
            {loading && <LoadingState label="FETCHING WHOIS, DNS & REPUTATION DATA..." />}

            {/* Results Output */}
            {data && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-bg-surface border border-border rounded font-mono text-xs">
                        <span className="text-muted">TARGET: <strong className="text-white">{data.target}</strong></span>
                        <StatusBadge status="Scan Complete" type="success" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* WHOIS Card */}
                        <ResultsCard title="WHOIS Information">
                            {data.whois?.error ? (
                                <span className="font-mono text-xs text-status-danger">{data.whois.error}</span>
                            ) : (
                                <div className="space-y-2 font-mono text-xs">
                                    <div className="flex justify-between border-b border-border/50 pb-1">
                                        <span className="text-muted">Registrar:</span>
                                        <span className="text-white">{data.whois?.registrar || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-border/50 pb-1">
                                        <span className="text-muted">Created:</span>
                                        <span className="text-white">{data.whois?.creation_date || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-border/50 pb-1">
                                        <span className="text-muted">Expires:</span>
                                        <span className="text-white">{data.whois?.expiration_date || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-border/50 pb-1">
                                        <span className="text-muted">Country:</span>
                                        <span className="text-white">{data.whois?.country || "N/A"}</span>
                                    </div>
                                </div>
                            )}
                        </ResultsCard>

                        {/* VirusTotal Threat Stats */}
                        <ResultsCard title="Threat Intelligence (VirusTotal)">
                            {data.reputation?.error ? (
                                <span className="font-mono text-xs text-status-danger">{data.reputation.error}</span>
                            ) : data.reputation?.stats ? (
                                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                                    {Object.entries(data.reputation.stats).map(([key, val]) => (
                                        <div key={key} className="bg-bg-elevated p-2 border border-border rounded">
                                            <span className="text-muted uppercase text-[10px] block">{key}</span>
                                            <span className={`text-base font-semibold ${val > 0 && key === "malicious" ? "text-status-danger" : "text-white"}`}>
                        {val}
                      </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <span className="font-mono text-xs text-muted">No reputation statistics returned.</span>
                            )}
                        </ResultsCard>
                    </div>

                    {/* DNS Records */}
                    <ResultsCard title="DNS Records">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                            <div>
                                <span className="text-accent block mb-2 font-semibold">A Records</span>
                                {data.dns?.A?.length > 0 ? (
                                    <ul className="space-y-1 text-white">
                                        {data.dns.A.map((ip, i) => <li key={i} className="bg-bg-elevated px-2 py-1 border border-border/50 rounded">{ip}</li>)}
                                    </ul>
                                ) : <span className="text-muted">None found</span>}
                            </div>

                            <div>
                                <span className="text-accent block mb-2 font-semibold">MX Records</span>
                                {data.dns?.MX?.length > 0 ? (
                                    <ul className="space-y-1 text-white">
                                        {data.dns.MX.map((mx, i) => <li key={i} className="bg-bg-elevated px-2 py-1 border border-border/50 rounded">{mx}</li>)}
                                    </ul>
                                ) : <span className="text-muted">None found</span>}
                            </div>

                            <div>
                                <span className="text-accent block mb-2 font-semibold">NS Records</span>
                                {data.dns?.NS?.length > 0 ? (
                                    <ul className="space-y-1 text-white">
                                        {data.dns.NS.map((ns, i) => <li key={i} className="bg-bg-elevated px-2 py-1 border border-border/50 rounded">{ns}</li>)}
                                    </ul>
                                ) : <span className="text-muted">None found</span>}
                            </div>

                            <div>
                                <span className="text-accent block mb-2 font-semibold">TXT Records</span>
                                {data.dns?.TXT?.length > 0 ? (
                                    <ul className="space-y-1 text-white">
                                        {data.dns.TXT.map((txt, i) => <li key={i} className="bg-bg-elevated px-2 py-1 border border-border/50 rounded truncate">{txt.join(" ")}</li>)}
                                    </ul>
                                ) : <span className="text-muted">None found</span>}
                            </div>
                        </div>
                    </ResultsCard>
                </div>
            )}
        </div>
    );
}