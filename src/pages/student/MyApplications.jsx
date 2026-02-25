import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { COMPANY_EMOJIS, STATUS_TIMELINE } from '../../data/mockData';
import LiveStatusTracker from '../../components/LiveStatusTracker';

const TABS = ['All', 'Applied', 'Shortlisted', 'HR Round', 'Selected', 'Rejected'];

export default function MyApplications() {
    const { user, getStudentApplications } = useApp();
    const [tab, setTab] = useState('All');
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();
    const apps = getStudentApplications(user.id);
    const filtered = tab === 'All' ? apps : apps.filter(a => a.status === tab);

    const selectedApp = selected ? apps.find(a => a.id === selected) : null;

    function getTimelineStep(status) {
        const idx = STATUS_TIMELINE.indexOf(status);
        if (status === 'Rejected') return -1;
        return idx;
    }

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content">
                <header className="topbar">
                    <div className="topbar-title">My Applications</div>
                    <div className="topbar-user"><div className="avatar">{user.name[0]}</div><span>{user.name}</span></div>
                </header>
                <div className="page-body">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">My Applications</h1>
                            <p className="page-subtitle">{apps.length} total applications</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: selectedApp ? '1fr 300px' : '1fr', gap: 24 }}>
                        <div>
                            <div className="tabs">
                                {TABS.map(t => (
                                    <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                                        {t} {t === 'All' ? `(${apps.length})` : `(${apps.filter(a => a.status === t).length})`}
                                    </button>
                                ))}
                            </div>

                            {filtered.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
                                    <p className="text-muted">No applications found in this category.</p>
                                    <button className="btn btn-primary btn-sm mt-3" onClick={() => navigate('/student/jobs')}>Browse Jobs</button>
                                </div>
                            ) : (
                                <div className="card">
                                    <div className="table-wrap">
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>Company</th>
                                                    <th>Role</th>
                                                    <th>Applied On</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filtered.map(app => app.job && (
                                                    <tr key={app.id} style={{ background: selected === app.id ? 'var(--primary-light)' : '' }}>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                <span style={{ fontSize: '1.2rem' }}>{COMPANY_EMOJIS[app.job.company] || '🏢'}</span>
                                                                <span style={{ fontWeight: 600 }}>{app.job.company}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{app.job.title}</td>
                                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{app.appliedDate}</td>
                                                        <td><StatusBadge status={app.status} /></td>
                                                        <td>
                                                            <button className="btn btn-outline btn-sm" onClick={() => setSelected(selected === app.id ? null : app.id)}>
                                                                {selected === app.id ? 'Close' : 'Timeline'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Visual Progress Bar sidebar */}
                        {selectedApp?.job && (
                            <div className="card" style={{ padding: 24, alignSelf: 'flex-start', position: 'sticky', top: 80, overflow: 'hidden' }}>
                                <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Application Status Tracking</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 24 }}>{selectedApp.job.company} — {selectedApp.job.title}</p>

                                <LiveStatusTracker status={selectedApp.status} />

                                <div style={{ marginTop: 32, padding: 16, background: 'var(--bg-page)', borderRadius: 8 }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Current Stage:</div>
                                    <div style={{ fontWeight: 700, color: selectedApp.status === 'Rejected' ? 'var(--danger)' : 'var(--primary)' }}>
                                        {selectedApp.status}
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                                        {selectedApp.status === 'Applied' && 'Your application has been received and is under initial review.'}
                                        {selectedApp.status === 'Shortlisted' && 'Congratulations! You have been shortlisted for the next rounds.'}
                                        {selectedApp.status === 'HR Round' && 'You are in the final stages of the selection process.'}
                                        {selectedApp.status === 'Selected' && '🎉 You have been selected for this position!'}
                                        {selectedApp.status === 'Rejected' && 'Thank you for your interest. We will not be moving forward at this time.'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
