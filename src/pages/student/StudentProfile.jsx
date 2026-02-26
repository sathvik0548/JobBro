import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Sidebar';
import { DEPARTMENTS } from '../../data/mockData';

export default function StudentProfile() {
    const { user, updateUser, logout } = useApp();
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({
        name: user.name,
        dept: user.dept,
        year: user.year,
        cgpa: user.cgpa,
        phone: user.phone || '',
        skills: (user.skills || []).join(', '),
        github: user.github || '',
        linkedin: user.linkedin || '',
        certifications: (user.certifications || []).join('\n')
    });

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
            const res = await updateUser(user.id, { avatar: base64String });
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
            const res = await updateUser(user.id, { resume: base64String });
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

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        const cgpaVal = parseFloat(editData.cgpa);
        if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) {
            return alert('Please enter a valid CGPA between 0 and 10');
        }

        const updates = {
            ...editData,
            cgpa: cgpaVal,
            skills: editData.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
            certifications: editData.certifications.split('\n').map(c => c.trim()).filter(c => c !== '')
        };

        const res = await updateUser(user.id, updates);
        if (res.success) {
            setShowEditModal(false);
        } else {
            alert('Failed to update profile');
        }
    };

    const viewResume = () => {
        if (!user.resume) return;
        try {
            const win = window.open();
            if (user.resume.includes('application/pdf')) {
                win.document.write(`<html><head><title>Resume Viewer</title></head><body style="margin:0;padding:0;overflow:hidden"><iframe src="${user.resume}" frameborder="0" style="width:100%;height:100%" allowfullscreen></iframe></body></html>`);
            } else {
                win.location.href = user.resume;
            }
        } catch (e) {
            console.error("Popup blocked or error opening resume:", e);
            window.open(user.resume, '_blank');
        }
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
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">My Profile</h1>
                            <p className="page-subtitle">Manage your academic and professional details</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => {
                            setEditData({
                                name: user.name,
                                dept: user.dept,
                                year: user.year,
                                cgpa: user.cgpa,
                                phone: user.phone || '',
                                skills: (user.skills || []).join(', '),
                                github: user.github || '',
                                linkedin: user.linkedin || '',
                                certifications: (user.certifications || []).join('\n')
                            });
                            setShowEditModal(true);
                        }}>✏️ Edit Profile</button>
                    </div>

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

                                {(user.github || user.linkedin) && (
                                    <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                                        {user.github && (
                                            <a href={user.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '8px', flex: 1, textDecoration: 'none' }} title="GitHub">
                                                🖥️ GitHub
                                            </a>
                                        )}
                                        {user.linkedin && (
                                            <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '8px', flex: 1, textDecoration: 'none', color: '#0077b5' }} title="LinkedIn">
                                                🔗 LinkedIn
                                            </a>
                                        )}
                                    </div>
                                )}
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
                                            <button onClick={viewResume} className="btn btn-outline">📄 View Resume</button>
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
                                    <div
                                        onClick={viewResume}
                                        style={{ width: 80, height: 100, borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', flexShrink: 0, marginLeft: 16, cursor: 'pointer', transition: 'transform 0.2s' }}
                                        title="Click to view resume"
                                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
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
                                                <div style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    {user.resume?.includes('pdf') ? 'PDF' : user.resume?.includes('word') || user.resume?.includes('officedocument') ? 'Word' : 'Document'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="card" style={{ padding: 24 }}>
                                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📜 Certifications</h3>
                                <div style={{ display: 'grid', gap: 12 }}>
                                    {(user.certifications || []).map((cert, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: 'var(--bg-page)', borderRadius: 8, borderLeft: '3px solid var(--primary)' }}>
                                            <span style={{ fontSize: '1.2rem' }}>🏅</span>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{cert}</span>
                                        </div>
                                    ))}
                                    {(!user.certifications || user.certifications.length === 0) && <p className="text-muted text-sm">No certifications listed.</p>}
                                </div>
                            </div>

                            <div className="card" style={{ padding: 24 }}>
                                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Account Information</h3>
                                <div style={{ display: 'grid', gap: 10 }}>
                                    {[
                                        ['Full Name', user.name],
                                        ['Email', user.email],
                                        ['Role', 'Student'],
                                        ['ID', user.id],
                                        ['Phone', user.phone || 'Not provided'],
                                        ['Department', user.dept],
                                        ['Graduation Year', user.year]
                                    ].map(([k, v]) => (
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

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: 500 }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Edit Profile Details</h2>
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
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div className="form-group">
                                        <label className="form-label">Department</label>
                                        <select
                                            className="form-control"
                                            value={editData.dept}
                                            onChange={e => setEditData({ ...editData, dept: e.target.value })}
                                        >
                                            <option value="">Select Department</option>
                                            {DEPARTMENTS.map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Graduation Year</label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            value={editData.year}
                                            onChange={e => setEditData({ ...editData, year: parseInt(e.target.value) })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">CGPA (0.0 - 10.0)</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        step="0.01"
                                        value={editData.cgpa}
                                        onChange={e => setEditData({ ...editData, cgpa: e.target.value })}
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
                                        placeholder="Enter your mobile number"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">GitHub URL</label>
                                    <input
                                        className="form-control"
                                        type="url"
                                        value={editData.github}
                                        onChange={e => setEditData({ ...editData, github: e.target.value })}
                                        placeholder="https://github.com/yourprofile"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">LinkedIn URL</label>
                                    <input
                                        className="form-control"
                                        type="url"
                                        value={editData.linkedin}
                                        onChange={e => setEditData({ ...editData, linkedin: e.target.value })}
                                        placeholder="https://linkedin.com/in/yourprofile"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Certifications (one per line)</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={editData.certifications}
                                        onChange={e => setEditData({ ...editData, certifications: e.target.value })}
                                        placeholder="AWS Certified Solutions Architect&#10;Google Data Analytics Professional Certificate..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Skills (comma separated)</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={editData.skills}
                                        onChange={e => setEditData({ ...editData, skills: e.target.value })}
                                        placeholder="React, Node.js, Python..."
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
