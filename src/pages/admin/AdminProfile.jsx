import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Sidebar';

export default function AdminProfile() {
    const { user, updateUser, logout } = useApp();
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone || ''
    });

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        const res = await updateUser(user.id, editData);
        if (res.success) {
            setShowEditModal(false);
        } else {
            alert('Failed to update profile');
        }
    };

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content">
                <header className="topbar">
                    <div className="topbar-title">Admin Profile</div>
                    <div className="topbar-user">
                        <div className="avatar">{user.name[0]}</div>
                        <span>{user.name}</span>
                    </div>
                </header>
                <div className="page-body">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">Placement Cell Profile</h1>
                            <p className="page-subtitle">Manage your account settings</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => {
                            setEditData({ name: user.name, email: user.email, phone: user.phone || '' });
                            setShowEditModal(true);
                        }}>✏️ Edit Profile</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: 24 }}>
                        <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>
                                {user.name[0]}
                            </div>
                            <h2 style={{ fontWeight: 800, fontSize: '1.2rem' }}>{user.name}</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user.email}</p>
                            {user.phone && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>📞 {user.phone}</p>}
                            <span className="badge badge-primary mt-2">Administrator</span>
                        </div>

                        <div className="card" style={{ padding: 24 }}>
                            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Account Information</h3>
                            <div style={{ display: 'grid', gap: 10 }}>
                                {[['Full Name', user.name], ['Email', user.email], ['Phone', user.phone || 'Not provided'], ['Role', 'Placement Cell Admin'], ['ID', user.id]].map(([k, v]) => (
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

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: 450 }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Edit Admin Profile</h2>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleSaveProfile}>
                            <div className="modal-body" style={{ display: 'grid', gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={editData.name}
                                        onChange={e => setEditData({ ...editData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        value={editData.email}
                                        onChange={e => setEditData({ ...editData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        className="form-control"
                                        type="tel"
                                        value={editData.phone}
                                        onChange={e => setEditData({ ...editData, phone: e.target.value })}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
