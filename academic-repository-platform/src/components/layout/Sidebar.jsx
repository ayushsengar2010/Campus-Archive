import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Upload,
  FileText,
  Users,
  Settings,
  BookOpen,
  BarChart3,
  Search,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants';
import logoImage from '../../assets/images/logo.png';

const getNavigationItems = (role) => {
  const baseItems = [
    { name: 'Dashboard', href: getDashboardRoute(role), icon: Home },
    { name: 'Repository', href: ROUTES.REPOSITORY, icon: Search },
  ];

  const roleItems = {
    student: [
      { name: 'My Submissions', href: '/student/submissions', icon: FileText },
    ],
    faculty: [
      { name: 'Review Queue', href: '/faculty/reviews', icon: FileText },
      { name: 'My Students', href: '/faculty/students', icon: Users },
      { name: 'Analytics', href: '/faculty/analytics', icon: BarChart3 },
    ],
    admin: [
      { name: 'All Submissions', href: '/admin/submissions', icon: FileText },
      { name: 'User Management', href: '/admin/users', icon: Users },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ],
    researcher: [
      { name: 'Upload Research', href: '/researcher/upload', icon: Upload },
      { name: 'My Research', href: '/researcher/papers', icon: BookOpen },
    ],
  };

  return [...baseItems, ...(roleItems[role] || [])];
};

const getDashboardRoute = (role) => {
  const routes = {
    student: ROUTES.STUDENT_DASHBOARD,
    faculty: ROUTES.FACULTY_DASHBOARD,
    admin: ROUTES.ADMIN_DASHBOARD,
    researcher: ROUTES.RESEARCHER_DASHBOARD,
  };
  return routes[role] || ROUTES.HOME;
};

const Sidebar = ({ isOpen = true, onClose, isCollapsed = false, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navigationItems = getNavigationItems(user.role);
  const isActiveRoute = (href) => location.pathname === href || location.pathname.startsWith(href + '/');

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-50 ${sidebarWidth} h-full bg-white border-r border-gray-200 shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header Section with Logo and Collapse Button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8">
                  <img 
                    src={logoImage} 
                    alt="BMU Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-gray-900">BMU Repository</h1>
                </div>
              </div>
            )}
            
            {isCollapsed && (
              <div className="w-8 h-8 mx-auto">
                <img 
                  src={logoImage} 
                  alt="BMU Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Desktop collapse button */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Section */}
          <div className={`${isCollapsed ? 'p-3' : 'p-6'} border-b border-gray-200 bg-gray-50`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-sm font-semibold text-white">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-blue-600 capitalize font-medium">{user.role}</p>
                  <p className="text-xs text-gray-500 truncate">{user.department}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} py-6 space-y-2 overflow-y-auto`}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center ${isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'} text-sm font-medium rounded-xl transition-all duration-200 group relative ${isActive
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  title={isCollapsed ? item.name : ''}
                >
                  <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {!isCollapsed && item.name}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-t border-gray-200`}>
            <button
              onClick={handleLogout}
              className={`flex items-center w-full ${isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'} text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors group relative`}
              title={isCollapsed ? 'Sign Out' : ''}
            >
              <LogOut className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && 'Sign Out'}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Sign Out
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;