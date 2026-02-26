import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';

export default function StudentProfile() {
    const { user, updateStudent, logout } = useApp();
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) return alert('Please select an image file');
        if (file.size > 2 * 1024 * 1024) return alert('File size must be under 2MB');

        setUploading(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64String = event.target.result;
            const res = await updateStudent(user.id, { avatar: base64String });
            if (!res.success) alert('Failed to update profile picture');
            setUploading(false);
        };
        reader.onerror = () => {
            alert('Failed to read file');
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) return alert('Please select a PDF or Word document');
        if (file.size > 5 * 1024 * 1024) return alert('File size must be under 5MB');

        setUploadingResume(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64String = event.target.result;
            const res = await updateStudent(user.id, { resume: base64String });
            if (!res.success) alert('Failed to upload resume');
            setUploadingResume(false);
            setImgError(false); // Reset error if any for preview
        };
        reader.onerror = () => {
            alert('Failed to read file');
            setUploadingResume(false);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content">
                <header className="topbar">
                    <div className="topbar-title">My Profile</div>
                    <div className="topbar-user" style={{ cursor: 'pointer' }} onClick={() => navigate('/student/profile')} title="View Profile">
                        <div className="avatar">
                            {user.avatar ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name[0]}
                        </div>
                        <span>{user.name}</span>
                    </div>
                </header>
                <div className="page-body">
                    <h1 className="page-title mb-4">My Profile</h1>
                    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
                        {/* Profile card */}
                        <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{ position: 'relative', marginBottom: 16 }}>
                                <div
                                    style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, overflow: 'hidden', border: '3px solid var(--primary-light)', position: 'relative' }}
                                >
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : user.name[0]}

                                    {uploading && (
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div className="spinner" style={{ width: 24, height: 24, borderTopColor: '#fff', borderRightColor: '#fff' }} />
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="avatar-upload"
                                    style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--bg-card)', color: 'var(--text-primary)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}
                                    title="Change Profile Picture"
                                >
                                    📷
                                </label>
                                <input id="avatar-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} disabled={uploading} />
                            </div>

                            <h2 style={{ fontWeight: 800, fontSize: '1.2rem' }}>{user.name}</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user.email}</p>
                            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
                                <div style={{ background: 'var(--bg-page)', borderRadius: 8, padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Department</span>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.dept}</span>
                                </div>
                                <div style={{ background: 'var(--bg-page)', borderRadius: 8, padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Year</span>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.year}</span>
                                </div>
                                <div style={{ background: 'var(--primary-light)', borderRadius: 8, padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>CGPA</span>
                                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>{user.cgpa}</span>
                                </div>
                                <button className="btn btn-danger w-full mt-3" onClick={() => { logout(); navigate('/'); }} style={{ justifyContent: 'center' }}>
                                    🚪 Log Out
                                </button>
                            </div>
                        </div>

                        {/* Details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div className="card" style={{ padding: 24 }}>
                                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Skills</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {(user.skills || []).map(s => (
                                        <span key={s} className="tag-item" style={{ fontSize: '0.85rem', padding: '5px 14px' }}>{s}</span>
                                    ))}
                                    {(!user.skills || user.skills.length === 0) && <span className="text-muted text-sm">No skills added.</span>}
                                </div>
                            </div>

                            <div className="card" style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Resume</h3>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                                        {user.resume ? (
                                            <a href={user.resume} target="_blank" rel="noopener noreferrer" className="btn btn-outline">📄 View Resume</a>
                                        ) : (
                                            <p className="text-muted text-sm" style={{ marginBottom: 0 }}>No resume uploaded.</p>
                                        )}

                                        <label htmlFor="resume-upload" className={`btn ${uploadingResume ? 'btn-ghost' : 'btn-primary'}`} style={{ cursor: 'pointer' }}>
                                            {uploadingResume ? '⏳ Uploading...' : (user.resume ? '🔄 Update Resume' : '📤 Upload Resume (PDF)')}
                                        </label>
                                        <input
                                            id="resume-upload"
                                            type="file"
                                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                            style={{ display: 'none' }}
                                            onChange={handleResumeUpload}
                                            disabled={uploadingResume}
                                        />
                                    </div>
                                </div>
                                {user.resume && (
                                    <a href={user.resume} target="_blank" rel="noopener noreferrer" style={{ width: 80, height: 100, borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', flexShrink: 0, marginLeft: 16, textDecoration: 'none' }}>
                                        {!imgError ? (
                                            <img
                                                src={user.resume}
                                                alt="Resume Preview"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={() => setImgError(true)}
                                            />
                                        ) : (
                                            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                                <div style={{ fontSize: '2rem', marginBottom: 4 }}>📄</div>
                                                <div style={{ fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase' }}>Document</div>
                                            </div>
                                        )}
                                    </a>
                                )}
                            </div>

                            <div className="card" style={{ padding: 24 }}>
                                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Account Information</h3>
                                <div style={{ display: 'grid', gap: 10 }}>
                                    {[['Full Name', user.name], ['Email', user.email], ['Role', 'Student'], ['ID', user.id]].map(([k, v]) => (
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
        </div>
    );
}
