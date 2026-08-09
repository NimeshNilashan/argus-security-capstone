export default function ResultsCard({ title, children, className = "" }) {
    return (
        <div className={`bg-bg-secondary border border-border rounded p-6 hover:border-border-strong transition-colors ${className}`}>
            {title && (
                <h3 className="font-mono text-xs text-accent uppercase tracking-wide mb-4 pb-2 border-b border-border">
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
}