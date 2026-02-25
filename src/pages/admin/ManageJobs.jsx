import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { COMPANY_EMOJIS } from '../../data/mockData';
import { addDriveToCalendar } from '../../utils/googleCalendar';

export default function ManageJobs() {
    const { user, jobs, applications, updateJob, deleteJob } = useApp();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);

    const filtered = jobs.filter(j =>
        !search || j.company.toLowerCase().includes(search.toLowerCase()) || j.title.toLowerCase().includes(search.toLowerCase())
    );

    async function toggleStatus(job) {
        await updateJob(job.id, { status: job.status === 'Open' ? 'Closed' : 'Open' });
    }

    async function handleDelete(id) {
        await deleteJob(id);
        setConfirmDelete(null);
    }

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content">
                <header className="topbar">
                    <div className="topbar-title">Manage Jobs</div>
                    <div className="topbar-user" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/profile')}>
                        <div className="avatar">{user.name[0]}</div>
                        <span>{user.name}</span>
                    </div>
                </header>
                <div className="page-body">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">Manage Job Postings</h1>
                            <p className="page-subtitle">{jobs.length} total postings</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => navigate('/admin/post-job')}>+ Post New Job</button>
                    </div>

                    <div className="search-filter-bar" style={{ marginBottom: 20 }}>
                        <div className="search-input-wrap" style={{ maxWidth: 360 }}>
                            <span className="search-icon">🔍</span>
                            <input className="form-control search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs..." />
                        </div>
                    </div>

                    {/* Confirm delete modal */}
                    {confirmDelete && (
                        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
                            <div className="card" style={{ padding: 32, maxWidth: 400, textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', marginBottom: 12 }}>⚠️</div>
                                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Delete Job?</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.9rem' }}>This will also remove all associated applications. This action cannot be undone.</p>
                                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                    <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
                                    <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card">
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Company & Role</th>
                                        <th>Location</th>
                                        <th>Deadline</th>
                                        <th>Applicants</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(job => {
                                        const appCount = applications.filter(a => a.jobId === job.id).length;
                                        return (
                                            <tr key={job.id}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <div className="company-logo" style={{ width: 36, height: 36, fontSize: '1rem' }}>{COMPANY_EMOJIS[job.company] || job.company[0]}</div>
                                                        <div>
                                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{job.title}</div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{job.company}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{job.location}</td>
                                                <td style={{ fontSize: '0.875rem' }}>{job.deadline}</td>
                                                <td>
                                                    <span className="badge badge-primary" style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/applications?job=${job.id}`)}>
                                                        {appCount} {appCount === 1 ? 'applicant' : 'applicants'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className={`badge ${job.status === 'Open' ? 'badge-open' : 'badge-closed'}`}
                                                        style={{ cursor: 'pointer', border: 'none' }}
                                                        onClick={() => toggleStatus(job)}
                                                        title="Click to toggle status"
                                                    >
                                                        {job.status}
                                                    </button>
                                                </td>
                                                <td>
                                                    <div className="action-btns">
                                                        <button className="btn btn-outline btn-sm" title="Add Drive to Calendar" onClick={() => addDriveToCalendar(job, job.interviewDate)}>📅</button>
                                                        <button className="btn btn-outline btn-sm" onClick={() => navigate(`/admin/applications?job=${job.id}`)}>👥 Applicants</button>
                                                        <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(job.id)}>🗑️</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filtered.length === 0 && (
                                        <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>No jobs found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
