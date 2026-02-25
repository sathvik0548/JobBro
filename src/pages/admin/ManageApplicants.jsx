import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { APPLICATION_STATUSES, COMPANY_EMOJIS } from '../../data/mockData';

const TABS = ['All', 'Applied', 'Shortlisted', 'HR Round', 'Selected', 'Rejected'];
const BULK_STATUSES = ['Shortlisted', 'HR Round', 'Selected', 'Rejected'];

export default function ManageApplicants() {
    const { user, jobs, applications, students, updateApplicationStatus } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const preselectedJob = params.get('job') || 'all';

    const [jobFilter, setJobFilter] = useState(preselectedJob);
    const [tab, setTab] = useState('All');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState([]);
    const [bulkStatus, setBulkStatus] = useState('Shortlisted');

    useEffect(() => { setJobFilter(preselectedJob); }, [preselectedJob]);

    const filteredApplications = applications
        .filter(a => jobFilter === 'all' || a.jobId === jobFilter)
        .filter(a => tab === 'All' || a.status === tab)
        .map(a => ({
            ...a,
            job: jobs.find(j => j.id === a.jobId),
            student: students.find(s => s.id === a.studentId),
        }))
        .filter(a => a.student && a.job)
        .filter(a => !search ||
            a.student.name.toLowerCase().includes(search.toLowerCase()) ||
            a.job.company.toLowerCase().includes(search.toLowerCase())
        );

    function toggleSelect(id) {
        setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    }
    function selectAll() {
        setSelected(filteredApplications.length === selected.length ? [] : filteredApplications.map(a => a.id));
    }
    async function applyBulk() {
        await Promise.all(selected.map(id => updateApplicationStatus(id, bulkStatus)));
        setSelected([]);
    }

    const currentJob = jobFilter !== 'all' ? jobs.find(j => j.id === jobFilter) : null;

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content">
                <header className="topbar">
                    <div className="topbar-title">Manage Applications</div>
                    <div className="topbar-user" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/profile')}>
                        <div className="avatar">{user.name[0]}</div>
                        <span>{user.name}</span>
                    </div>
                </header>
                <div className="page-body">
                    <div className="page-header">
                        <div>
                            {currentJob ? (
                                <>
                                    <div className="breadcrumb" style={{ marginBottom: 4 }}>
                                        <a onClick={() => navigate('/admin/applications')}>All Applications</a> › {currentJob.company} — {currentJob.title}
                                    </div>
                                    <h1 className="page-title">Applicants for {currentJob.company}</h1>
                                    <p className="page-subtitle">{filteredApplications.length} total applicants • Deadline: {currentJob.deadline}</p>
                                </>
                            ) : (
                                <>
                                    <h1 className="page-title">All Applications</h1>
                                    <p className="page-subtitle">{applications.length} total applications</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Job selector + search */}
                    <div className="search-filter-bar">
                        <select className="form-control" style={{ width: 260 }} value={jobFilter} onChange={e => setJobFilter(e.target.value)}>
                            <option value="all">All Jobs</option>
                            {jobs.map(j => <option key={j.id} value={j.id}>{j.company} — {j.title}</option>)}
                        </select>
                        <div className="search-input-wrap" style={{ flex: 1, maxWidth: 360 }}>
                            <span className="search-icon">🔍</span>
                            <input className="form-control search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by student or company..." />
                        </div>
                    </div>

                    {/* Bulk actions */}
                    {selected.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--primary-muted)', borderRadius: 8, marginBottom: 16 }}>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{selected.length} selected</span>
                            <select className="form-control" style={{ width: 180 }} value={bulkStatus} onChange={e => setBulkStatus(e.target.value)}>
                                {APPLICATION_STATUSES.map(s => <option key={s}>{s}</option>)}
                            </select>
                            <button className="btn btn-primary btn-sm" onClick={applyBulk}>Update Status</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setSelected([])}>Clear</button>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="tabs">
                        {TABS.map(t => {
                            const count = t === 'All' ? filteredApplications.length :
                                applications.filter(a => a.status === t && (jobFilter === 'all' || a.jobId === jobFilter)).length;
                            return (
                                <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                                    {t} ({count})
                                </button>
                            );
                        })}
                    </div>

                    <div className="card">
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: 40 }}>
                                            <input type="checkbox" checked={selected.length === filteredApplications.length && filteredApplications.length > 0}
                                                onChange={selectAll} style={{ accent: 'var(--primary)' }} />
                                        </th>
                                        <th>Student</th>
                                        <th>Dept</th>
                                        <th>CGPA</th>
                                        <th>Applied</th>
                                        <th>Resume</th>
                                        <th>Status</th>
                                        <th>Update Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredApplications.map(app => (
                                        <tr key={app.id} style={{ background: selected.includes(app.id) ? 'var(--primary-light)' : '' }}>
                                            <td>
                                                <input type="checkbox" checked={selected.includes(app.id)} onChange={() => toggleSelect(app.id)} />
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>{app.student.name[0]}</div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{app.student.name}</div>
                                                        {jobFilter === 'all' && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.job.company}</div>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ fontSize: '0.875rem' }}>{app.student.dept}</td>
                                            <td>
                                                <span style={{ fontWeight: 700, color: app.student.cgpa >= (app.job.minCGPA || 0) ? 'var(--success)' : 'var(--danger)' }}>
                                                    {app.student.cgpa}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.appliedDate}</td>
                                            <td>
                                                {app.student.resume ? (
                                                    <a href={app.student.resume} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">📄 View</a>
                                                ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>N/A</span>}
                                            </td>
                                            <td><StatusBadge status={app.status} /></td>
                                            <td>
                                                <select
                                                    className="form-control"
                                                    style={{ width: 140, padding: '6px 10px', fontSize: '0.8rem' }}
                                                    value={app.status}
                                                    onChange={async e => await updateApplicationStatus(app.id, e.target.value)}
                                                >
                                                    {APPLICATION_STATUSES.map(s => <option key={s}>{s}</option>)}
                                                </select>
                                            </td>
                                            <td>
                                                <div className="action-btns">
                                                    <button className="btn btn-ghost btn-sm" title="Skills: " onClick={() => alert(`Skills: ${(app.student.skills || []).join(', ') || 'N/A'}`)}>👁️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredApplications.length === 0 && (
                                        <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>No applications found.</td></tr>
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
