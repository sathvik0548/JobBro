import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Sidebar';
import { DEPARTMENTS } from '../../data/mockData';
import { addDriveToCalendar } from '../../utils/googleCalendar';

const JOB_TYPES = ['Full-time', 'Internship', 'Contract'];

export default function PostJob() {
    const { user, addJob } = useApp();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '', company: '', location: '', ctc: '', type: 'Full-time',
        description: '', minCGPA: '', deadline: '', status: 'Open',
        interviewDate: '',
    });
    const [branches, setBranches] = useState([]);
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [requirements, setRequirements] = useState(['']);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    function set(f, v) { setForm(p => ({ ...p, [f]: v })); }

    function toggleBranch(b) {
        setBranches(p => p.includes(b) ? p.filter(x => x !== b) : [...p, b]);
    }

    function addSkill(e) {
        if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
            e.preventDefault();
            if (!skills.includes(skillInput.trim())) setSkills(s => [...s, skillInput.trim()]);
            setSkillInput('');
        }
    }

    function setReq(i, v) { setRequirements(p => p.map((r, idx) => idx === i ? v : r)); }
    function addReq() { setRequirements(p => [...p, '']); }
    function removeReq(i) { setRequirements(p => p.filter((_, idx) => idx !== i)); }

    async function handleSubmit(e, draft = false) {
        e.preventDefault();
        if (!form.title || !form.company || !form.deadline) return setError('Please fill Job Title, Company, and Deadline.');
        if (branches.length === 0) return setError('Please select at least one eligible branch.');
        const jobData = {
            ...form,
            minCGPA: parseFloat(form.minCGPA) || 6.0,
            branches,
            skills,
            requirements: requirements.filter(r => r.trim()),
            status: draft ? 'Closed' : 'Open',
        };
        await addJob(jobData);
        setSuccess(draft ? '📝 Job saved as draft.' : '✅ Job posted successfully!');
        setTimeout(() => navigate('/admin/jobs'), 1500);
    }

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content">
                <header className="topbar">
                    <div className="topbar-title">Post New Job</div>
                    <div className="topbar-user" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/profile')}>
                        <div className="avatar">{user.name[0]}</div>
                        <span>{user.name}</span>
                    </div>
                </header>
                <div className="page-body">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">Post New Job Opportunity</h1>
                            <p className="page-subtitle">Fill in the details to publish a new opening</p>
                        </div>
                    </div>

                    {success && <div className="alert alert-success mb-3">{success}</div>}
                    {error && <div className="alert alert-error mb-3">{error}</div>}

                    <div className="card" style={{ padding: 32, maxWidth: 860 }}>
                        <form className="post-job-form" onSubmit={handleSubmit}>
                            {/* Basic Info */}
                            <div>
                                <div className="section-heading">Basic Information</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Job Title *</label>
                                            <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Software Engineer" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Company Name *</label>
                                            <input className="form-control" value={form.company} onChange={e => set('company', e.target.value)} placeholder="Google" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Location</label>
                                            <input className="form-control" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Bangalore / Remote" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">CTC / Stipend</label>
                                            <input className="form-control" value={form.ctc} onChange={e => set('ctc', e.target.value)} placeholder="18–22 LPA" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Last Date to Apply *</label>
                                            <input className="form-control" type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Interview/Drive Date</label>
                                            <input className="form-control" type="date" value={form.interviewDate} onChange={e => set('interviewDate', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Job Description</label>
                                        <textarea className="form-control" rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the role, responsibilities, team, and company culture..." />
                                    </div>
                                </div>
                            </div>

                            {/* Requirements */}
                            <div>
                                <div className="section-heading">Requirements</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {requirements.map((r, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 8 }}>
                                            <input className="form-control" value={r} onChange={e => setReq(i, e.target.value)} placeholder={`Requirement ${i + 1}`} />
                                            {requirements.length > 1 && (
                                                <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeReq(i)}>✕</button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }} onClick={addReq}>+ Add Requirement</button>
                                </div>
                            </div>

                            {/* Eligibility */}
                            <div>
                                <div className="section-heading">Eligibility Criteria</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div className="form-group">
                                        <label className="form-label">Minimum CGPA</label>
                                        <input className="form-control" type="number" min="0" max="10" step="0.1" value={form.minCGPA} onChange={e => set('minCGPA', e.target.value)} placeholder="7.0" style={{ maxWidth: 180 }} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Eligible Branches *</label>
                                        <div className="checkbox-grid">
                                            {DEPARTMENTS.map(d => (
                                                <label key={d} className="checkbox-item">
                                                    <input type="checkbox" checked={branches.includes(d)} onChange={() => toggleBranch(d)} />
                                                    {d}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Required Skills <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(Enter to add)</span></label>
                                        <div className="tags-input-wrap">
                                            {skills.map(s => (
                                                <span key={s} className="tag-item">{s} <span className="tag-remove" onClick={() => setSkills(p => p.filter(x => x !== s))}>✕</span></span>
                                            ))}
                                            <input className="tag-input-field" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={addSkill} placeholder={skills.length === 0 ? "Python, React, SQL..." : ''} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <div className="section-heading">Publication Settings</div>
                                <div className="status-toggle">
                                    <label className="toggle">
                                        <input type="checkbox" checked={form.status === 'Open'} onChange={e => set('status', e.target.checked ? 'Open' : 'Closed')} />
                                        <span className="toggle-slider"></span>
                                    </label>
                                    <span style={{ fontWeight: 600, color: form.status === 'Open' ? 'var(--success)' : 'var(--text-muted)' }}>
                                        {form.status === 'Open' ? '🟢 Open for Applications' : '🔴 Closed'}
                                    </span>
                                </div>
                                <div className="form-group" style={{ marginTop: 16 }}>
                                    <label className="form-label">HR Round/Drive Date</label>
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                        <input className="form-control" type="date" value={form.interviewDate} onChange={e => set('interviewDate', e.target.value)} style={{ maxWidth: 180 }} />
                                        {form.interviewDate && (
                                            <button type="button" className="btn btn-outline btn-sm" onClick={() => addDriveToCalendar({ ...form, branches, skills }, form.interviewDate)}>
                                                📅 Preview in Calendar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                                <button type="submit" className="btn btn-primary btn-lg">🚀 Post Job</button>
                                <button type="button" className="btn btn-ghost btn-lg" onClick={e => handleSubmit(e, true)}>💾 Save as Draft</button>
                                <button type="button" className="btn btn-ghost btn-lg" onClick={() => navigate('/admin/jobs')}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
