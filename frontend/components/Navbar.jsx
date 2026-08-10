"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", href: "/" },
        { label: "OSINT", href: "/osint" },
        { label: "Port Scanner", href: "/port-scanner" },
        { label: "Log Analyzer", href: "/log-analyzer" },
        { label: "File Integrity", href: "/file-integrity" },
    ];

    return (
        <header className="border-b border-border bg-bg-secondary font-mono">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="text-accent font-bold text-sm tracking-wider uppercase">
                    SEC_OPS // v1.0
                </Link>
                <nav className="flex space-x-6 text-xs uppercase">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`transition-colors ${
                                    isActive
                                        ? "text-accent font-semibold border-b-2 border-accent pb-1"
                                        : "text-muted hover:text-white"
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}