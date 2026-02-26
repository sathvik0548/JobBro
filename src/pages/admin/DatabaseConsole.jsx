import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Sidebar';

export default function DatabaseConsole() {
    const { user, db, saveDb, loading: appLoading } = useApp();
    const navigate = useNavigate();
    const [collection, setCollection] = useState('jobs');
    const [data, setData] = useState([]);
    const [editing, setEditing] = useState(null); // { id, field }
    const [editValue, setEditValue] = useState('');

    const collections = ['users', 'jobs', 'applications', 'notifications'];

    useEffect(() => {
        if (db && db[collection]) {
            setData(db[collection]);
        }
    }, [collection, db]);

    const handleSave = async (id, field) => {
        try {
            const updatedCollection = data.map(item => {
                if (item.id === id) {
                    let finalValue = editValue;
                    // Try to parse if it looks like JSON array or object
                    if ((editValue.startsWith('[') && editValue.endsWith(']')) ||
                        (editValue.startsWith('{') && editValue.endsWith('}'))) {
                        try { finalValue = JSON.parse(editValue); } catch (e) { }
                    }
                    return { ...item, [field]: finalValue };
                }
                return item;
            });

            const newDb = { ...db, [collection]: updatedCollection };
            saveDb(newDb);
            setEditing(null);
        } catch (err) {
            alert('Failed to save changes');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        try {
            const updatedCollection = data.filter(item => item.id !== id);
            const newDb = { ...db, [collection]: updatedCollection };
            saveDb(newDb);
        } catch (err) {
            alert('Delete failed');
        }
    };

    if (appLoading) return <div style={{ padding: 40 }}>Loading application...</div>;

    const headers = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content">
                <header className="topbar">
                    <div className="topbar-title">Database Console</div>
                    <div className="topbar-user" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/profile')}>
                        <div className="avatar">
                            {user.avatar ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name[0]}
                        </div>
                        <span>{user.name}</span>
                    </div>
                </header>
                <div className="page-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <div>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>🗄️ Database Console</h1>
                            <p style={{ color: 'var(--text-secondary)' }}>Live editable view of local storage database. Changes persist in your browser.</p>
                        </div>
                        <div style={{ display: 'flex', gap: 8, background: 'var(--bg-card)', padding: 6, borderRadius: 8, border: '1px solid var(--border-color)' }}>
                            {collections.map(c => (
                                <button
                                    key={c}
                                    className={`btn btn-sm ${collection === c ? 'btn-primary' : 'btn-ghost'}`}
                                    onClick={() => setCollection(c)}
                                >
                                    {c.charAt(0).toUpperCase() + c.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                                <thead style={{ background: 'var(--bg-page)', borderBottom: '2px solid var(--border-color)' }}>
                                    <tr>
                                        {headers.map(h => (
                                            <th key={h} style={{ padding: '16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                                {h}
                                            </th>
                                        ))}
                                        <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, idx) => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)' }}>
                                            {headers.map(h => (
                                                <td key={h} style={{ padding: '12px 16px', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {editing?.id === item.id && editing?.field === h && h !== 'id' ? (
                                                        <div style={{ display: 'flex', gap: 6 }}>
                                                            <input
                                                                className="form-control"
                                                                style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                                                                value={editValue}
                                                                onChange={e => setEditValue(e.target.value)}
                                                                autoFocus
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Enter') handleSave(item.id, h);
                                                                    if (e.key === 'Escape') setEditing(null);
                                                                }}
                                                            />
                                                            <button className="btn btn-primary btn-sm" onClick={() => handleSave(item.id, h)}>✓</button>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="db-cell"
                                                            style={{ cursor: h === 'id' ? 'default' : 'pointer' }}
                                                            onClick={() => {
                                                                if (h !== 'id') {
                                                                    setEditing({ id: item.id, field: h });
                                                                    setEditValue(typeof item[h] === 'object' ? JSON.stringify(item[h]) : String(item[h] ?? ''));
                                                                }
                                                            }}
                                                        >
                                                            {typeof item[h] === 'object' ? `[${Object.keys(item[h] || {}).length} items]` : String(item[h] ?? '--')}
                                                        </div>
                                                    )}
                                                </td>
                                            ))}
                                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(item.id)}>🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {data.length === 0 && (
                            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                                No records found in this collection.
                            </div>
                        )}
                    </div>

                    <style>{`
                        .db-cell:hover {
                            color: var(--primary);
                            text-decoration: underline;
                        }
                    `}</style>
                </div>
            </div>
        </div>
    );
}
