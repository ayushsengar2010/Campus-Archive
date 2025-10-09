import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Theme Toggle Component
 * Toggle between light and dark mode
 */
const ThemeToggle = ({ className = '', size = 'default', variant = 'button' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    default: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    default: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (variant === 'switch') {
    return (
      <button
        onClick={toggleTheme}
        className={`relative inline-flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${sizeClasses[size]} ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {/* Background */}
        <div className={`absolute inset-0 rounded-full transition-colors duration-300 ${
          isDark 
            ? 'bg-gray-600' 
            : 'bg-gray-200'
        }`} />
        
        {/* Toggle Circle */}
        <div className={`relative rounded-full transition-transform duration-300 ${
          isDark 
            ? 'translate-x-3 bg-gray-800' 
            : '-translate-x-3 bg-white'
        } ${size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8'}`} />
        
        {/* Icons */}
        <div className="absolute inset-0 flex items-center justify-between px-1">
          <Sun className={`${iconSizes[size]} text-yellow-500 transition-opacity duration-300 ${
            isDark ? 'opacity-0' : 'opacity-100'
          }`} />
          <Moon className={`${iconSizes[size]} text-blue-400 transition-opacity duration-300 ${
            isDark ? 'opacity-100' : 'opacity-0'
          }`} />
        </div>
      </button>
    );
  }

  // Default button variant
  return (
    <button
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        isDark
          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-offset-gray-900'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-offset-white'
      } ${sizeClasses[size]} ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className={`${iconSizes[size]} transition-transform duration-200 hover:rotate-180`} />
      ) : (
        <Moon className={`${iconSizes[size]} transition-transform duration-200 hover:rotate-12`} />
      )}
    </button>
  );
};

export default ThemeToggle;
