/**
 * Loading Spinner Component
 * @param {Object} props - Component props
 * @param {string} [props.size] - Size of spinner ('sm', 'md', 'lg')
 * @param {string} [props.className] - Additional CSS classes
 */
const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]} ${className}`} />
  );
};

export default LoadingSpinner;