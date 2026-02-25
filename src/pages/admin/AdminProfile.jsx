import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Sidebar';

export default function AdminProfile() {
    const { user } = useApp();

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content">
                <header className="topbar">
                    <div className="topbar-title">Admin Profile</div>
                    {/* Topbar user is not clickable to avoid recursion */}
                    <div className="topbar-user">
                        <div className="avatar">{user.name[0]}</div>
                        <span>{user.name}</span>
                    </div>
                </header>
                <div className="page-body">
                    <h1 className="page-title mb-4">Placement Cell Profile</h1>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: 24 }}>
                        <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>
                                {user.name[0]}
                            </div>
                            <h2 style={{ fontWeight: 800, fontSize: '1.2rem' }}>{user.name}</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user.email}</p>
                            <span className="badge badge-primary mt-2">Administrator</span>
                        </div>

                        <div className="card" style={{ padding: 24 }}>
                            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Account Information</h3>
                            <div style={{ display: 'grid', gap: 10 }}>
                                {[['Full Name', user.name], ['Email', user.email], ['Role', 'Placement Cell Admin'], ['ID', user.id]].map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{k}</span>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
