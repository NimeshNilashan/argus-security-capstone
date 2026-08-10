"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import LoadingState from "@/components/LoadingState";

export default function DashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchStatus() {
            try {
                const res = await api.getDashboardStatus();
                setData(res);
            } catch (err) {
                setError("Failed to fetch backend core metrics.");
            } finally {
                setLoading(false);
            }
        }
        fetchStatus();
    }, []);

    const modulesList = [
        { id: "01", name: "OSINT Recon", route: "/osint", desc: "Domain WHOIS, DNS record retrieval, and sub-domain enumeration." },
        { id: "02", name: "Port Scanner", route: "/port-scanner", desc: "Target host socket probing for open ports and service detection." },
        { id: "03", name: "Log Analyzer", route: "/log-analyzer", desc: "Parse raw system/web logs to detect anomalies and attack vectors." },
        { id: "04", name: "File Integrity", route: "/file-integrity", desc: "SHA-256 hash generation, verification, and side-by-side file comparison." }
    ];

    return (
        <div className="space-y-8 font-mono">
            <div>
                <span className="text-accent text-xs uppercase tracking-wider block mb-1">SYSTEM // CORE</span>
                <h1 className="text-2xl font-semibold text-white tracking-tight">Security Operations Dashboard</h1>
                <p className="text-muted text-sm mt-1">Unified toolkit for threat surface analysis and file integrity.</p>
            </div>

            {loading && <LoadingState label="CONNECTING TO BACKEND AGENT..." />}
            {error && <div className="p-4 bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs rounded">ERROR: {error}</div>}

            {data && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-bg-secondary border border-border p-4 rounded">
                        <span className="text-muted text-[10px] uppercase">Core Engine Status</span>
                        <div className="mt-2"><StatusBadge status={data.status} type="success" /></div>
                    </div>
                    <div className="bg-bg-secondary border border-border p-4 rounded">
                        <span className="text-muted text-[10px] uppercase">Active Modules</span>
                        <div className="text-2xl font-bold text-white mt-1">{data.active_modules} / 4</div>
                    </div>
                    <div className="bg-bg-secondary border border-border p-4 rounded">
                        <span className="text-muted text-[10px] uppercase">API Version</span>
                        <div className="text-2xl font-bold text-accent mt-1">v{data.version}</div>
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-border pb-2">Available Modules</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modulesList.map((m) => (
                        <Link key={m.id} href={m.route} className="block bg-bg-secondary border border-border hover:border-accent/50 p-5 rounded transition-all group">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-accent text-xs font-bold">MODULE // {m.id}</span>
                                <span className="text-xs text-muted group-hover:text-white transition-colors">Launch &rarr;</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white group-hover:text-accent transition-colors">{m.name}</h3>
                            <p className="text-muted text-xs mt-2 leading-relaxed">{m.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
            {/* Social Links */}
            <div className="pt-6 border-t border-border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span className="text-muted text-[15px] uppercase tracking-wider">
            Made with ☕ by <span className="text-accent">Nimesh Nilashan</span>
        </span>

                    <div className="flex items-center gap-5 text-s font-mono">
                        <a
                            href="https://github.com/NimeshNilashan"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-white transition-colors"
                        >
                            GitHub ↗
                        </a>

                        <a
                            href="https://linkedin.com/in/nimesh-nilashan"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-white transition-colors"
                        >
                            LinkedIn ↗
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}