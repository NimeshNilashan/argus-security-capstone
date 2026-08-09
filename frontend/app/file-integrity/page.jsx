"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import ResultsCard from "@/components/ResultsCard";
import LoadingState from "@/components/LoadingState";
import StatusBadge from "@/components/StatusBadge";

export default function FileIntegrityPage() {
    const [mode, setMode] = useState("generate"); // "generate" | "verify" | "compare"

    // Option 1: Single file -> Calculate SHA-256
    const [singleFile, setSingleFile] = useState(null);

    // Option 2: Hash String + File -> Verify
    const [expectedHash, setExpectedHash] = useState("");
    const [verifyFile, setVerifyFile] = useState(null);

    // Option 3: Two files -> Compare
    const [fileA, setFileA] = useState(null);
    const [fileB, setFileB] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const resetState = (newMode) => {
        setMode(newMode);
        setData(null);
        setError(null);
    };

    const handleGenerateSubmit = async (e) => {
        e.preventDefault();
        if (!singleFile) return;

        setLoading(true);
        setError(null);
        setData(null);

        const formData = new FormData();
        formData.append("file", singleFile);

        try {
            const response = await api.postGenerateHash(formData);
            setData({ type: "generate", ...response });
        } catch (err) {
            setError(err.message || "Failed to calculate SHA-256 checksum.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        if (!expectedHash.trim() || !verifyFile) return;

        setLoading(true);
        setError(null);
        setData(null);

        const formData = new FormData();
        formData.append("expected_hash", expectedHash.trim());
        formData.append("file", verifyFile);

        try {
            const response = await api.postVerifyHash(formData);
            setData({ type: "verify", ...response });
        } catch (err) {
            setError(err.message || "Failed to cross-check hash with file.");
        } finally {
            setLoading(false);
        }
    };

    const handleCompareSubmit = async (e) => {
        e.preventDefault();
        if (!fileA || !fileB) return;

        setLoading(true);
        setError(null);
        setData(null);

        const formData = new FormData();
        formData.append("file_a", fileA);
        formData.append("file_b", fileB);

        try {
            const response = await api.postCompareFiles(formData);
            setData({ type: "compare", ...response });
        } catch (err) {
            setError(err.message || "Failed to compare files.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
        <span className="font-mono text-accent text-xs uppercase tracking-wider block mb-1">
          MODULE // 04
        </span>
                <h1 className="text-2xl font-semibold text-white tracking-tight">
                    File Integrity Checker
                </h1>
                <p className="text-muted text-sm mt-1">
                    Calculate and verify file authenticity using SHA-256 cryptographic hashes.
                </p>
            </div>

            <div className="bg-bg-secondary border border-border p-6 rounded space-y-4">
                {/* Navigation Tabs */}
                <div className="flex space-x-6 border-b border-border pb-3 font-mono text-xs uppercase">
                    <button
                        type="button"
                        onClick={() => resetState("generate")}
                        className={`pb-1 transition-colors ${
                            mode === "generate"
                                ? "text-accent border-b-2 border-accent font-semibold"
                                : "text-muted hover:text-white"
                        }`}
                    >
                        Option 1: Generate SHA-256
                    </button>

                    <button
                        type="button"
                        onClick={() => resetState("verify")}
                        className={`pb-1 transition-colors ${
                            mode === "verify"
                                ? "text-accent border-b-2 border-accent font-semibold"
                                : "text-muted hover:text-white"
                        }`}
                    >
                        Option 2: Verify Hash vs File
                    </button>

                    <button
                        type="button"
                        onClick={() => resetState("compare")}
                        className={`pb-1 transition-colors ${
                            mode === "compare"
                                ? "text-accent border-b-2 border-accent font-semibold"
                                : "text-muted hover:text-white"
                        }`}
                    >
                        Option 3: Compare Two Files
                    </button>
                </div>

                {/* Option 1 Form */}
                {mode === "generate" && (
                    <form onSubmit={handleGenerateSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="block font-mono text-xs uppercase text-white">
                                Select File
                            </label>
                            <input
                                type="file"
                                onChange={(e) => setSingleFile(e.target.files[0])}
                                required
                                className="block w-full font-mono text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-bg-elevated file:text-white hover:file:bg-border"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-accent text-black font-mono font-semibold text-xs uppercase px-6 py-2 rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
                        >
                            {loading ? "Calculating..." : "Calculate SHA-256"}
                        </button>
                    </form>
                )}

                {/* Option 2 Form */}
                {mode === "verify" && (
                    <form onSubmit={handleVerifySubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="block font-mono text-xs uppercase text-white">
                                1. Expected SHA-256 Hash String
                            </label>
                            <input
                                type="text"
                                value={expectedHash}
                                onChange={(e) => setExpectedHash(e.target.value)}
                                placeholder="e.g. e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
                                required
                                className="w-full bg-white/5 border border-border px-4 py-2 text-white font-mono text-xs rounded focus:outline-none focus:border-accent/50 placeholder:text-disabled"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block font-mono text-xs uppercase text-white">
                                2. Target File to Cross-Check
                            </label>
                            <input
                                type="file"
                                onChange={(e) => setVerifyFile(e.target.files[0])}
                                required
                                className="block w-full font-mono text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-bg-elevated file:text-white hover:file:bg-border"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-accent text-black font-mono font-semibold text-xs uppercase px-6 py-2 rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
                        >
                            {loading ? "Verifying..." : "Verify Hash vs File"}
                        </button>
                    </form>
                )}

                {/* Option 3 Form */}
                {mode === "compare" && (
                    <form onSubmit={handleCompareSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="block font-mono text-xs uppercase text-white">
                                    Original File (File A)
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => setFileA(e.target.files[0])}
                                    required
                                    className="block w-full font-mono text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-bg-elevated file:text-white hover:file:bg-border"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block font-mono text-xs uppercase text-white">
                                    Comparison File (File B)
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => setFileB(e.target.files[0])}
                                    required
                                    className="block w-full font-mono text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-bg-elevated file:text-white hover:file:bg-border"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-accent text-black font-mono font-semibold text-xs uppercase px-6 py-2 rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
                        >
                            {loading ? "Comparing..." : "Cross-Check File Hashes"}
                        </button>
                    </form>
                )}
            </div>

            {error && (
                <div className="p-4 bg-status-danger/10 border border-status-danger/30 text-status-danger font-mono text-xs rounded">
                    ERROR: {error}
                </div>
            )}

            {loading && <LoadingState label="COMPUTING SHA-256 CHECKSUM..." />}

            {/* Results for Option 1 */}
            {data?.type === "generate" && (
                <ResultsCard title="Generated Cryptographic Checksum">
                    <div className="space-y-3 font-mono text-xs">
                        <div className="flex justify-between border-b border-border/50 pb-2">
                            <span className="text-muted">Filename: <strong className="text-white">{data.filename}</strong></span>
                            <span className="text-muted">Size: <strong className="text-white">{(data.file_size_bytes / 1024).toFixed(2)} KB</strong></span>
                        </div>
                        <div>
                            <span className="text-muted block text-[10px] uppercase mb-1">SHA-256 Hash</span>
                            <div className="bg-bg-elevated p-3 border border-border/50 rounded text-accent break-all select-all">
                                {data.sha256}
                            </div>
                        </div>
                    </div>
                </ResultsCard>
            )}

            {/* Results for Option 2 */}
            {data?.type === "verify" && (
                <div className="space-y-6 font-mono text-xs">
                    <div className="flex items-center justify-between p-4 bg-bg-surface border border-border rounded">
                        <div>
                            <span className="text-muted mr-3">TARGET: <strong className="text-white">{data.filename}</strong></span>
                            <span className="text-muted">SIZE: <strong className="text-white">{(data.file_size_bytes / 1024).toFixed(2)} KB</strong></span>
                        </div>
                        {data.is_match ? (
                            <StatusBadge status="SHA-256 MATCH" type="success" />
                        ) : (
                            <StatusBadge status="SHA-256 MISMATCH" type="danger" />
                        )}
                    </div>

                    <ResultsCard title="SHA-256 Verification Details">
                        <div className="space-y-3">
                            <div>
                                <span className="text-muted block text-[10px] uppercase mb-1">Inputted Hash String</span>
                                <div className="bg-bg-elevated p-2 border border-border/50 rounded text-white break-all select-all">
                                    {data.expected_hash}
                                </div>
                            </div>

                            <div>
                                <span className="text-muted block text-[10px] uppercase mb-1">Computed File Hash</span>
                                <div className={`p-2 border border-border/50 rounded break-all select-all ${data.is_match ? "bg-bg-elevated text-accent" : "bg-status-danger/10 text-status-danger"}`}>
                                    {data.sha256}
                                </div>
                            </div>
                        </div>
                    </ResultsCard>
                </div>
            )}

            {/* Results for Option 3 */}
            {data?.type === "compare" && (
                <div className="space-y-6 font-mono text-xs">
                    <div className="flex items-center justify-between p-4 bg-bg-surface border border-border rounded">
                        <span className="text-white font-semibold">VERIFICATION RESULT:</span>
                        {data.is_match ? (
                            <StatusBadge status="FILES ARE IDENTICAL" type="success" />
                        ) : (
                            <StatusBadge status="FILES DIFFER / MODIFIED" type="danger" />
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ResultsCard title="File A Details">
                            <p className="text-white">Name: {data.file_a.name}</p>
                            <p className="text-muted text-[10px] mt-2">SHA-256 Checksum:</p>
                            <p className="text-accent break-all bg-bg-elevated p-2 border border-border/50 rounded mt-1 select-all">
                                {data.file_a.sha256}
                            </p>
                        </ResultsCard>

                        <ResultsCard title="File B Details">
                            <p className="text-white">Name: {data.file_b.name}</p>
                            <p className="text-muted text-[10px] mt-2">SHA-256 Checksum:</p>
                            <p className="text-accent break-all bg-bg-elevated p-2 border border-border/50 rounded mt-1 select-all">
                                {data.file_b.sha256}
                            </p>
                        </ResultsCard>
                    </div>
                </div>
            )}
        </div>
    );
}