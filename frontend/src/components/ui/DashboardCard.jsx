import { TrendingUp, TrendingDown } from 'lucide-react';

const DashboardCard = ({
  title,
  value,
  icon,
  color = 'primary',
  trend,
  description,
  onClick,
  className = '',
}) => {
  const colors = {
    primary: 'bg-blue-100 text-blue-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    error: 'bg-red-100 text-red-600',
    info: 'bg-indigo-100 text-indigo-600',
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-6 ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && (
          <div className={`p-2 rounded-lg ${colors[color] || colors.primary}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mb-2">
        <p className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>

      <div className="flex items-center justify-between">
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
        
        {trend && (
          <div className="flex items-center space-x-1">
            {trend.direction === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const StatsGrid = ({ stats = [], className = '', columns = 4 }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-4 ${gridCols[columns]} ${className}`}>
      {stats.map((stat, index) => (
        <DashboardCard key={stat.id || index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardCard;