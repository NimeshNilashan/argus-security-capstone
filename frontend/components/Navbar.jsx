"use client";

import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const title = pathname.replace("/", "").replace("-", " ") || "Overview";

    return (
        <header className="h-16 ml-56 bg-bg-primary border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="font-mono text-xs text-muted uppercase">
                PLATFORM / <span className="text-white font-semibold">{title}</span>
            </div>
            <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                <span className="font-mono text-xs text-white">SYSTEM ONLINE</span>
            </div>
        </header>
    );
}