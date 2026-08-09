"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "OSINT Recon", path: "/osint" },
    { label: "Port Scanner", path: "/port-scanner" },
    { label: "Log Analyzer", path: "/log-analyzer" },
    { label: "File Integrity", path: "/file-integrity" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-56 h-screen fixed left-0 top-0 bg-bg-primary border-r border-border flex flex-col z-20">
            {/* Branding */}
            <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="font-mono font-semibold text-white tracking-tight text-lg">
          ARGUS <span className="text-accent text-xs font-normal">v2.0</span>
        </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center h-10 px-3 font-mono text-xs uppercase tracking-wide rounded transition-colors ${
                                isActive
                                    ? "bg-bg-elevated text-white border-l-2 border-accent"
                                    : "text-muted hover:text-white hover:bg-bg-surface"
                            }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Operational Footer Status */}
            <div className="p-4 border-t border-border font-mono text-[10px] text-muted space-y-1">
                <div className="flex items-center justify-between">
                    <span>ENGINE:</span>
                    <span className="text-status-success">READY</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>MODE:</span>
                    <span>REST API</span>
                </div>
            </div>
        </aside>
    );
}