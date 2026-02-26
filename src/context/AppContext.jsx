import { createContext, useContext, useState, useEffect } from 'react';
import initialDb from '../../db.json';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('ph_user')) || null; } catch { return null; }
    });

    // Load local db or initialize with db.json data
    const [db, setDb] = useState(() => {
        try {
            const local = JSON.parse(localStorage.getItem('jobbro_db'));
            if (local && local.users && local.jobs) return local;
        } catch (e) { }

        localStorage.setItem('jobbro_db', JSON.stringify(initialDb));
        return initialDb;
    });

    const [loading, setLoading] = useState(true);

    // Derived states
    const jobs = db.jobs || [];
    const applications = db.applications || [];
    const students = (db.users || []).filter(u => u.role === 'student');
    const notifications = db.notifications || [];

    useEffect(() => {
        // Give a tiny simulated network delay on load
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const saveDb = (newDb) => {
        setDb(newDb);
        localStorage.setItem('jobbro_db', JSON.stringify(newDb));
    };

    async function login(email, password) {
        setLoading(true);
        // Simulate network delay
        await new Promise(r => setTimeout(r, 600));
        setLoading(false);

        const foundUser = db.users.find(u => u.email === email && u.password === password);
        if (foundUser) {
            const u = { ...foundUser };
            delete u.password;
            setUser(u);
            localStorage.setItem('ph_user', JSON.stringify(u));
            return { success: true, role: u.role };
        }
        return { success: false, error: 'Invalid email or password.' };
    }

    function logout() {
        setUser(null);
        localStorage.removeItem('ph_user');
    }

    async function register(data) {
        setLoading(true);
        await new Promise(r => setTimeout(r, 600));
        setLoading(false);

        const exists = db.users.some(u => u.email === data.email);
        if (exists) return { success: false, error: 'Email already registered.' };

        const newStudent = {
            id: 's' + Date.now(),
            role: 'student',
            ...data,
        };

        const newDb = { ...db, users: [...db.users, newStudent] };
        saveDb(newDb);
        return { success: true };
    }

    async function applyToJob(jobId, extraData = {}) {
        if (!user) return { success: false };
        const already = db.applications.find(a => a.jobId === jobId && a.studentId === user.id);
        if (already) return { success: false, error: 'Already applied.' };

        const newApp = {
            id: 'ap' + Date.now(),
            studentId: user.id,
            jobId,
            appliedDate: new Date().toISOString().split('T')[0],
            status: 'Applied',
            ...extraData
        };

        const newDb = { ...db, applications: [...db.applications, newApp] };
        saveDb(newDb);
        return { success: true };
    }

    async function updateApplicationStatus(appId, newStatus) {
        const newApps = db.applications.map(a =>
            a.id === appId ? { ...a, status: newStatus } : a
        );
        saveDb({ ...db, applications: newApps });
    }

    async function addJob(jobData) {
        const newJob = { id: 'j' + Date.now(), ...jobData, postedDate: new Date().toISOString().split('T')[0] };
        saveDb({ ...db, jobs: [newJob, ...db.jobs] });
        return newJob;
    }

    async function updateJob(jobId, updates) {
        const newJobs = db.jobs.map(j => j.id === jobId ? { ...j, ...updates } : j);
        saveDb({ ...db, jobs: newJobs });
    }

    async function deleteJob(jobId) {
        const newJobs = db.jobs.filter(j => j.id !== jobId);
        const newApps = db.applications.filter(a => a.jobId !== jobId);
        saveDb({ ...db, jobs: newJobs, applications: newApps });
    }

    async function updateUser(userId, updates) {
        const newUsers = db.users.map(u => u.id === userId ? { ...u, ...updates } : u);
        saveDb({ ...db, users: newUsers });

        // Update current session user if they updated their own profile
        if (user?.id === userId) {
            const updatedUser = newUsers.find(u => u.id === userId);
            const sessionUser = { ...updatedUser };
            delete sessionUser.password;
            setUser(sessionUser);
            localStorage.setItem('ph_user', JSON.stringify(sessionUser));
        }
        return { success: true };
    }

    async function markAllNotificationsAsRead(studentId) {
        const newNotifications = db.notifications.map(n =>
            n.studentId === studentId ? { ...n, read: true } : n
        );
        saveDb({ ...db, notifications: newNotifications });
    }

    async function addNotification(notif) {
        const newNotif = {
            id: 'n' + Date.now(),
            date: new Date().toISOString(),
            read: false,
            ...notif
        };
        saveDb({ ...db, notifications: [newNotif, ...db.notifications] });
    }

    function getStudentApplications(studentId) {
        return applications
            .filter(a => a.studentId === studentId)
            .map(a => ({ ...a, job: jobs.find(j => j.id === a.jobId) }));
    }

    function getJobApplicants(jobId) {
        return applications
            .filter(a => a.jobId === jobId)
            .map(a => ({ ...a, student: students.find(s => s.id === a.studentId) }));
    }

    function hasApplied(jobId) {
        return applications.some(a => a.jobId === jobId && a.studentId === user?.id);
    }

    return (
        <AppContext.Provider value={{
            user, jobs, applications, students, notifications, loading,
            login, logout, register,
            applyToJob, updateApplicationStatus,
            addJob, updateJob, deleteJob,
            updateUser,
            markAllNotificationsAsRead, addNotification,
            getStudentApplications, getJobApplicants, hasApplied,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
