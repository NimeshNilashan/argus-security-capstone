export default function LoadingState({ label = "EXECUTING MODULE..." }) {
    return (
        <div className="p-8 border border-border bg-bg-secondary rounded flex flex-col items-center justify-center space-y-3">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            <span className="font-mono text-xs text-muted tracking-wide uppercase">{label}</span>
        </div>
    );
}