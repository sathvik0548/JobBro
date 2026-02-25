import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS, YEARS } from '../data/mockData';

export default function StudentRegister() {
    const { register } = useApp();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', dept: '', year: '', cgpa: '', password: '', confirm: '', resume: '' });
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    function set(field, val) { setForm(f => ({ ...f, [field]: val })); }

    function addSkill(e) {
        if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
            e.preventDefault();
            if (!skills.includes(skillInput.trim())) setSkills(s => [...s, skillInput.trim()]);
            setSkillInput('');
        }
    }
    function removeSkill(s) { setSkills(prev => prev.filter(x => x !== s)); }

    async function handleSubmit(e) {
        e.preventDefault();
        if (form.password !== form.confirm) return setError('Passwords do not match.');
        if (!form.dept) return setError('Please select a department.');
        if (!form.year) return setError('Please select year of study.');
        const result = await register({
            name: form.name, email: form.email, password: form.password,
            dept: form.dept, year: form.year, cgpa: parseFloat(form.cgpa),
            skills, resume: form.resume,
        });
        if (result.success) setSuccess(true);
        else setError(result.error || 'Server error.');
    }

    if (success) return (
        <div className="register-page">
            <nav className="auth-nav"><span className="auth-nav-logo">🎓 PlacementHub</span></nav>
            <div className="register-body">
                <div className="register-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
                    <h2>Registration Successful!</h2>
                    <p className="sub">Your account has been created. You can now log in.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>Go to Login</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="register-page">
            <nav className="auth-nav">
                <span className="auth-nav-logo">🎓 PlacementHub</span>
                <span style={{ marginLeft: 'auto', color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }} onClick={() => navigate('/')}>← Back to Login</span>
            </nav>
            <div className="register-body">
                <div className="register-card">
                    <h2>Create Your Account</h2>
                    <p className="sub">Fill in your academic details to get started</p>
                    {error && <div className="alert alert-error mb-3">{error}</div>}
                    <form className="register-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Rahul Sharma" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address *</label>
                                <input className="form-control" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="rahul@college.edu" required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Department *</label>
                                <select className="form-control" value={form.dept} onChange={e => set('dept', e.target.value)}>
                                    <option value="">Select department</option>
                                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Year of Study *</label>
                                <select className="form-control" value={form.year} onChange={e => set('year', e.target.value)}>
                                    <option value="">Select year</option>
                                    {YEARS.map(y => <option key={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">CGPA (out of 10) *</label>
                            <input className="form-control" type="number" min="0" max="10" step="0.1" value={form.cgpa} onChange={e => set('cgpa', e.target.value)} placeholder="8.5" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Skills <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(press Enter or comma to add)</span></label>
                            <div className="tags-input-wrap">
                                {skills.map(s => (
                                    <span key={s} className="tag-item">{s} <span className="tag-remove" onClick={() => removeSkill(s)}>✕</span></span>
                                ))}
                                <input
                                    className="tag-input-field"
                                    value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyDown={addSkill}
                                    placeholder={skills.length === 0 ? 'Python, React, Java...' : ''}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Resume Link <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(Google Drive / optional)</span></label>
                            <input className="form-control" value={form.resume} onChange={e => set('resume', e.target.value)} placeholder="https://drive.google.com/..." />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Password *</label>
                                <input className="form-control" type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm Password *</label>
                                <input className="form-control" type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="••••••••" required />
                            </div>
                        </div>
                        <button className="btn btn-primary btn-lg w-full" type="submit">🎓 Create Account</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
