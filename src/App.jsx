import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import StudentRegister from './pages/StudentRegister';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import BrowseJobs from './pages/student/BrowseJobs';
import JobDetail from './pages/student/JobDetail';
import MyApplications from './pages/student/MyApplications';
import StudentProfile from './pages/student/StudentProfile';
import Notifications from './pages/student/Notifications';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PostJob from './pages/admin/PostJob';
import ManageJobs from './pages/admin/ManageJobs';
import ManageApplicants from './pages/admin/ManageApplicants';
import DatabaseConsole from './pages/admin/DatabaseConsole';
import AdminProfile from './pages/admin/AdminProfile';
import Analytics from './pages/admin/Analytics';

function ProtectedRoute({ children, role }) {
    const { user } = useApp();
    if (!user) return <Navigate to="/" replace />;
    if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
    return children;
}

function AppRoutes() {
    const { user } = useApp();
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace /> : <Login />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace /> : <Login />} />
            <Route path="/register" element={<StudentRegister />} />

            {/* Student */}
            <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/jobs" element={<ProtectedRoute role="student"><BrowseJobs /></ProtectedRoute>} />
            <Route path="/student/jobs/:id" element={<ProtectedRoute role="student"><JobDetail /></ProtectedRoute>} />
            <Route path="/student/applications" element={<ProtectedRoute role="student"><MyApplications /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />
            <Route path="/student/notifications" element={<ProtectedRoute role="student"><Notifications /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/post-job" element={<ProtectedRoute role="admin"><PostJob /></ProtectedRoute>} />
            <Route path="/admin/jobs" element={<ProtectedRoute role="admin"><ManageJobs /></ProtectedRoute>} />
            <Route path="/admin/applications" element={<ProtectedRoute role="admin"><ManageApplicants /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><Analytics /></ProtectedRoute>} />
            <Route path="/admin/database" element={<ProtectedRoute role="admin"><DatabaseConsole /></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute role="admin"><AdminProfile /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AppProvider>
    );
}
