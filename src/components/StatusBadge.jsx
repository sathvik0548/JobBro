const STATUS_MAP = {
    Applied: { cls: 'badge-applied', icon: '🕐' },
    Shortlisted: { cls: 'badge-shortlisted', icon: '✅' },
    Rejected: { cls: 'badge-rejected', icon: '❌' },
    Selected: { cls: 'badge-selected', icon: '🏆' },
    'HR Round': { cls: 'badge-interview', icon: '📞' },
    Open: { cls: 'badge-open', icon: '🟢' },
    Closed: { cls: 'badge-closed', icon: '🔴' },
};

export default function StatusBadge({ status }) {
    const s = STATUS_MAP[status] || { cls: 'badge-primary', icon: '•' };
    return (
        <span className={`badge ${s.cls}`}>
            {s.icon} {status}
        </span>
    );
}
