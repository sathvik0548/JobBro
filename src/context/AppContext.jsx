import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);
const BASE_URL = 'http://localhost:3000';

export function AppProvider({ children }) {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('ph_user')) || null; } catch { return null; }
    });
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [jobsRes, appsRes, usersRes] = await Promise.all([
                    fetch(`${BASE_URL}/jobs`),
                    fetch(`${BASE_URL}/applications`),
                    fetch(`${BASE_URL}/users`)
                ]);

                const jobsData = await jobsRes.json();
                const appsData = await appsRes.json();
                const usersData = await usersRes.json();

                setJobs(jobsData);
                setApplications(appsData);
                setStudents(usersData.filter(u => u.role === 'student'));
            } catch (error) {
                console.error('Failed to load data from server:', error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const fetchData = async () => {
        try {
            const [jobsRes, appsRes, usersRes] = await Promise.all([
                fetch(`${BASE_URL}/jobs`),
                fetch(`${BASE_URL}/applications`),
                fetch(`${BASE_URL}/users`)
            ]);
            setJobs(await jobsRes.json());
            setApplications(await appsRes.json());
            const usersData = await usersRes.json();
            setStudents(usersData.filter(u => u.role === 'student'));
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    async function login(email, password) {
        try {
            const res = await fetch(`${BASE_URL}/users?email=${email}&password=${password}`);
            const data = await res.json();
            if (data.length > 0) {
                const u = { ...data[0] };
                delete u.password;
                setUser(u);
                localStorage.setItem('ph_user', JSON.stringify(u));
                return { success: true, role: u.role };
            }
            return { success: false, error: 'Invalid email or password.' };
        } catch (error) {
            return { success: false, error: 'Server error. Please try again later.' };
        }
    }

    function logout() {
        setUser(null);
        localStorage.removeItem('ph_user');
    }

    async function register(data) {
        try {
            const existsRes = await fetch(`${BASE_URL}/users?email=${data.email}`);
            const existsData = await existsRes.json();
            if (existsData.length > 0) return { success: false, error: 'Email already registered.' };

            const newStudent = {
                id: 's' + Date.now(),
                role: 'student',
                ...data,
            };

            const res = await fetch(`${BASE_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStudent)
            });

            if (res.ok) {
                await fetchData();
                return { success: true };
            }
            return { success: false, error: 'Registration failed.' };
        } catch (error) {
            return { success: false, error: 'Server error.' };
        }
    }

    async function applyToJob(jobId) {
        if (!user) return { success: false };
        const already = applications.find(a => a.jobId === jobId && a.studentId === user.id);
        if (already) return { success: false, error: 'Already applied.' };

        const newApp = {
            id: 'ap' + Date.now(),
            studentId: user.id,
            jobId,
            appliedDate: new Date().toISOString().split('T')[0],
            status: 'Applied',
        };

        try {
            const res = await fetch(`${BASE_URL}/applications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newApp)
            });
            if (res.ok) {
                await fetchData();
                return { success: true };
            }
        } catch (error) {
            return { success: false, error: 'Could not apply. Try again.' };
        }
    }

    async function updateApplicationStatus(appId, newStatus) {
        try {
            await fetch(`${BASE_URL}/applications/${appId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            await fetchData();
        } catch (error) {
            console.error('Status update failed:', error);
        }
    }

    async function addJob(jobData) {
        const newJob = { id: 'j' + Date.now(), ...jobData, postedDate: new Date().toISOString().split('T')[0] };
        try {
            const res = await fetch(`${BASE_URL}/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newJob)
            });
            await fetchData();
            return newJob;
        } catch (error) {
            console.error('Add job failed:', error);
        }
    }

    async function updateJob(jobId, updates) {
        try {
            await fetch(`${BASE_URL}/jobs/${jobId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            await fetchData();
        } catch (error) {
            console.error('Update job failed:', error);
        }
    }

    async function deleteJob(jobId) {
        try {
            await fetch(`${BASE_URL}/jobs/${jobId}`, { method: 'DELETE' });
            // Note: Applications linked to this job should be deleted too if we want strict consistency
            // but json-server doesn't do cascading deletes. We'll handle it manually for the demo.
            const jobApps = applications.filter(a => a.jobId === jobId);
            await Promise.all(jobApps.map(a => fetch(`${BASE_URL}/applications/${a.id}`, { method: 'DELETE' })));
            await fetchData();
        } catch (error) {
            console.error('Delete job failed:', error);
        }
    }

    async function updateStudent(studentId, updates) {
        try {
            const res = await fetch(`${BASE_URL}/users/${studentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            if (res.ok) {
                const updatedUser = await res.json();
                if (user?.id === studentId) {
                    const sessionUser = { ...updatedUser };
                    delete sessionUser.password;
                    setUser(sessionUser);
                    localStorage.setItem('ph_user', JSON.stringify(sessionUser));
                }
                await fetchData();
                return { success: true };
            }
            return { success: false, error: 'Update failed' };
        } catch (error) {
            console.error('Update student failed:', error);
            return { success: false, error: 'Server error' };
        }
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
            user, jobs, applications, students, loading,
            login, logout, register,
            applyToJob, updateApplicationStatus,
            addJob, updateJob, deleteJob,
            updateStudent,
            getStudentApplications, getJobApplicants, hasApplied,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}

