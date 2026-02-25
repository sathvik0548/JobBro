import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { COMPANY_EMOJIS } from '../../data/mockData';

export default function AdminDashboard() {
    const { user, jobs, applications, students } = useApp();
    const navigate = useNavigate();

    const totalJobs = jobs.length;
    const openJobs = jobs.filter(j => j.status === 'Open').length;
    const totalApps = applications.length;
    const totalPlaced = applications.filter(a => a.status === 'Selected').length;

    const stats = [
        { icon: '💼', label: 'Total Jobs Posted', value: totalJobs, color: '#eff6ff', border: '#bfdbfe' },
        { icon: '📤', label: 'Total Applications', value: totalApps, color: '#fef3c7', border: '#fde68a' },
        { icon: '🏢', label: 'Open Positions', value: openJobs, color: '#dcfce7', border: '#bbf7d0' },
        { icon: '🏆', label: 'Students Placed', value: totalPlaced, color: '#ede9fe', border: '#ddd6fe' },
    ];

    // Applications per company (for bar chart)
    const companyCounts = {};
    applications.forEach(a => {
        const job = jobs.find(j => j.id === a.jobId);
        if (job) companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;
    });
    const companyChartData = Object.entries(companyCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxCount = Math.max(...companyChartData.map(([, v]) => v), 1);

    const recentJobs = [...jobs].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate)).slice(0, 5);
    const recentApps = [...applications].slice(-5).reverse().map(a => ({
        ...a,
        job: jobs.find(j => j.id === a.jobId),
        student: students.find(s => s.id === a.studentId),
    }));

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content">
                <header className="topbar">
                    <div className="topbar-title">Admin Dashboard</div>
                    <div className="topbar-user" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/profile')}>
                        <div className="avatar">{user.name[0]}</div>
                        <span>{user.name}</span>
                    </div>
                </header>
                <div className="page-body">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">Placement Cell Dashboard</h1>
                            <p className="page-subtitle">Overview of all placement activities</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => navigate('/admin/post-job')}>+ Post New Job</button>
                    </div>

                    {/* Stats */}
                    <div className="stat-grid">
                        {stats.map(s => (
                            <div key={s.label} className="stat-card" style={{ borderTop: `3px solid ${s.border}` }}>
                                <div className="stat-card-icon" style={{ background: s.color }}>{s.icon}</div>
                                <div className="stat-card-value">{s.value}</div>
                                <div className="stat-card-label">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginBottom: 24 }}>
                        {/* Recent Job Postings */}
                        <div className="card" style={{ padding: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <h3 style={{ fontWeight: 700 }}>Recent Job Postings</h3>
                                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/jobs')}>View All</button>
                            </div>
                            <div className="table-wrap">
                                <table className="data-table">
                                    <thead><tr><th>Company</th><th>Role</th><th>Applications</th><th>Status</th></tr></thead>
                                    <tbody>
                                        {recentJobs.map(job => (
                                            <tr key={job.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/applications?job=${job.id}`)}>
                                                <td><span style={{ fontWeight: 600 }}>{COMPANY_EMOJIS[job.company] || '🏢'} {job.company}</span></td>
                                                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{job.title}</td>
                                                <td><span className="badge badge-primary">{applications.filter(a => a.jobId === job.id).length}</span></td>
                                                <td><StatusBadge status={job.status} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Bar chart */}
                        <div className="card" style={{ padding: 24 }}>
                            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Applications by Company</h3>
                            {companyChartData.length === 0 ? (
                                <p className="text-muted text-sm">No applications yet.</p>
                            ) : (
                                <div className="bar-chart">
                                    {companyChartData.map(([company, count]) => (
                                        <div key={company} className="bar-col">
                                            <div className="bar-val">{count}</div>
                                            <div className="bar" style={{ height: `${(count / maxCount) * 120}px` }} title={company} />
                                            <div className="bar-label">{company.slice(0, 6)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Applications */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{ fontWeight: 700 }}>Latest Applications</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/applications')}>View All</button>
                        </div>
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead><tr><th>Student</th><th>Company</th><th>Role</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                                <tbody>
                                    {recentApps.map(app => app.student && app.job && (
                                        <tr key={app.id}>
                                            <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div className="avatar" style={{ width: 28, height: 28, fontSize: '0.75rem' }}>{app.student.name[0]}</div><span style={{ fontWeight: 600 }}>{app.student.name}</span></div></td>
                                            <td>{app.job.company}</td>
                                            <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{app.job.title}</td>
                                            <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{app.appliedDate}</td>
                                            <td><StatusBadge status={app.status} /></td>
                                            <td><button className="btn btn-outline btn-sm" onClick={() => navigate(`/admin/applications?job=${app.jobId}`)}>Manage</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
