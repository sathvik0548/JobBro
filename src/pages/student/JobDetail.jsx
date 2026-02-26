import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { COMPANY_EMOJIS, daysUntilDeadline } from '../../data/mockData';
import { addDeadlineToCalendar } from '../../utils/googleCalendar';

export default function JobDetail() {
    const { id } = useParams();
    const { jobs, user, applyToJob, hasApplied, updateStudent } = useApp();
    const navigate = useNavigate();
    const [toast, setToast] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Profile Editing States
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...user });

    const job = jobs.find(j => j.id === id);

    if (!job) return (
        <div className="page-layout"><Sidebar />
            <div className="main-content"><div className="page-body">
                <p>Job not found. <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate('/student/jobs')}>Back to Jobs</span></p>
            </div></div>
        </div>
    );

    const applied = hasApplied(job.id);
    const days = daysUntilDeadline(job.deadline);

    // Eligibility check
    const checks = [
        { label: `CGPA ≥ ${job.minCGPA}`, pass: user.cgpa >= job.minCGPA },
        { label: `Department: ${job.branches.join(', ')}`, pass: job.branches.includes(user.dept) },
    ];
    const eligible = checks.every(c => c.pass);

    async function handleSaveProfile() {
        setSubmitting(true);
        const res = await updateStudent(user.id, editData);
        setSubmitting(false);
        if (res.success) {
            setIsEditing(false);
            setToast('✅ Profile updated successfully!');
            setTimeout(() => setToast(''), 3000);
        } else {
            setToast(res.error || 'Failed to update profile.');
        }
    }

    async function handleApply(formData) {
        setSubmitting(true);
        const res = await applyToJob(job.id, formData);
        setSubmitting(false);
        if (res.success) {
            setShowModal(false);
            setToast('✅ Application submitted successfully!');
            setTimeout(() => navigate('/student/applications'), 1500);
        } else {
            setToast(res.error || 'Could not apply.');
        }
    }

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content">
                <header className="topbar">
                    <div className="topbar-title">Job Detail</div>
                    <div className="topbar-user" style={{ cursor: 'pointer' }} onClick={() => navigate('/student/profile')} title="View Profile">
                        <div className="avatar">{user.avatar ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name[0]}</div>
                        <span>{user.name}</span>
                    </div>
                </header>
                <div className="page-body">
                    <div className="page-header">
                        <div>
                            <div className="breadcrumb" style={{ marginBottom: 4 }}>
                                <a onClick={() => navigate('/student/jobs')}>Browse Jobs</a> › {job.company} — {job.title}
                            </div>
                            <h1 className="page-title">{job.company} — {job.title}</h1>
                        </div>
                        <button className="btn btn-outline" onClick={() => addDeadlineToCalendar(job)}>
                            📅 Add Deadline to Calendar
                        </button>
                    </div>

                    {toast && (
                        <div className={`alert ${toast.startsWith('✅') ? 'alert-success' : 'alert-error'} mb-3`}>{toast}</div>
                    )}

                    <div className="job-detail-grid">
                        {/* Left */}
                        <div className="job-detail-main">
                            {/* Header */}
                            <div className="job-detail-section">
                                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16 }}>
                                    <div className="company-logo" style={{ width: 60, height: 60, fontSize: '1.6rem' }}>{COMPANY_EMOJIS[job.company] || job.company[0]}</div>
                                    <div>
                                        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{job.title}</h1>
                                        <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{job.company}</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto' }}><StatusBadge status={job.status} /></div>
                                </div>
                                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                    {[['📍', job.location], ['💰', job.ctc], ['🏷️', job.type], ['🏢', job.branches.join(' / ')]].map(([icon, val]) => (
                                        <div key={val} className="job-card-tag" style={{ padding: '6px 14px' }}>{icon} {val}</div>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="job-detail-section">
                                <h3>📄 Job Description</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9rem' }}>{job.description}</p>
                            </div>

                            {/* Requirements */}
                            <div className="job-detail-section">
                                <h3>📋 Requirements</h3>
                                <ul>
                                    {job.requirements.map((r, i) => (
                                        <li key={i}><span>•</span> <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{r}</span></li>
                                    ))}
                                </ul>
                            </div>

                            {/* Eligibility */}
                            <div className="job-detail-section">
                                <h3>📏 Eligibility Criteria</h3>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div className="criteria-item">
                                        <span className="criteria-check">🎓</span>
                                        <span style={{ flex: 1, fontSize: '0.9rem' }}>Minimum CGPA: <b>{job.minCGPA}</b></span>
                                    </div>
                                    <div className="criteria-item">
                                        <span className="criteria-check">🏫</span>
                                        <span style={{ flex: 1, fontSize: '0.9rem' }}>Eligible Branches: <b>{job.branches.join(', ')}</b></span>
                                    </div>
                                    <div className="criteria-item">
                                        <span className="criteria-check">💡</span>
                                        <span style={{ flex: 1, fontSize: '0.9rem' }}>Skills: <b>{job.skills.join(', ')}</b></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right */}
                        <div>
                            <div className="apply-card">
                                <h4>Application</h4>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span>Last Date:</span>
                                        <span style={{ color: days <= 7 ? 'var(--danger)' : 'var(--text-primary)', fontWeight: 600 }}>
                                            {days > 0 ? `${job.deadline} (${days}d left)` : `${job.deadline} (Expired)`}
                                        </span>
                                    </div>
                                </div>
                                {applied ? (
                                    <div className="alert alert-success" style={{ textAlign: 'center', marginBottom: 12 }}>✅ You have applied!</div>
                                ) : (
                                    <button
                                        className={`btn btn-primary w-full btn-lg`}
                                        onClick={() => setShowModal(true)}
                                        disabled={!eligible || days <= 0}
                                        style={{ marginBottom: 12 }}
                                    >
                                        {days <= 0 ? '⛔ Deadline Passed' : '🚀 Apply Now'}
                                    </button>
                                )}
                                <button className="btn btn-ghost w-full btn-sm" onClick={() => navigate('/student/jobs')}>← Back to Jobs</button>

                                <div className="divider" style={{ margin: '16px 0' }} />
                                <h4>Your Eligibility</h4>
                                {checks.map(c => (
                                    <div key={c.label} className="elig-row">
                                        <span className={c.pass ? 'elig-pass' : 'elig-fail'}>{c.pass ? '✅' : '❌'}</span>
                                        <span style={{ fontSize: '0.85rem' }}>{c.label}</span>
                                    </div>
                                ))}
                                {!eligible && <div className="alert alert-error mt-2" style={{ fontSize: '0.8rem' }}>You don't meet eligibility criteria.</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal */}
            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal-container">
                        <header className="modal-header">
                            <div className="modal-header-content">
                                <h1>Apply to {job.company}</h1>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--modal-accent)', background: 'rgba(59, 130, 246, 0.1)', padding: '4px 12px', borderRadius: 10, fontWeight: 700 }}>{job.title}</span>
                                    <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>•</span>
                                    <span style={{ fontSize: '1rem', color: 'var(--modal-text)', fontWeight: 700 }}>{job.ctc}</span>
                                </div>
                            </div>
                            <button className="modal-close-btn" onClick={() => setShowModal(false)} aria-label="Close">✕</button>
                        </header>

                        <div className="modal-body">
                            {/* Eligibility Quick Bar */}
                            <div className="eligibility-quick-bar">
                                <span style={{ fontSize: '1.5rem' }}>✨</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>You're eligible!</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--modal-text-dim)' }}>Your profile satisfies all requirement benchmarks for this position.</div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {checks.map((c, i) => (
                                        <div key={i} style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 800 }}>
                                            ✓ {c.label.split(':')[0]}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <form id="apply-form" onSubmit={(e) => {
                                e.preventDefault();
                                const fd = new FormData(e.target);
                                handleApply({
                                    phone: fd.get('phone'),
                                    linkedin: fd.get('linkedin'),
                                    github: fd.get('github'),
                                    motivation: fd.get('motivation')
                                });
                            }}>
                                {/* Section 1: Profile */}
                                <div className="form-section">
                                    <div className="form-section-card">
                                        <div className="form-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span><span style={{ marginRight: 8 }}>👤</span> Professional Profile</span>
                                            {!isEditing ? (
                                                <button
                                                    type="button"
                                                    className="btn-premium-ghost"
                                                    style={{ padding: '6px 14px', fontSize: '0.75rem', textTransform: 'none', letterSpacing: 'normal' }}
                                                    onClick={() => {
                                                        setEditData({ ...user });
                                                        setIsEditing(true);
                                                    }}
                                                >
                                                    Modify Details
                                                </button>
                                            ) : (
                                                <div style={{ display: 'flex', gap: 10 }}>
                                                    <button
                                                        type="button"
                                                        className="btn-premium-ghost"
                                                        style={{ padding: '6px 14px', fontSize: '0.75rem', textTransform: 'none', letterSpacing: 'normal', color: '#ef4444' }}
                                                        onClick={() => setIsEditing(false)}
                                                    >
                                                        Discard
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn-premium-primary"
                                                        style={{ padding: '6px 14px', fontSize: '0.75rem', borderRadius: 10 }}
                                                        onClick={handleSaveProfile}
                                                    >
                                                        Save Profile
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="modal-form-grid">
                                            <div className="form-group">
                                                <label className="modal-label">Full Name</label>
                                                <div className="modal-input-wrapper">
                                                    <input
                                                        className="modal-input"
                                                        value={isEditing ? editData.name : user.name}
                                                        disabled={!isEditing}
                                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                        placeholder="Enter full name"
                                                    />
                                                    <span className="modal-input-icon">👤</span>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="modal-label">Email Address</label>
                                                <div className="modal-input-wrapper">
                                                    <input
                                                        className="modal-input"
                                                        value={isEditing ? editData.email : user.email}
                                                        disabled={!isEditing}
                                                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                                        placeholder="email@example.com"
                                                    />
                                                    <span className="modal-input-icon">📧</span>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="modal-label">Contact Number *</label>
                                                <div className="modal-input-wrapper">
                                                    <input
                                                        name="phone"
                                                        className="modal-input"
                                                        placeholder="+91 00000 00000"
                                                        required
                                                        defaultValue={user.phone || ""}
                                                    />
                                                    <span className="modal-input-icon">📱</span>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="modal-label">Academic Identity</label>
                                                <div className="modal-input-wrapper">
                                                    {isEditing ? (
                                                        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                                                            <select
                                                                className="modal-input"
                                                                value={editData.dept}
                                                                onChange={(e) => setEditData({ ...editData, dept: e.target.value })}
                                                                style={{ paddingLeft: 56, flex: 2 }}
                                                            >
                                                                <option value="CSE">Computer Science</option>
                                                                <option value="ECE">Electronics</option>
                                                                <option value="ME">Mechanical</option>
                                                                <option value="CE">Civil</option>
                                                            </select>
                                                            <input
                                                                className="modal-input"
                                                                type="number"
                                                                step="0.01"
                                                                value={editData.cgpa}
                                                                onChange={(e) => setEditData({ ...editData, cgpa: e.target.value })}
                                                                placeholder="CGPA"
                                                                style={{ paddingLeft: 16, flex: 1 }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <input
                                                            className="modal-input"
                                                            value={`${user.dept} Engineering • ${user.year}nd Year • ${user.cgpa} CGPA`}
                                                            disabled
                                                        />
                                                    )}
                                                    <span className="modal-input-icon">🎓</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Prof Links */}
                                <div className="form-section">
                                    <div className="form-section-card">
                                        <div className="form-section-title"><span><span style={{ marginRight: 8 }}>🔗</span> Professional Presence</span></div>
                                        <div className="modal-form-grid">
                                            <div className="form-group">
                                                <label className="modal-label">LinkedIn URL</label>
                                                <div className="modal-input-wrapper">
                                                    <input name="linkedin" className="modal-input" placeholder="linkedin.com/in/username" />
                                                    <span className="modal-input-icon">🌐</span>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="modal-label">Portfolio / GitHub</label>
                                                <div className="modal-input-wrapper">
                                                    <input name="github" className="modal-input" placeholder="github.com/username" />
                                                    <span className="modal-input-icon">💻</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Statement */}
                                <div className="form-section" style={{ marginBottom: 0 }}>
                                    <div className="form-section-card">
                                        <div className="form-section-title"><span><span style={{ marginRight: 8 }}>📝</span> Statement of Purpose</span></div>
                                        <div className="form-group">
                                            <label className="modal-label">Why are you a perfect fit for {job.company}? *</label>
                                            <textarea
                                                name="motivation"
                                                className="modal-input modal-textarea"
                                                placeholder="Write a compelling motivation letter... (Minimum 50 words recommended)"
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <footer className="modal-footer">
                            <button className="btn-premium-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                            <button
                                className="btn-premium-primary"
                                type="submit"
                                form="apply-form"
                                disabled={submitting}
                            >
                                {submitting ? '⏳ Processing...' : 'Submit Application'}
                                {!submitting && <span>🚀</span>}
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}
