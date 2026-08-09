export default function StatusBadge({ status, type = "info" }) {
    const styles = {
        success: "bg-status-success/10 text-status-success border-status-success/30",
        warning: "bg-status-warning/10 text-status-warning border-status-warning/30",
        danger: "bg-status-danger/10 text-status-danger border-status-danger/30",
        info: "bg-accent-muted text-accent border-accent-border",
    };

    return (
        <span
            className={`inline-block px-2 py-0.5 font-mono text-[10px] uppercase border rounded ${
                styles[type] || styles.info
            }`}
        >
      {status}
    </span>
    );
}