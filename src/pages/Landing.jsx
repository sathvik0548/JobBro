import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Landing() {
    const [mode, setMode] = useState(null); // null | 'student' | 'admin'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useApp();
    const navigate = useNavigate();

    function fillDemo(role) {
        if (role === 'student') { setEmail('rahul@college.edu'); setPassword('123456'); }
        else { setEmail('admin@placement.edu'); setPassword('123456'); }
    }

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await login(email, password);
        setLoading(false);
        if (result.success) {
            navigate(result.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
        } else {
            setError(result.error);
        }
    }

    return (
        <div className="auth-page">
            <nav className="auth-nav">
                <span className="auth-nav-logo">🎓 PlacementHub</span>
                <span style={{ marginLeft: 10, fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--primary-muted)', padding: '2px 10px', borderRadius: 99, fontWeight: 600 }}>College Placement Portal</span>
            </nav>

            <div className="auth-body">
                {!mode ? (
                    <>
                        <div className="auth-hero">
                            <h1>Your Gateway to<br /><span style={{ color: 'var(--primary)' }}>Career Opportunities</span></h1>
                            <p>Connecting students with top companies through a streamlined placement process</p>
                        </div>
                        <div className="auth-cards">
                            <div className="auth-card" onClick={() => { setMode('student'); fillDemo('student'); }}>
                                <div className="auth-card-icon">🎓</div>
                                <div className="auth-card-title">Student Login</div>
                                <div className="auth-card-desc">Browse jobs, apply to opportunities, and track your application status</div>
                                <button className="btn btn-primary w-full">Login as Student</button>
                            </div>
                            <div className="auth-card" onClick={() => { setMode('admin'); fillDemo('admin'); }}>
                                <div className="auth-card-icon">🏛️</div>
                                <div className="auth-card-title">Placement Cell</div>
                                <div className="auth-card-desc">Post jobs, manage applicants, and update application statuses</div>
                                <button className="btn btn-outline w-full">Login as Admin</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ background: '#fff', borderRadius: 16, padding: 36, width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
                        <button onClick={() => { setMode(null); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, marginBottom: 20, cursor: 'pointer', fontSize: '0.875rem' }}>← Back</button>
                        <div style={{ fontSize: '2rem', marginBottom: 8 }}>{mode === 'admin' ? '🏛️' : '🎓'}</div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>{mode === 'admin' ? 'Placement Cell Login' : 'Student Login'}</h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 24 }}>Enter your credentials to continue</p>

                        {error && <div className="alert alert-error mb-3">{error}</div>}

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                            </div>
                            <button className="btn btn-primary w-full btn-lg" type="submit" disabled={loading}>
                                {loading ? '⏳ Logging in...' : '🔐 Login'}
                            </button>
                        </form>

                        {mode === 'student' && (
                            <p style={{ marginTop: 16, textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                New student?{' '}
                                <span style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/register')}>Register here</span>
                            </p>
                        )}
                        <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--bg-page)', borderRadius: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            💡 Demo: <b>{mode === 'student' ? 'rahul@college.edu' : 'admin@placement.edu'}</b> / <b>123456</b>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
