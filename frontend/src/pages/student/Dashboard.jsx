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
import apiService from '../../services/apiService';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    approvedProjects: 0,
    pendingReviews: 0,
    pendingAssignments: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch student's submissions
        const submissionsData = await apiService.getSubmissions();
        const submissions = Array.isArray(submissionsData) ? submissionsData : [];
        setRecentSubmissions(submissions.slice(0, 5).map(sub => ({
          ...sub,
          title: sub.assignment?.title || sub.title || 'Untitled Submission',
          submittedAt: new Date(sub.submittedAt),
          course: sub.classroom?.name || 'Unknown Course'
        })));

        // Fetch student's classrooms
        const classroomsData = await apiService.getClassrooms();
        const classroomList = Array.isArray(classroomsData) ? classroomsData : [];
        setClassrooms(classroomList);

        // Fetch assignments for upcoming deadlines
        const allAssignments = [];
        for (const classroom of classroomList) {
          try {
            const assignmentsData = await apiService.getAssignments({ classroom: classroom._id });
            const assignments = Array.isArray(assignmentsData) ? assignmentsData : [];
            allAssignments.push(...assignments.map(a => ({
              ...a,
              classroom: classroom
            })));
          } catch (error) {
            console.error(`Error fetching assignments for classroom ${classroom._id}:`, error);
          }
        }

        // Get list of submitted assignment IDs
        const submittedAssignmentIds = submissions.map(sub => 
          sub.assignment?._id || sub.assignment
        );

        // Filter for upcoming deadlines - exclude already submitted assignments
        const now = new Date();
        const upcoming = allAssignments
          .filter(a => {
            const isUpcoming = new Date(a.dueDate) > now;
            const isNotSubmitted = !submittedAssignmentIds.includes(a._id);
            return isUpcoming && isNotSubmitted;
          })
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, 5)
          .map(a => ({
            id: a._id,
            title: a.title,
            course: a.classroom?.name || 'Unknown',
            dueDate: new Date(a.dueDate),
            type: a.type
          }));
        setUpcomingDeadlines(upcoming);

        // Calculate stats
        setStats({
          totalSubmissions: submissions.length,
          approvedProjects: submissions.filter(s => s.status === 'accepted').length,
          pendingReviews: submissions.filter(s => s.status === 'submitted' || s.status === 'pending').length,
          pendingAssignments: upcoming.length
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      accepted: { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle, label: 'Approved' },
      approved: { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle, label: 'Approved' },
      pending: { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock, label: 'Under Review' },
      submitted: { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock, label: 'Under Review' },
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

  const dashboardStats = [
    {
      title: 'Total Submissions',
      value: stats.totalSubmissions,
      icon: <FileText className="h-5 w-5" />,
      color: 'primary',
      description: 'This semester'
    },
    {
      title: 'Approved Projects',
      value: stats.approvedProjects,
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'success',
      description: 'Successfully completed'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: <Clock className="h-5 w-5" />,
      color: 'warning',
      description: 'Awaiting feedback'
    },
    {
      title: 'Pending Assignments',
      value: stats.pendingAssignments,
      icon: <AlertCircle className="h-5 w-5" />,
      color: 'warning',
      description: 'Due this week'
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 text-white p-6 rounded-xl shadow-sm transition-colors duration-300">
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
        <StatsGrid stats={dashboardStats} columns={4} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Submissions */}
            <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-300">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Recent Submissions
                  </h2>
                  <Link
                    to="/student/submissions"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    View all
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="p-6 animate-pulse">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                  ))
                ) : recentSubmissions.length === 0 ? (
                  <div className="p-12 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No submissions yet</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">Start by submitting your first project</p>
                    <Link
                      to="/student/submit"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg"
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
                      <div key={submission.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
                            <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2 gap-3">
                              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                {submission.title}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusConfig.bg} ${statusConfig.color}`}>
                                {statusConfig.label}
                              </span>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
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
                              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                <div className="flex items-start space-x-2">
                                  <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{submission.feedback}</p>
                                </div>
                              </div>
                            )}

                            {submission.marks !== undefined && submission.marks !== null && (
                              <div className="mt-2 flex items-center text-sm">
                                <Award className="h-4 w-4 text-green-600 mr-1" />
                                <span className="font-medium text-green-600">
                                  Score: {submission.marks}/{submission.assignment?.maxMarks || 100}
                                </span>
                              </div>
                            )}
                          </div>

                          <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
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
            {/* Upcoming Deadlines */}

             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-300">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Upcoming Deadlines
                </h3>
              </div>
            {/* Quick Actions */}
            {/* <div className="bg-white rounded-lg shadow-sm border p-6">
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
            </div> */}

              <div className="p-4 space-y-3">
                {upcomingDeadlines.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No upcoming deadlines
                  </p>
                ) : (
                  upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors border-l-4 border-red-500 dark:border-red-400">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                            {deadline.title}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                            deadline.type === 'project' 
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {deadline.type === 'project' ? 'Project' : 'Assignment'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {deadline.course}
                        </p>
                        <p className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {getDaysUntilDeadline(deadline.dueDate)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-300">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Announcements
                </h3>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {announcements.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                    No recent announcements
                  </p>
                ) : (
                  announcements.slice(0, 3).map((announcement) => (
                    <div key={announcement.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {announcement.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {announcement.content}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
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