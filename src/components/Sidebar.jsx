import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

const STUDENT_NAV = [
    { icon: '🏠', label: 'Dashboard', path: '/student/dashboard' },
    { icon: '💼', label: 'Browse Jobs', path: '/student/jobs' },
    { icon: '📋', label: 'My Applications', path: '/student/applications' },
    { icon: '👤', label: 'My Profile', path: '/student/profile' },
    { icon: '🔔', label: 'Notifications', path: '/student/notifications' },
];

const ADMIN_NAV = [
    { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: '➕', label: 'Post Job', path: '/admin/post-job' },
    { icon: '💼', label: 'Manage Jobs', path: '/admin/jobs' },
    { icon: '📋', label: 'Applications', path: '/admin/applications' },
    { icon: '📈', label: 'Analytics', path: '/admin/analytics' },
    { icon: '🗄️', label: 'Database Console', path: '/admin/database' },
];

export default function Sidebar() {
    const { user, logout } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const nav = user?.role === 'admin' ? ADMIN_NAV : STUDENT_NAV;

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-text">🎓 JobBro</div>
                <div className="sidebar-logo-sub">{user?.role === 'admin' ? 'Placement Cell' : 'Student Portal'}</div>
            </div>
            <nav className="sidebar-nav">
                {nav.map(item => (
                    <button
                        key={item.path}
                        className={`sidebar-nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="icon">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className="sidebar-bottom">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div className="avatar">{user?.name?.[0] || '?'}</div>
                    <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user?.role === 'admin' ? 'Admin' : user?.dept}</div>
                    </div>
                </div>
                <button className="btn btn-ghost w-full btn-sm" onClick={handleLogout}>🚪 Logout</button>
            </div>
        </aside>
    );
}
