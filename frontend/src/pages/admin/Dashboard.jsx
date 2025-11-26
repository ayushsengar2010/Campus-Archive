import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
  Server,
  Database,
  Shield,
  Settings,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { StatsGrid } from '../../components/ui/DashboardCard';
import DataTable from '../../components/ui/DataTable';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../services/apiService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [systemData, setSystemData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const loadSystemData = async () => {
      setLoading(true);
      
      try {
        // Fetch real data from backend
        const [users, classrooms, submissions] = await Promise.all([
          apiService.getUsers(),
          apiService.getClassrooms(),
          apiService.getSubmissions()
        ]);

        // Calculate stats from real data
        const userArray = Array.isArray(users) ? users : [];
        const classroomArray = Array.isArray(classrooms) ? classrooms : [];
        const submissionArray = Array.isArray(submissions) ? submissions : [];

        const userStats = {
          students: userArray.filter(u => u.role === 'student').length,
          faculty: userArray.filter(u => u.role === 'faculty').length,
          researchers: userArray.filter(u => u.role === 'researcher').length,
          admins: userArray.filter(u => u.role === 'admin').length
        };

        const submissionStats = {
          approved: submissionArray.filter(s => s.status === 'accepted').length,
          pending: submissionArray.filter(s => s.status === 'submitted' || s.status === 'pending').length,
          rejected: submissionArray.filter(s => s.status === 'rejected').length,
          resubmit: submissionArray.filter(s => s.status === 'resubmit').length
        };

        const pendingApprovals = submissionArray.filter(s => 
          s.status === 'submitted' || s.status === 'pending'
        ).length;

        const now = new Date();
        const overdueItems = submissionArray.filter(s => {
          if (!s.assignment?.dueDate) return false;
          return new Date(s.assignment.dueDate) < now && s.status === 'pending';
        }).length;

        setSystemData({
          overview: {
            totalUsers: userArray.length,
            activeProjects: classroomArray.length,
            pendingApprovals: pendingApprovals,
            overdueItems: overdueItems,
            totalSubmissions: submissionArray.length,
            systemUptime: 99.8,
            storageUsed: 78.5,
            avgResponseTime: 245
          },
          userStats,
          submissionStats,
          departmentStats: [
            { name: 'Computer Science', submissions: 456, users: 234 },
            { name: 'Engineering', submissions: 389, users: 198 },
            { name: 'Mathematics', submissions: 234, users: 156 },
            { name: 'Physics', submissions: 198, users: 123 },
            { name: 'Biology', submissions: 167, users: 98 }
          ],
          systemHealth: {
            cpu: 45,
            memory: 67,
            disk: 78,
            network: 23
          },
          monthlyTrends: [
            { month: 'Jan', submissions: 234, users: 45 },
            { month: 'Feb', submissions: 267, users: 52 },
            { month: 'Mar', submissions: 198, users: 38 },
            { month: 'Apr', submissions: 345, users: 67 },
            { month: 'May', submissions: 289, users: 54 },
            { month: 'Jun', submissions: 234, users: 43 }
          ]
        });

        setRecentActivity([
          {
            id: '1',
            type: 'user_registration',
            description: 'New faculty member registered',
            user: 'Dr. Sarah Johnson',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            severity: 'info'
          },
          {
            id: '2',
            type: 'submission_approved',
            description: 'Project submission approved',
            user: 'John Student',
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            severity: 'success'
          },
          {
            id: '3',
            type: 'system_alert',
            description: 'High memory usage detected',
            user: 'System',
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            severity: 'warning'
          },
          {
            id: '4',
            type: 'deadline_approaching',
            description: 'Assignment deadline in 2 days',
            user: 'CS 401',
            timestamp: new Date(Date.now() - 90 * 60 * 1000),
            severity: 'info'
          },
          {
            id: '5',
            type: 'user_login',
            description: 'Admin login from new location',
            user: 'admin@university.edu',
            timestamp: new Date(Date.now() - 120 * 60 * 1000),
            severity: 'warning'
          }
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set default data on error
        setSystemData({
          overview: {
            totalUsers: 0,
            activeProjects: 0,
            pendingApprovals: 0,
            overdueItems: 0,
            totalSubmissions: 0,
            systemUptime: 99.8,
            storageUsed: 0,
            avgResponseTime: 0
          },
          userStats: { students: 0, faculty: 0, researchers: 0, admins: 0 },
          submissionStats: { approved: 0, pending: 0, rejected: 0, resubmit: 0 },
          departmentStats: [],
          systemHealth: { cpu: 0, memory: 0, disk: 0, network: 0 },
          monthlyTrends: []
        });
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    loadSystemData();
  }, []);

  const formatTimeAgo = (date) => {
    const minutes = Math.floor((new Date() - date) / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      success: 'text-green-600 bg-green-50',
      warning: 'text-yellow-600 bg-yellow-50',
      error: 'text-red-600 bg-red-50',
      info: 'text-blue-600 bg-blue-50'
    };
    return colors[severity] || colors.info;
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      success: CheckCircle,
      warning: AlertTriangle,
      error: XCircle,
      info: Activity
    };
    const Icon = icons[severity] || Activity;
    return <Icon className="h-4 w-4" />;
  };

  const getHealthColor = (percentage) => {
    if (percentage >= 80) return 'text-red-600 bg-red-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading system data...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: systemData.overview.totalUsers.toLocaleString(),
      icon: <Users className="h-5 w-5" />,
      color: 'primary',
      trend: '+12%'
    },
    {
      title: 'Active Projects',
      value: systemData.overview.activeProjects,
      icon: <FileText className="h-5 w-5" />,
      color: 'success',
      trend: '+8%'
    },
    {
      title: 'Pending Approvals',
      value: systemData.overview.pendingApprovals,
      icon: <Clock className="h-5 w-5" />,
      color: 'warning',
      trend: '-5%'
    },
    {
      title: 'System Uptime',
      value: `${systemData.overview.systemUptime}%`,
      icon: <Server className="h-5 w-5" />,
      color: 'success',
      trend: '+0.2%'
    }
  ];

  const activityColumns = [
    {
      key: 'type',
      header: 'Activity',
      render: (value, item) => (
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${getSeverityColor(item.severity)}`}>
            {getSeverityIcon(item.severity)}
          </div>
          <div>
            <p className="font-medium text-gray-900">{item.description}</p>
            <p className="text-sm text-gray-500">{item.user}</p>
          </div>
        </div>
      )
    },
    {
      key: 'timestamp',
      header: 'Time',
      render: (value) => (
        <span className="text-sm text-gray-500">{formatTimeAgo(value)}</span>
      )
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                System Overview 🛡️
              </h1>
              <p className="text-indigo-100">
                Monitor system health, user activity, and institutional metrics
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </button>
              <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 font-medium transition-colors flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsGrid stats={stats} columns={4} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Health */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <Activity className="h-5 w-5 mr-2 text-indigo-600" />
                System Health
              </h3>
            </div>
            
            <div className="space-y-4">
              {Object.entries(systemData.systemHealth).map(([metric, value]) => (
                <div key={metric} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getHealthColor(value).split(' ')[1]}`}></div>
                    <span className="text-sm font-medium capitalize">{metric}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getHealthColor(value).split(' ')[1].replace('100', '500')}`}
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-10">{value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Distribution */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-indigo-600" />
                User Distribution
              </h3>
            </div>
            
            <div className="space-y-4">
              {Object.entries(systemData.userStats).map(([role, count]) => {
                const total = Object.values(systemData.userStats).reduce((a, b) => a + b, 0);
                const percentage = Math.round((count / total) * 100);
                const colors = {
                  students: 'bg-blue-500',
                  faculty: 'bg-green-500',
                  researchers: 'bg-purple-500',
                  admins: 'bg-red-500'
                };
                
                return (
                  <div key={role} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${colors[role]}`}></div>
                      <span className="text-sm font-medium capitalize">{role}</span>
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

          {/* Submission Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
                Submission Status
              </h3>
            </div>
            
            <div className="space-y-4">
              {Object.entries(systemData.submissionStats).map(([status, count]) => {
                const total = Object.values(systemData.submissionStats).reduce((a, b) => a + b, 0);
                const percentage = Math.round((count / total) * 100);
                const colors = {
                  approved: 'bg-green-500',
                  pending: 'bg-yellow-500',
                  rejected: 'bg-red-500',
                  resubmit: 'bg-orange-500'
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
        </div>

        {/* Department Statistics and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Statistics */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold flex items-center">
                <Database className="h-5 w-5 mr-2 text-indigo-600" />
                Department Statistics
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {systemData.departmentStats.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{dept.name}</p>
                      <p className="text-sm text-gray-500">{dept.users} users</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-indigo-600">{dept.submissions}</p>
                      <p className="text-xs text-gray-500">submissions</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold flex items-center">
                <Activity className="h-5 w-5 mr-2 text-indigo-600" />
                Recent Activity
              </h3>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              <DataTable
                data={recentActivity}
                columns={activityColumns}
                searchable={false}
                pagination={false}
                className="border-0 shadow-none"
              />
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
              Monthly Trends
            </h3>
          </div>
          
          <div className="grid grid-cols-6 gap-4">
            {systemData.monthlyTrends.map((month) => (
              <div key={month.month} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">{month.month}</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-lg font-bold text-indigo-600">{month.submissions}</p>
                    <p className="text-xs text-gray-500">Submissions</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-600">+{month.users}</p>
                    <p className="text-xs text-gray-500">New Users</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-indigo-600" />
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              to="/admin/users"
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Manage Users</p>
                  <p className="text-sm text-blue-600">Add, edit, or remove users</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/deadlines"
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Set Deadlines</p>
                  <p className="text-sm text-green-600">Manage submission deadlines</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/reports"
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">Generate Reports</p>
                  <p className="text-sm text-purple-600">Create detailed reports</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/audit"
              className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-900">Audit Logs</p>
                  <p className="text-sm text-orange-600">View system activity logs</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;