import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Calendar,
  BarChart3,
  Eye,
  MessageSquare,
  Award
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { StatsGrid } from '../../components/ui/DashboardCard';
import DataTable from '../../components/ui/DataTable';
import FeedbackModal from '../../components/ui/FeedbackModal';
import { useAuth } from '../../hooks/useAuth';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setPendingSubmissions([
        {
          id: '1',
          title: 'Machine Learning Classification Project',
          studentName: 'John Student',
          type: 'project',
          course: 'CS 401',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          priority: 'high'
        },
        {
          id: '2',
          title: 'Database Design Assignment',
          studentName: 'Jane Doe',
          type: 'assignment',
          course: 'CS 301',
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          priority: 'medium'
        },
        {
          id: '3',
          title: 'Web Development Portfolio',
          studentName: 'Mike Johnson',
          type: 'project',
          course: 'CS 201',
          submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          priority: 'low'
        }
      ]);

      setRecentReviews([
        {
          id: '1',
          title: 'Software Testing Report',
          studentName: 'Alice Brown',
          reviewedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          status: 'approved',
          grade: 'A-'
        },
        {
          id: '2',
          title: 'Algorithm Analysis',
          studentName: 'Bob Wilson',
          reviewedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          status: 'resubmit'
        }
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  const openReviewModal = (submission) => {
    setSelectedSubmission(submission);
    setShowFeedbackModal(true);
  };

  const submitFeedback = async (feedbackData) => {
    console.log('Feedback submitted:', feedbackData);

    setPendingSubmissions(prev =>
      prev.filter(s => s.id !== feedbackData.submissionId)
    );

    const reviewedSubmission = pendingSubmissions.find(s => s.id === feedbackData.submissionId);
    if (reviewedSubmission) {
      setRecentReviews(prev => [{
        id: reviewedSubmission.id,
        title: reviewedSubmission.title,
        studentName: reviewedSubmission.studentName,
        reviewedAt: new Date(),
        status: feedbackData.status,
        grade: feedbackData.status === 'approved' ? 'A' : null
      }, ...prev]);
    }

    alert('Feedback submitted successfully!');
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || colors.medium;
  };

  const formatTimeAgo = (date) => {
    const hours = Math.floor((new Date() - date) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const stats = [
    {
      title: 'Pending Reviews',
      value: pendingSubmissions.length,
      icon: <Clock className="h-5 w-5" />,
      color: 'warning'
    },
    {
      title: 'Reviewed Today',
      value: 5,
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'success'
    },
    {
      title: 'Total Students',
      value: 45,
      icon: <Users className="h-5 w-5" />,
      color: 'primary'
    },
    {
      title: 'Avg Response Time',
      value: '2.3 days',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'info'
    }
  ];

  const columns = [
    {
      key: 'title',
      header: 'Submission',
      render: (value, item) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{item.studentName} • {item.course}</p>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      render: (value) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
          {value}
        </span>
      )
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getPriorityColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'submittedAt',
      header: 'Submitted',
      render: (value) => formatTimeAgo(value)
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (_, item) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openReviewModal(item)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Review"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => openReviewModal(item)}
            className="p-1 text-green-600 hover:text-green-800"
            title="Feedback"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome, Dr. {user?.name?.split(' ')[1] || user?.name} 👨‍🏫
              </h1>
              <p className="text-purple-100">
                {pendingSubmissions.length} pending reviews • {recentReviews.length} completed today
              </p>
            </div>
            <Link
              to="/faculty/analytics"
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 font-medium transition-colors"
            >
              <BarChart3 className="h-4 w-4 mr-2 inline" />
              Analytics
            </Link>
          </div>
        </div>

        {/* Stats */}
        <StatsGrid stats={stats} columns={4} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Review Queue */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                Review Queue ({pendingSubmissions.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading...</p>
              </div>
            ) : pendingSubmissions.length === 0 ? (
              <div className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                <p className="text-gray-600">No pending submissions.</p>
              </div>
            ) : (
              <DataTable
                data={pendingSubmissions}
                columns={columns}
                searchable={false}
                pagination={false}
                onRowClick={openReviewModal}
                className="border-0 shadow-none"
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/faculty/students"
                  className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg"
                >
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-blue-900">My Students</p>
                      <p className="text-sm text-blue-600">View all students</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/faculty/analytics"
                  className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg"
                >
                  <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-green-900">Analytics</p>
                      <p className="text-sm text-green-600">Performance metrics</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Recent Reviews
                </h3>
              </div>

              <div className="p-4 space-y-3">
                {recentReviews.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No recent reviews</p>
                ) : (
                  recentReviews.map((review) => (
                    <div key={review.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-1 rounded-full ${review.status === 'approved' ? 'bg-green-100' :
                        review.status === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                        {review.status === 'approved' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : review.status === 'rejected' ? (
                          <XCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{review.title}</p>
                        <p className="text-xs text-gray-500">
                          {review.studentName} • {formatTimeAgo(review.reviewedAt)}
                        </p>
                        {review.grade && (
                          <div className="flex items-center mt-1">
                            <Award className="h-3 w-3 text-blue-500 mr-1" />
                            <span className="text-xs font-medium text-blue-600">{review.grade}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Deadlines */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Deadlines
                </h3>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Final Project Reviews</p>
                    <p className="text-xs text-gray-500">CS 401 • Due in 2 days</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Assignment Grading</p>
                    <p className="text-xs text-gray-500">CS 301 • Due in 5 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        submission={selectedSubmission}
        onSubmitFeedback={submitFeedback}
      />
    </AppLayout>
  );
};

export default FacultyDashboard;