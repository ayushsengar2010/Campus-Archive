import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ROUTES } from './constants';

// Layout components
import AppLayout from './components/layout/AppLayout';

// Auth components
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/common/ProtectedRoute';

// Student dashboard components
import StudentDashboard from './pages/student/Dashboard';
import StudentClassroom from './pages/student/Classroom';
import SubmitProject from './pages/student/SubmitProject';
import StudentSubmissions from './pages/student/Submissions';

// Faculty dashboard components
import FacultyDashboard from './pages/faculty/Dashboard';
import FacultyAnalytics from './pages/faculty/Analytics';

// Admin dashboard components
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import DeadlineManagement from './pages/admin/DeadlineManagement';
import AuditLogs from './pages/admin/AuditLogs';

// Researcher dashboard components
import ResearcherDashboard from './pages/researcher/Dashboard';
import UploadPaper from './pages/researcher/UploadPaper';
import Portfolio from './pages/researcher/Portfolio';
import Collaborations from './pages/researcher/Collaborations';
import Profile from './pages/researcher/Profile';





/**
 * Home component that redirects based on authentication status
 */
const Home = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Redirect to appropriate dashboard based on user role
  switch (user?.role) {
    case 'student':
      return <Navigate to={ROUTES.STUDENT_DASHBOARD} replace />;
    case 'faculty':
      return <Navigate to={ROUTES.FACULTY_DASHBOARD} replace />;
    case 'admin':
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
    case 'researcher':
      return <Navigate to={ROUTES.RESEARCHER_DASHBOARD} replace />;
    default:
      return <Navigate to={ROUTES.LOGIN} replace />;
  }
};

/**
 * Main App Component
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 overflow-y-auto">
          <Routes>
            {/* Public routes */}
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            
            {/* Protected routes */}
            {/* Student Routes */}
            <Route 
              path={ROUTES.STUDENT_DASHBOARD} 
              element={
                <ProtectedRoute allowedRoles="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/classroom" 
              element={
                <ProtectedRoute allowedRoles="student">
                  <StudentClassroom />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/submit" 
              element={
                <ProtectedRoute allowedRoles="student">
                  <SubmitProject />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/submissions" 
              element={
                <ProtectedRoute allowedRoles="student">
                  <StudentSubmissions />
                </ProtectedRoute>
              } 
            />
            
            {/* Repository Route - placeholder */}
            <Route 
              path="/repository" 
              element={
                <ProtectedRoute allowedRoles={['student', 'faculty', 'admin', 'researcher']}>
                  <AppLayout>
                    <div className="bg-white rounded-lg shadow p-6">
                      <h1 className="text-2xl font-bold text-gray-900">Repository</h1>
                      <p className="text-gray-600">Repository page coming soon...</p>
                    </div>
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path={ROUTES.FACULTY_DASHBOARD} 
              element={
                <ProtectedRoute allowedRoles="faculty">
                  <FacultyDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/faculty/analytics" 
              element={
                <ProtectedRoute allowedRoles="faculty">
                  <FacultyAnalytics />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path={ROUTES.ADMIN_DASHBOARD} 
              element={
                <ProtectedRoute allowedRoles="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute allowedRoles="admin">
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/deadlines" 
              element={
                <ProtectedRoute allowedRoles="admin">
                  <DeadlineManagement />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/audit" 
              element={
                <ProtectedRoute allowedRoles="admin">
                  <AuditLogs />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path={ROUTES.RESEARCHER_DASHBOARD} 
              element={
                <ProtectedRoute allowedRoles="researcher">
                  <ResearcherDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/researcher/upload" 
              element={
                <ProtectedRoute allowedRoles="researcher">
                  <UploadPaper />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/researcher/portfolio" 
              element={
                <ProtectedRoute allowedRoles="researcher">
                  <Portfolio />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/researcher/collaborations" 
              element={
                <ProtectedRoute allowedRoles="researcher">
                  <Collaborations />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/researcher/profile" 
              element={
                <ProtectedRoute allowedRoles="researcher">
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Home route */}
            <Route path={ROUTES.HOME} element={<Home />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;