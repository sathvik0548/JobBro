import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import LiveStatusTracker from '../../components/LiveStatusTracker';
import { daysUntilDeadline, isDeadlineSoon, COMPANY_EMOJIS } from '../../data/mockData';

export default function StudentDashboard() {
    const { user, jobs, getStudentApplications } = useApp();
    const navigate = useNavigate();
    const myApps = getStudentApplications(user.id);
    const sortedApps = [...myApps].sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    const latestApp = sortedApps[0];

    const openJobs = jobs.filter(j => j.status === 'Open');
    const upcoming = openJobs
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 3);

    const stats = [
        { icon: '💼', label: 'Jobs Available', value: openJobs.length, color: '#eff6ff' },
        { icon: '📤', label: 'Applied', value: myApps.length, color: '#fef3c7' },
        { icon: '✅', label: 'Shortlisted', value: myApps.filter(a => a.status === 'Shortlisted').length, color: '#dcfce7' },
        { icon: '⏰', label: 'Deadlines', value: upcoming.length, color: '#fee2e2' },
    ];

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content">
                <header className="topbar">
                    <div className="topbar-title">Student Dashboard</div>
                    <div className="topbar-user" style={{ cursor: 'pointer' }} onClick={() => navigate('/student/profile')} title="View Profile">
                        <div className="avatar">{user.avatar ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name[0]}</div>
                        <span>{user.name}</span>
                    </div>
                </header>
                <div className="page-body">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
                            <p className="page-subtitle">{user.dept} • {user.year} Year • CGPA: {user.cgpa}</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => navigate('/student/jobs')}>Browse Jobs →</button>
                    </div>

                    {/* Stats */}
                    <div className="stat-grid" style={{ marginBottom: 24 }}>
                        {stats.map(s => (
                            <div key={s.label} className="stat-card">
                                <div className="stat-card-icon" style={{ background: s.color }}>{s.icon}</div>
                                <div className="stat-card-value">{s.value}</div>
                                <div className="stat-card-label">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Prominent Live Status Tracker for Latest App */}
                    {latestApp && (
                        <div className="card" style={{ padding: '24px 32px', marginBottom: 24, background: '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>🚀 Your Latest Application Status</h3>
                                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/student/applications')}>Manage All</button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                                <div className="company-logo" style={{ width: 48, height: 48, fontSize: '1.2rem' }}>
                                    {COMPANY_EMOJIS[latestApp.job?.company] || '🏢'}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{latestApp.job?.title}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{latestApp.job?.company} • Applied on {latestApp.appliedDate}</div>
                                </div>
                                <div style={{ marginLeft: 'auto' }}>
                                    <StatusBadge status={latestApp.status} />
                                </div>
                            </div>
                            <div style={{ padding: '10px 0' }}>
                                <LiveStatusTracker status={latestApp.status} />
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        {/* Upcoming deadlines */}
                        <div className="card" style={{ padding: 24 }}>
                            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>⏰ Upcoming Deadlines</h3>
                            {upcoming.length === 0 ? <p className="text-muted text-sm">No upcoming deadlines.</p> : upcoming.map(job => {
                                const days = daysUntilDeadline(job.deadline);
                                const soon = days <= 7;
                                return (
                                    <div key={job.id} onClick={() => navigate(`/student/jobs/${job.id}`)}
                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{COMPANY_EMOJIS[job.company] || '🏢'} {job.company}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{job.title}</div>
                                        </div>
                                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: soon ? 'var(--danger)' : 'var(--text-muted)', background: soon ? 'var(--danger-bg)' : 'var(--bg-page)', padding: '3px 10px', borderRadius: 99 }}>
                                            {days > 0 ? `${days}d left` : 'Expired'}
                                        </span>
                                    </div>
                                );
                            })}
                            <button className="btn btn-outline w-full btn-sm mt-3" onClick={() => navigate('/student/jobs')}>View All Jobs</button>
                        </div>

                        {/* Recent applications list */}
                        <div className="card" style={{ padding: 24 }}>
                            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📋 All Applications</h3>
                            {myApps.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: 10 }}>📭</div>
                                    <p className="text-muted text-sm">You haven't applied to any jobs yet.</p>
                                    <button className="btn btn-primary btn-sm mt-2" onClick={() => navigate('/student/jobs')}>Browse Jobs</button>
                                </div>
                            ) : (
                                <div className="table-wrap">
                                    <table className="data-table">
                                        <thead><tr><th>Company</th><th>Role</th><th>Status</th></tr></thead>
                                        <tbody>
                                            {sortedApps.slice(0, 5).map(app => app.job && (
                                                <tr key={app.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/student/applications')}>
                                                    <td><span style={{ fontWeight: 600 }}>{app.job.company}</span></td>
                                                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{app.job.title}</td>
                                                    <td><StatusBadge status={app.status} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {myApps.length > 0 && <button className="btn btn-ghost w-full btn-sm mt-3" onClick={() => navigate('/student/applications')}>View All</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

