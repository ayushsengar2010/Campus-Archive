import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumb navigation component
 * Automatically generates breadcrumbs based on current route
 * 
 * @param {Object} props - Component props
 * @param {Array} [props.items] - Custom breadcrumb items
 * @param {string} [props.className] - Additional CSS classes
 */
const Breadcrumb = ({ items = null, className = '' }) => {
  const location = useLocation();

  /**
   * Generate breadcrumb items from current path
   */
  const generateBreadcrumbs = () => {
    if (items) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { name: 'Dashboard', href: '/', icon: Home }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Convert segment to readable name
      const name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        name,
        href: currentPath,
        current: index === pathSegments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs for root pages
  }

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" />
            )}

            <div className="flex items-center">
              {item.icon && (
                <item.icon className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
              )}

              {item.current ? (
                <span className="text-sm font-medium text-gray-900">
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;