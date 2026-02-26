import { useApp } from '../../context/AppContext';

export default function Notifications() {
    const { user, notifications, markAllNotificationsAsRead } = useApp();
    const studentNotifs = notifications.filter(n => n.studentId === user.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    function getNotifLabel(type) {
        switch (type) {
            case 'NEW_JOB': return 'New Job';
            case 'APPLICATION_SENT': return 'Application Sent';
            case 'STATUS_UPDATE': return 'Status Update';
            default: return 'Notification';
        }
    }

    return (
        <div className="page-container">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'center' }}>
                <h1 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 900, color: '#1e293b' }}>Notifications</h1>
            </header>

            <div className="notifications-container">
                <div className="notifications-card">
                    <div className="notifications-header">
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>All Notifications</h2>
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => markAllNotificationsAsRead(user.id)}
                        >
                            Mark all read
                        </button>
                    </div>

                    <div className="notification-list">
                        {studentNotifs.length === 0 ? (
                            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: 16 }}>📭</div>
                                <p>You have no notifications at the moment.</p>
                            </div>
                        ) : (
                            studentNotifs.map(n => (
                                <div key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
                                    <div className="notif-type">{getNotifLabel(n.type)}</div>
                                    <div className="notif-title">{n.title}</div>
                                    <div className="notif-msg">{n.message}</div>
                                    <div className="notif-time">Just now</div>
                                    {!n.read && <div className="notif-dot"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
