import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { DEPARTMENTS, COMPANY_EMOJIS, daysUntilDeadline, isDeadlineSoon } from '../../data/mockData';

export default function BrowseJobs() {
    const { jobs, user, hasApplied } = useApp();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [dept, setDept] = useState('All');
    const [statusFilter, setStatusFilter] = useState('Open');
    const [cgpaFilter, setCgpaFilter] = useState('');

    const filtered = jobs.filter(j => {
        const matchSearch = !search ||
            j.title.toLowerCase().includes(search.toLowerCase()) ||
            j.company.toLowerCase().includes(search.toLowerCase()) ||
            j.location.toLowerCase().includes(search.toLowerCase());
        const matchDept = dept === 'All' || j.branches.includes(dept);
        const matchStatus = statusFilter === 'All' || j.status === statusFilter;
        const matchCGPA = !cgpaFilter || (user && user.cgpa >= parseFloat(cgpaFilter));
        return matchSearch && matchDept && matchStatus && matchCGPA;
    });

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content">
                <header className="topbar">
                    <div className="topbar-title">Browse Jobs</div>
                    <div className="topbar-user">
                        <div className="avatar">{user.name[0]}</div>
                        <span>{user.name}</span>
                    </div>
                </header>
                <div className="page-body">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">Job Opportunities</h1>
                            <p className="page-subtitle">{filtered.length} opportunities found</p>
                        </div>
                    </div>

                    {/* Search + filters */}
                    <div className="search-filter-bar">
                        <div className="search-input-wrap">
                            <span className="search-icon">🔍</span>
                            <input className="form-control search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by company, role, location..." />
                        </div>
                        <select className="form-control" style={{ width: 160 }} value={cgpaFilter} onChange={e => setCgpaFilter(e.target.value)}>
                            <option value="">Min CGPA: Any</option>
                            <option value="6">CGPA ≥ 6</option>
                            <option value="7">CGPA ≥ 7</option>
                            <option value="7.5">CGPA ≥ 7.5</option>
                            <option value="8">CGPA ≥ 8</option>
                        </select>
                        <select className="form-control" style={{ width: 140 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="All">All Status</option>
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    <div className="filter-chips">
                        {['All', ...DEPARTMENTS].map(d => (
                            <button key={d} className={`chip ${dept === d ? 'active' : ''}`} onClick={() => setDept(d)}>{d}</button>
                        ))}
                    </div>

                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
                            <p style={{ color: 'var(--text-secondary)' }}>No jobs found matching your filters.</p>
                        </div>
                    ) : (
                        <div className="job-grid">
                            {filtered.map(job => {
                                const days = daysUntilDeadline(job.deadline);
                                const applied = hasApplied(job.id);
                                return (
                                    <div key={job.id} className="job-card" onClick={() => navigate(`/student/jobs/${job.id}`)}>
                                        <div className="job-card-header">
                                            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flex: 1 }}>
                                                <div className="company-logo">{COMPANY_EMOJIS[job.company] || job.company[0]}</div>
                                                <div>
                                                    <div className="job-card-title">{job.title}</div>
                                                    <div className="job-card-company">{job.company}</div>
                                                </div>
                                            </div>
                                            <StatusBadge status={job.status} />
                                        </div>
                                        <div className="job-card-meta">
                                            <span className="job-card-tag">📍 {job.location}</span>
                                            <span className="job-card-tag">💰 {job.ctc}</span>
                                            <span className="job-card-tag">🎓 CGPA ≥ {job.minCGPA}</span>
                                            <span className="job-card-tag">🏷️ {job.type}</span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            Branches: {job.branches.join(', ')}
                                        </div>
                                        <div className="job-card-footer">
                                            <span className={`deadline-text ${days <= 7 ? 'urgent' : ''}`}>
                                                {days > 0 ? `⏰ ${days} days left` : '⛔ Expired'}
                                            </span>
                                            <button
                                                className={`btn btn-sm ${applied ? 'btn-ghost' : 'btn-primary'}`}
                                                onClick={e => { e.stopPropagation(); navigate(`/student/jobs/${job.id}`); }}
                                            >
                                                {applied ? '✅ Applied' : 'Apply Now'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
