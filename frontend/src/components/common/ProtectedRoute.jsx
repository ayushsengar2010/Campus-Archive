import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { ROUTES } from '../../constants';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Optionally checks for specific roles
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string|string[]} [props.allowedRoles] - Allowed roles for this route
 * @param {string} [props.redirectTo] - Custom redirect path (defaults to login)
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = null, 
  redirectTo = ROUTES.LOGIN 
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access if roles are specified
  if (allowedRoles) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    if (!roles.includes(user.role)) {
      // Redirect to appropriate dashboard based on user's actual role
      const userDashboard = getRoleBasedDashboard(user.role);
      return <Navigate to={userDashboard} replace />;
    }
  }

  // Render children if all checks pass
  return children;
};

/**
 * Get dashboard route based on user role
 * @param {string} role - User role
 * @returns {string} Dashboard route
 */
const getRoleBasedDashboard = (role) => {
  switch (role) {
    case 'student':
      return ROUTES.STUDENT_DASHBOARD;
    case 'faculty':
      return ROUTES.FACULTY_DASHBOARD;
    case 'admin':
      return ROUTES.ADMIN_DASHBOARD;
    case 'researcher':
      return ROUTES.RESEARCHER_DASHBOARD;
    default:
      return ROUTES.HOME;
  }
};

export default ProtectedRoute;