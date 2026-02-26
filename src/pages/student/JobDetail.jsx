import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { COMPANY_EMOJIS, daysUntilDeadline } from '../../data/mockData';
import { addDeadlineToCalendar } from '../../utils/googleCalendar';

export default function JobDetail() {
    const { id } = useParams();
    const { jobs, user, applyToJob, hasApplied } = useApp();
    const navigate = useNavigate();
    const [toast, setToast] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
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
                            <div>
                                <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Apply to {job.company}</h1>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{job.title} · {job.location} · {job.ctc}</p>
                            </div>
                            <button className="modal-close-btn" onClick={() => setShowModal(false)}>✕</button>
                        </header>

                        <div className="modal-body">
                            <div className="form-info-bar">
                                📋 <b>Application Form</b> — Fill in your details and click <b>Submit Application</b> at the bottom.
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
                                <div className="modal-form-grid">
                                    <div className="form-group">
                                        <label className="modal-label">Full Name *</label>
                                        <input className="modal-input" value={user.name} disabled />
                                    </div>
                                    <div className="form-group">
                                        <label className="modal-label">Student ID *</label>
                                        <input className="modal-input" value={user.id} disabled />
                                    </div>
                                    <div className="form-group">
                                        <label className="modal-label">Email *</label>
                                        <input className="modal-input" value={user.email} disabled />
                                    </div>
                                    <div className="form-group">
                                        <label className="modal-label">Phone Number *</label>
                                        <input name="phone" className="modal-input" placeholder="Enter your mobile number" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="modal-label">Department</label>
                                        <input className="modal-input" value={user.dept} disabled />
                                    </div>
                                    <div className="form-group">
                                        <label className="modal-label">Year</label>
                                        <input className="modal-input" value={user.year} disabled />
                                    </div>
                                    <div className="form-group">
                                        <label className="modal-label">CGPA</label>
                                        <input className="modal-input" value={user.cgpa} disabled />
                                    </div>
                                    <div className="form-group">
                                        <label className="modal-label">LinkedIn Profile</label>
                                        <input name="linkedin" className="modal-input" placeholder="linkedin.com/in/yourname" />
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginTop: 20 }}>
                                    <label className="modal-label">GitHub / Portfolio URL</label>
                                    <input name="github" className="modal-input" placeholder="github.com/yourname" />
                                </div>
                                <div className="form-group" style={{ marginTop: 20 }}>
                                    <label className="modal-label">Why do you want to join {job.company}? *</label>
                                    <textarea name="motivation" className="modal-input modal-textarea" placeholder="Tell us about your interests and why you are a good fit..." required></textarea>
                                </div>
                            </form>
                        </div>

                        <footer className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)} style={{ color: '#fff' }}>✕ Cancel</button>
                            <button className="btn btn-primary" type="submit" form="apply-form" disabled={submitting}>
                                {submitting ? '⏳ Submitting...' : '🚀 Submit Application'}
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}
