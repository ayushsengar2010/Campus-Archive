import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  BookOpen,
  Award,
  Upload,
  Eye,
  MessageSquare
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import DashboardCard, { StatsGrid } from '../../components/ui/DashboardCard';
import { useAuth } from '../../hooks/useAuth';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setRecentSubmissions([
        {
          id: '1',
          title: 'Machine Learning Project',
          type: 'project',
          status: 'approved',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          feedback: 'Excellent work! Great implementation of the neural network.',
          grade: 'A',
          course: 'CS 401'
        },
        {
          id: '2',
          title: 'Database Design Assignment',
          type: 'assignment',
          status: 'pending',
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          course: 'CS 301'
        }
      ]);

      setUpcomingDeadlines([
        {
          id: '1',
          title: 'Final Project Presentation',
          course: 'CS 401',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          type: 'presentation'
        }
      ]);

      setAnnouncements([
        {
          id: '1',
          title: 'New Submission Guidelines',
          content: 'Please ensure all projects include a README file with setup instructions.',
          author: 'Dr. Smith',
          course: 'CS 401',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ]);

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      approved: { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle, label: 'Approved' },
      pending: { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock, label: 'Under Review' },
      rejected: { color: 'text-red-600', bg: 'bg-red-100', icon: XCircle, label: 'Rejected' },
      resubmit: { color: 'text-orange-600', bg: 'bg-orange-100', icon: AlertCircle, label: 'Resubmit Required' }
    };
    return configs[status] || configs.pending;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getDaysUntilDeadline = (date) => {
    const now = new Date();
    const diffInDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return 'Due today';
    if (diffInDays === 1) return 'Due tomorrow';
    if (diffInDays > 0) return `Due in ${diffInDays} days`;
    return `Overdue by ${Math.abs(diffInDays)} days`;
  };

  const stats = [
    {
      title: 'Total Submissions',
      value: 12,
      icon: <FileText className="h-5 w-5" />,
      color: 'primary',
      description: 'This semester'
    },
    {
      title: 'Approved Projects',
      value: 8,
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'success',
      description: 'Successfully completed'
    },
    {
      title: 'Pending Reviews',
      value: 3,
      icon: <Clock className="h-5 w-5" />,
      color: 'warning',
      description: 'Awaiting feedback'
    },
    {
      title: 'Average Grade',
      value: 'A-',
      icon: <Award className="h-5 w-5" />,
      color: 'info',
      description: 'Current semester'
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-blue-100">
                You have {recentSubmissions.filter(s => s.status === 'pending').length} submissions under review
                and {upcomingDeadlines.length} upcoming deadlines.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/student/classroom"
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                View Classroom
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid stats={stats} columns={4} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Submissions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Recent Submissions
                  </h2>
                  <Link
                    to="/student/submissions"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View all
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-6 animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : recentSubmissions.length === 0 ? (
                  <div className="p-12 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                    <p className="text-gray-600 mb-4">Start by submitting your first project</p>
                    <Link
                      to="/student/submit"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Project
                    </Link>
                  </div>
                ) : (
                  recentSubmissions.map((submission) => {
                    const statusConfig = getStatusConfig(submission.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <div key={submission.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
                            <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {submission.title}
                              </h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                                {statusConfig.label}
                              </span>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                              <span className="flex items-center">
                                <BookOpen className="h-4 w-4 mr-1" />
                                {submission.course}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatTimeAgo(submission.submittedAt)}
                              </span>
                              {submission.grade && (
                                <span className="flex items-center font-medium text-green-600">
                                  <Award className="h-4 w-4 mr-1" />
                                  {submission.grade}
                                </span>
                              )}
                            </div>

                            {submission.feedback && (
                              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                <div className="flex items-start space-x-2">
                                  <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                                  <p className="text-sm text-gray-700">{submission.feedback}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">View Classroom</h3>
                  <p className="text-gray-600 mb-4">Access your enrolled classes and course materials</p>
                  <Link
                    to="/student/classroom"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Open Classroom
                  </Link>
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Deadlines
                </h3>
              </div>

              <div className="p-4 space-y-3">
                {upcomingDeadlines.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No upcoming deadlines
                  </p>
                ) : (
                  upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {deadline.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {deadline.course} • {getDaysUntilDeadline(deadline.dueDate)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Announcements
                </h3>
              </div>

              <div className="divide-y divide-gray-200">
                {announcements.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No recent announcements
                  </p>
                ) : (
                  announcements.slice(0, 3).map((announcement) => (
                    <div key={announcement.id} className="p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {announcement.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {announcement.content}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{announcement.author} • {announcement.course}</span>
                        <span>{formatTimeAgo(announcement.createdAt)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;