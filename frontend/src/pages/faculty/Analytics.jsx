import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ArrowLeft,
  PieChart,
  Activity,
  Target
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { StatsGrid } from '../../components/ui/DashboardCard';
import { useAuth } from '../../hooks/useAuth';

const FacultyAnalytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalyticsData({
        overview: {
          totalReviews: 156,
          avgResponseTime: 2.3,
          approvalRate: 78,
          activeStudents: 45
        },
        reviewStats: {
          approved: 122,
          rejected: 18,
          resubmit: 16,
          pending: 8
        },
        monthlyTrends: [
          { month: 'Jan', reviews: 45, avgTime: 2.1 },
          { month: 'Feb', reviews: 52, avgTime: 2.4 },
          { month: 'Mar', reviews: 38, avgTime: 1.9 },
          { month: 'Apr', reviews: 61, avgTime: 2.8 },
          { month: 'May', reviews: 47, avgTime: 2.2 },
          { month: 'Jun', reviews: 39, avgTime: 2.0 }
        ],
        workloadDistribution: [
          { course: 'CS 401', submissions: 45, avgGrade: 'B+' },
          { course: 'CS 301', submissions: 38, avgGrade: 'A-' },
          { course: 'CS 201', submissions: 52, avgGrade: 'B' },
          { course: 'CS 101', submissions: 21, avgGrade: 'A' }
        ],
        upcomingDeadlines: [
          { title: 'Final Project Reviews', course: 'CS 401', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), count: 15 },
          { title: 'Assignment Grading', course: 'CS 301', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), count: 12 },
          { title: 'Midterm Reviews', course: 'CS 201', dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), count: 18 }
        ]
      });
      
      setLoading(false);
    };

    loadAnalyticsData();
  }, [timeRange]);

  const exportReport = () => {
    // Simulate report export
    const reportData = {
      faculty: user?.name,
      period: timeRange,
      generated: new Date().toISOString(),
      ...analyticsData
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faculty-analytics-${timeRange}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getDaysUntil = (date) => {
    const days = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading analytics...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const stats = [
    {
      title: 'Total Reviews',
      value: analyticsData.overview.totalReviews,
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'primary',
      trend: '+12%'
    },
    {
      title: 'Avg Response Time',
      value: `${analyticsData.overview.avgResponseTime} days`,
      icon: <Clock className="h-5 w-5" />,
      color: 'warning',
      trend: '-0.3 days'
    },
    {
      title: 'Approval Rate',
      value: `${analyticsData.overview.approvalRate}%`,
      icon: <Target className="h-5 w-5" />,
      color: 'success',
      trend: '+5%'
    },
    {
      title: 'Active Students',
      value: analyticsData.overview.activeStudents,
      icon: <Users className="h-5 w-5" />,
      color: 'info',
      trend: '+3'
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/faculty"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Faculty Analytics</h1>
              <p className="text-gray-600">Performance insights and review statistics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
            </select>
            
            <button
              onClick={exportReport}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsGrid stats={stats} columns={4} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Review Status Distribution */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-purple-600" />
                Review Status Distribution
              </h3>
            </div>
            
            <div className="space-y-4">
              {Object.entries(analyticsData.reviewStats).map(([status, count]) => {
                const total = Object.values(analyticsData.reviewStats).reduce((a, b) => a + b, 0);
                const percentage = Math.round((count / total) * 100);
                const colors = {
                  approved: 'bg-green-500',
                  rejected: 'bg-red-500',
                  resubmit: 'bg-yellow-500',
                  pending: 'bg-gray-500'
                };
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${colors[status]}`}></div>
                      <span className="text-sm font-medium capitalize">{status}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{count}</span>
                      <span className="text-xs text-gray-400">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                Monthly Review Trends
              </h3>
            </div>
            
            <div className="space-y-3">
              {analyticsData.monthlyTrends.map((month) => (
                <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium w-8">{month.month}</span>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(month.reviews / 70) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{month.reviews}</p>
                    <p className="text-xs text-gray-500">{month.avgTime}d avg</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workload and Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Workload Distribution */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold flex items-center">
                <Activity className="h-5 w-5 mr-2 text-purple-600" />
                Course Workload Distribution
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData.workloadDistribution.map((course) => (
                  <div key={course.course} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{course.course}</p>
                      <p className="text-sm text-gray-500">{course.submissions} submissions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-purple-600">{course.avgGrade}</p>
                      <p className="text-xs text-gray-500">Avg Grade</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                Upcoming Review Deadlines
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData.upcomingDeadlines.map((deadline, index) => {
                  const daysUntil = getDaysUntil(deadline.dueDate);
                  const urgencyColor = daysUntil <= 2 ? 'text-red-600 bg-red-50' : 
                                     daysUntil <= 5 ? 'text-yellow-600 bg-yellow-50' : 
                                     'text-green-600 bg-green-50';
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg ${urgencyColor}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{deadline.title}</p>
                          <p className="text-sm opacity-75">{deadline.course} • {deadline.count} items</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatDate(deadline.dueDate)}</p>
                          <p className="text-xs opacity-75">
                            {daysUntil === 0 ? 'Today' : 
                             daysUntil === 1 ? 'Tomorrow' : 
                             `${daysUntil} days`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Target className="h-5 w-5 mr-2 text-purple-600" />
            Performance Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {analyticsData.overview.approvalRate}%
              </div>
              <p className="text-sm text-green-700 font-medium">Approval Rate</p>
              <p className="text-xs text-green-600 mt-1">Above department average</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {analyticsData.overview.avgResponseTime}
              </div>
              <p className="text-sm text-blue-700 font-medium">Avg Response (days)</p>
              <p className="text-xs text-blue-600 mt-1">0.3 days faster than last month</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {Math.round(analyticsData.overview.totalReviews / 6)}
              </div>
              <p className="text-sm text-purple-700 font-medium">Reviews per Month</p>
              <p className="text-xs text-purple-600 mt-1">Consistent workload</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default FacultyAnalytics;