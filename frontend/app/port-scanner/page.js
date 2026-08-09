"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import ResultsCard from "@/components/ResultsCard";
import LoadingState from "@/components/LoadingState";
import StatusBadge from "@/components/StatusBadge";

export default function PortScannerPage() {
    const [target, setTarget] = useState("");
    const [maxPort, setMaxPort] = useState(1024);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!target.trim()) return;

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await api.postPortScan(target.trim(), maxPort);
            setData(response);
        } catch (err) {
            setError(err.message || "Failed to execute port scan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Module Header */}
            <div>
        <span className="font-mono text-accent text-xs uppercase tracking-wider block mb-1">
          MODULE // 02
        </span>
                <h1 className="text-2xl font-semibold text-white tracking-tight">
                    Port Scanner
                </h1>
                <p className="text-muted text-sm mt-1">
                    Execute multi-threaded TCP socket sweeps against a target IP or hostname.
                </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="bg-bg-secondary border border-border p-6 rounded space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-1">
                        <label className="block font-mono text-xs uppercase tracking-wide text-white">
                            Target Host / IP
                        </label>
                        <input
                            type="text"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            placeholder="127.0.0.1 or example.com"
                            required
                            className="w-full bg-white/5 border border-border px-4 py-2 text-white font-mono text-sm rounded focus:outline-none focus:border-accent/50 placeholder:text-disabled"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block font-mono text-xs uppercase tracking-wide text-white">
                            Max Port Limit
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="65535"
                            value={maxPort}
                            onChange={(e) => setMaxPort(e.target.value)}
                            className="w-full bg-white/5 border border-border px-4 py-2 text-white font-mono text-sm rounded focus:outline-none focus:border-accent/50"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-accent text-black font-mono font-semibold text-xs uppercase px-6 py-2 rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                    {loading ? "Scanning Ports..." : "Start Port Sweep"}
                </button>
            </form>

            {/* Error State */}
            {error && (
                <div className="p-4 bg-status-danger/10 border border-status-danger/30 text-status-danger font-mono text-xs rounded">
                    ERROR: {error}
                </div>
            )}

            {/* Loading State */}
            {loading && <LoadingState label={`SWEEPING PORTS 1-${maxPort} ON TARGET...`} />}

            {/* Scan Results */}
            {data && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-bg-surface border border-border rounded font-mono text-xs">
                        <div>
                            <span className="text-muted mr-4">TARGET: <strong className="text-white">{data.target}</strong></span>
                            <span className="text-muted">OPEN PORTS: <strong className="text-accent">{data.open_ports?.length || 0}</strong></span>
                        </div>
                        <StatusBadge status="Complete" type="success" />
                    </div>

                    <ResultsCard title="Discovered Open Ports">
                        {data.open_ports?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full font-mono text-xs text-left">
                                    <thead>
                                    <tr className="border-b border-border text-muted uppercase text-[10px]">
                                        <th className="py-2 px-3">Port</th>
                                        <th className="py-2 px-3">Protocol</th>
                                        <th className="py-2 px-3">Service</th>
                                        <th className="py-2 px-3">State</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                    {data.open_ports.map((item, idx) => {
                                        const portNum = typeof item === "object" ? item.port : item;
                                        const service = typeof item === "object" ? item.service : "Unknown";
                                        return (
                                            <tr key={idx} className="hover:bg-bg-elevated/50 transition-colors">
                                                <td className="py-2 px-3 text-accent font-semibold">{portNum}</td>
                                                <td className="py-2 px-3 text-white">TCP</td>
                                                <td className="py-2 px-3 text-white">{service}</td>
                                                <td className="py-2 px-3">
                                                    <StatusBadge status="OPEN" type="success" />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="font-mono text-xs text-muted">No open ports detected in the range 1-{maxPort}.</p>
                        )}
                    </ResultsCard>
                </div>
            )}
        </div>
    );
}