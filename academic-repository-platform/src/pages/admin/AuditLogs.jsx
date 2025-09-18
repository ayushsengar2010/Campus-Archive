import { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Calendar,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Users,
  Settings
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import DataTable from '../../components/ui/DataTable';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockLogs = [
      {
        id: '1',
        action: 'USER_CREATED',
        details: 'Created user: john.smith@university.edu with role: student',
        performedBy: 'admin@university.edu',
        performedByName: 'Admin User',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        targetUser: 'john.smith@university.edu',
        targetResource: 'User',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'info'
      },
      {
        id: '2',
        action: 'ROLE_CHANGED',
        details: 'Changed role from student to faculty for sarah.johnson@university.edu',
        performedBy: 'admin@university.edu',
        performedByName: 'Admin User',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        targetUser: 'sarah.johnson@university.edu',
        targetResource: 'User',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'warning'
      },
      {
        id: '3',
        action: 'USER_DELETED',
        details: 'Deleted user: old.user@university.edu',
        performedBy: 'admin@university.edu',
        performedByName: 'Admin User',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        targetUser: 'old.user@university.edu',
        targetResource: 'User',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'error'
      },
      {
        id: '4',
        action: 'DEADLINE_CREATED',
        details: 'Created deadline: Final Project Submission for CS 401',
        performedBy: 'admin@university.edu',
        performedByName: 'Admin User',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        targetUser: null,
        targetResource: 'Deadline',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'info'
      },
      {
        id: '5',
        action: 'DEADLINE_EXTENDED',
        details: 'Extended deadline by 3 days: Research Paper Draft',
        performedBy: 'admin@university.edu',
        performedByName: 'Admin User',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        targetUser: null,
        targetResource: 'Deadline',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'warning'
      },
      {
        id: '6',
        action: 'BULK_ACTIVATE',
        details: 'Bulk activate performed on 5 users',
        performedBy: 'admin@university.edu',
        performedByName: 'Admin User',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        targetUser: 'Multiple users',
        targetResource: 'User',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'info'
      },
      {
        id: '7',
        action: 'LOGIN_ATTEMPT',
        details: 'Failed login attempt for admin@university.edu',
        performedBy: 'system',
        performedByName: 'System',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        targetUser: 'admin@university.edu',
        targetResource: 'Authentication',
        ipAddress: '192.168.1.200',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'error'
      },
      {
        id: '8',
        action: 'SYSTEM_BACKUP',
        details: 'Automated system backup completed successfully',
        performedBy: 'system',
        performedByName: 'System',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        targetUser: null,
        targetResource: 'System',
        ipAddress: 'localhost',
        userAgent: 'System Process',
        severity: 'info'
      },
      {
        id: '9',
        action: 'SUBMISSION_APPROVED',
        details: 'Approved submission: Machine Learning Project by john.doe@university.edu',
        performedBy: 'faculty@university.edu',
        performedByName: 'Dr. Sarah Johnson',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        targetUser: 'john.doe@university.edu',
        targetResource: 'Submission',
        ipAddress: '192.168.1.150',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        severity: 'info'
      },
      {
        id: '10',
        action: 'PERMISSION_DENIED',
        details: 'Access denied to admin panel for student@university.edu',
        performedBy: 'system',
        performedByName: 'System',
        timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
        targetUser: 'student@university.edu',
        targetResource: 'Access Control',
        ipAddress: '192.168.1.180',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
        severity: 'warning'
      }
    ];
    
    setLogs(mockLogs);
    setLoading(false);
  };

  const formatTimeAgo = (date) => {
    const minutes = Math.floor((new Date() - date) / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getSeverityColor = (severity) => {
    const colors = {
      info: 'text-blue-600 bg-blue-50',
      warning: 'text-yellow-600 bg-yellow-50',
      error: 'text-red-600 bg-red-50',
      success: 'text-green-600 bg-green-50'
    };
    return colors[severity] || colors.info;
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      info: Activity,
      warning: AlertTriangle,
      error: XCircle,
      success: CheckCircle
    };
    const Icon = icons[severity] || Activity;
    return <Icon className="h-4 w-4" />;
  };

  const getActionIcon = (action) => {
    if (action.includes('USER')) return <Users className="h-4 w-4" />;
    if (action.includes('DEADLINE')) return <Calendar className="h-4 w-4" />;
    if (action.includes('SUBMISSION')) return <FileText className="h-4 w-4" />;
    if (action.includes('LOGIN') || action.includes('PERMISSION')) return <Shield className="h-4 w-4" />;
    if (action.includes('SYSTEM')) return <Settings className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const getActionColor = (action) => {
    if (action.includes('USER')) return 'text-blue-600 bg-blue-100';
    if (action.includes('DEADLINE')) return 'text-green-600 bg-green-100';
    if (action.includes('SUBMISSION')) return 'text-purple-600 bg-purple-100';
    if (action.includes('LOGIN') || action.includes('PERMISSION')) return 'text-red-600 bg-red-100';
    if (action.includes('SYSTEM')) return 'text-gray-600 bg-gray-100';
    return 'text-indigo-600 bg-indigo-100';
  };

  // Filter logs based on search and filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.performedByName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.targetUser && log.targetUser.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAction = selectedAction === 'all' || log.action.includes(selectedAction.toUpperCase());
    
    const matchesUser = selectedUser === 'all' || log.performedBy === selectedUser;
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const now = new Date();
      const logDate = log.timestamp;
      switch (dateRange) {
        case 'today':
          matchesDate = logDate.toDateString() === now.toDateString();
          break;
        case 'week':
          matchesDate = (now - logDate) <= 7 * 24 * 60 * 60 * 1000;
          break;
        case 'month':
          matchesDate = (now - logDate) <= 30 * 24 * 60 * 60 * 1000;
          break;
      }
    }
    
    return matchesSearch && matchesAction && matchesUser && matchesDate;
  });

  const logColumns = [
    {
      key: 'timestamp',
      header: 'Time',
      render: (timestamp) => (
        <div>
          <p className="text-sm text-gray-900">{formatTimeAgo(timestamp)}</p>
          <p className="text-xs text-gray-500">{formatDateTime(timestamp)}</p>
        </div>
      )
    },
    {
      key: 'action',
      header: 'Action',
      render: (action, log) => (
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${getActionColor(action)}`}>
            {getActionIcon(action)}
          </div>
          <div>
            <p className="font-medium text-gray-900">{action.replace(/_/g, ' ')}</p>
            <p className="text-sm text-gray-500">{log.targetResource}</p>
          </div>
        </div>
      )
    },
    {
      key: 'details',
      header: 'Details',
      render: (details) => (
        <p className="text-sm text-gray-900 max-w-md truncate" title={details}>
          {details}
        </p>
      )
    },
    {
      key: 'performedBy',
      header: 'Performed By',
      render: (_, log) => (
        <div>
          <p className="font-medium text-gray-900">{log.performedByName}</p>
          <p className="text-sm text-gray-500">{log.performedBy}</p>
        </div>
      )
    },
    {
      key: 'targetUser',
      header: 'Target',
      render: (targetUser) => (
        <span className="text-sm text-gray-900">
          {targetUser || '-'}
        </span>
      )
    },
    {
      key: 'severity',
      header: 'Severity',
      render: (severity, log) => (
        <div className={`flex items-center space-x-2 px-2 py-1 rounded-full ${getSeverityColor(severity)}`}>
          {getSeverityIcon(severity)}
          <span className="text-xs font-medium capitalize">{severity}</span>
        </div>
      )
    },
    {
      key: 'ipAddress',
      header: 'IP Address',
      render: (ipAddress) => (
        <span className="text-sm text-gray-500 font-mono">{ipAddress}</span>
      )
    }
  ];

  // Get unique users for filter
  const uniqueUsers = [...new Set(logs.map(log => log.performedBy))];

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading audit logs...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Audit Logs 🔍
              </h1>
              <p className="text-indigo-100">
                Track all administrative actions and system events
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadAuditLogs}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 font-medium transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
              </div>
              <Activity className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today</p>
                <p className="text-2xl font-bold text-blue-600">
                  {logs.filter(log => {
                    const today = new Date();
                    return log.timestamp.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {logs.filter(log => log.severity === 'warning').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Errors</p>
                <p className="text-2xl font-bold text-red-600">
                  {logs.filter(log => log.severity === 'error').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Actions</option>
              <option value="user">User Actions</option>
              <option value="deadline">Deadline Actions</option>
              <option value="submission">Submission Actions</option>
              <option value="login">Authentication</option>
              <option value="system">System Events</option>
            </select>
            
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Users</option>
              {uniqueUsers.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold flex items-center">
              <Shield className="h-5 w-5 mr-2 text-indigo-600" />
              Audit Trail ({filteredLogs.length} events)
            </h3>
          </div>
          
          <DataTable
            data={filteredLogs}
            columns={logColumns}
            searchable={false}
            pagination={true}
          />
        </div>

        {/* Recent Activity Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Action Types Distribution */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-indigo-600" />
              Action Types
            </h3>
            
            <div className="space-y-3">
              {['USER', 'DEADLINE', 'SUBMISSION', 'LOGIN', 'SYSTEM'].map(actionType => {
                const count = logs.filter(log => log.action.includes(actionType)).length;
                const percentage = logs.length > 0 ? Math.round((count / logs.length) * 100) : 0;
                
                return (
                  <div key={actionType} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getActionColor(actionType).split(' ')[1]}`}></div>
                      <span className="text-sm font-medium">{actionType.toLowerCase()}</span>
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

          {/* Severity Distribution */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-indigo-600" />
              Severity Levels
            </h3>
            
            <div className="space-y-3">
              {['info', 'warning', 'error', 'success'].map(severity => {
                const count = logs.filter(log => log.severity === severity).length;
                const percentage = logs.length > 0 ? Math.round((count / logs.length) * 100) : 0;
                const colors = {
                  info: 'bg-blue-500',
                  warning: 'bg-yellow-500',
                  error: 'bg-red-500',
                  success: 'bg-green-500'
                };
                
                return (
                  <div key={severity} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${colors[severity]}`}></div>
                      <span className="text-sm font-medium capitalize">{severity}</span>
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
      </div>
    </AppLayout>
  );
};

export default AuditLogs;