import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Filter, 
  Download, 
  Eye, 
  MessageSquare, 
  Calendar,
  BookOpen,
  Plus,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../services/apiService';

/**
 * Student Submissions Page - Google Classroom Style
 */
const StudentSubmissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [studentComment, setStudentComment] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        // Fetch real submissions from backend
        const submissionsData = await apiService.getSubmissions();
        const fetchedSubmissions = Array.isArray(submissionsData) ? submissionsData : [];
        
        // Transform backend data to match component structure
        const transformedSubmissions = fetchedSubmissions.map(sub => ({
          id: sub._id,
          title: sub.assignment?.title || 'Untitled Assignment',
          type: sub.assignment?.type || 'assignment',
          course: sub.classroom?.name || 'Unknown Course',
          status: sub.status,
          grade: sub.marks ? `${sub.marks}/${sub.assignment?.maxMarks || 100}` : null,
          version: `V${sub.version || 1}`,
          submittedAt: new Date(sub.submittedAt),
          reviewedAt: sub.reviewedAt ? new Date(sub.reviewedAt) : null,
          feedback: sub.feedback || null,
          files: sub.files?.map(f => ({
            name: f.originalName || f.filename,
            size: f.size ? `${(f.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'
          })) || [],
          githubLink: sub.githubLink || null,
          comments: [],
          resubmitType: sub.status === 'resubmit' ? 'minor' : null
        }));
        
        // Load comments from localStorage and merge
        const storedComments = localStorage.getItem('submissionComments');
        if (storedComments) {
          const commentsMap = JSON.parse(storedComments);
          transformedSubmissions.forEach(submission => {
            if (commentsMap[submission.id]) {
              submission.comments = commentsMap[submission.id];
            }
          });
        }
        
        setSubmissions(transformedSubmissions);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  /**
   * Get status configuration
   */
  const getStatusConfig = (status) => {
    const configs = {
      accepted: { 
        color: 'text-green-600', 
        bg: 'bg-green-100', 
        icon: CheckCircle, 
        label: 'Approved',
        badgeColors: 'bg-green-100 text-green-800'
      },
      approved: { 
        color: 'text-green-600', 
        bg: 'bg-green-100', 
        icon: CheckCircle, 
        label: 'Approved',
        badgeColors: 'bg-green-100 text-green-800'
      },
      reviewed: { 
        color: 'text-green-600', 
        bg: 'bg-green-100', 
        icon: CheckCircle, 
        label: 'Reviewed',
        badgeColors: 'bg-green-100 text-green-800'
      },
      submitted: { 
        color: 'text-yellow-600', 
        bg: 'bg-yellow-100', 
        icon: Clock, 
        label: 'Under Review',
        badgeColors: 'bg-yellow-100 text-yellow-800'
      },
      pending: { 
        color: 'text-yellow-600', 
        bg: 'bg-yellow-100', 
        icon: Clock, 
        label: 'Under Review',
        badgeColors: 'bg-yellow-100 text-yellow-800'
      },
      rejected: { 
        color: 'text-red-600', 
        bg: 'bg-red-100', 
        icon: XCircle, 
        label: 'Rejected',
        badgeColors: 'bg-red-100 text-red-800'
      },
      resubmit: { 
        color: 'text-orange-600', 
        bg: 'bg-orange-100', 
        icon: AlertCircle, 
        label: 'Resubmit Required',
        badgeColors: 'bg-orange-100 text-orange-800'
      },
      minor_resubmit: { 
        color: 'text-yellow-600', 
        bg: 'bg-yellow-100', 
        icon: AlertCircle, 
        label: 'Minor Resubmit',
        badgeColors: 'bg-yellow-100 text-yellow-800'
      },
      major_resubmit: { 
        color: 'text-orange-600', 
        bg: 'bg-orange-100', 
        icon: AlertCircle, 
        label: 'Major Resubmit',
        badgeColors: 'bg-orange-100 text-orange-800'
      }
    };
    return configs[status] || configs.pending;
  };

  /**
   * Table columns configuration
   */
  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (value, item) => (
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-900 truncate">{value}</p>
          <p className="text-sm text-gray-900 dark:text-gray-900 capitalize">{item.type}</p>
        </div>
      )
    },
    {
      key: 'version',
      header: 'Version',
      render: (value) => {
        if (!value) return <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>;
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {value}
          </span>
        );
      }
    },
    {
      key: 'course',
      header: 'Course',
      render: (value) => (
        <span className="text-sm text-gray-900 dark:text-gray-900">{value}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value, item) => {
        // Determine status to display based on resubmitType
        let displayStatus = value;
        if (value === 'resubmit' && item.resubmitType) {
          displayStatus = `${item.resubmitType}_resubmit`;
        }
        const config = getStatusConfig(displayStatus);
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badgeColors}`}>
            {config.label}
          </span>
        );
      },
      filterable: true
    },
    {
      key: 'submittedAt',
      header: 'Submitted',
      type: 'date'
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (_, item) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => viewSubmission(item)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {item.feedback && (
            <button
              onClick={() => viewSubmission(item)}
              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
              title="View Feedback"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  /**
   * View submission details
   */
  const viewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setStudentComment('');
    setShowDetailModal(true);
  };

  /**
   * Handle student comment submission
   */
  const handleSubmitComment = async () => {
    if (!studentComment.trim() || !selectedSubmission) return;
    
    // Create new comment object
    const newComment = {
      id: Date.now(),
      text: studentComment.trim(),
      author: user?.name || 'Student',
      timestamp: new Date().toISOString(),
      date: new Date()
    };
    
    // Get existing comments from localStorage
    const storedComments = localStorage.getItem('submissionComments');
    const commentsMap = storedComments ? JSON.parse(storedComments) : {};
    
    // Add new comment to the submission
    if (!commentsMap[selectedSubmission.id]) {
      commentsMap[selectedSubmission.id] = [];
    }
    commentsMap[selectedSubmission.id].push(newComment);
    
    // Save to localStorage
    localStorage.setItem('submissionComments', JSON.stringify(commentsMap));
    
    // Update local state
    const updatedSubmissions = submissions.map(sub => {
      if (sub.id === selectedSubmission.id) {
        return {
          ...sub,
          comments: commentsMap[selectedSubmission.id]
        };
      }
      return sub;
    });
    setSubmissions(updatedSubmissions);
    
    // Update selected submission
    setSelectedSubmission({
      ...selectedSubmission,
      comments: commentsMap[selectedSubmission.id]
    });
    
    // Clear comment input
    setStudentComment('');
    
    // Show success message
    alert('Comment submitted successfully!');
  };

  /**
   * Filter submissions by status
   */
  const filteredSubmissions = filterStatus === 'all' 
    ? submissions 
    : submissions.filter(s => s.status === filterStatus);

  /**
   * Get stats for the header
   */
  const stats = {
    total: submissions.length,
    approved: submissions.filter(s => s.status === 'accepted' || s.status === 'approved').length,
    pending: submissions.filter(s => s.status === 'pending' || s.status === 'submitted').length,
    needsAction: submissions.filter(s => s.status === 'resubmit').length
  };

  return (
    <AppLayout>
      <div className="space-y-6 w-full m-auto">
        {/* Header with Blue Gradient Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Link
                  to="/student"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-3xl font-bold">My Submissions</h1>
              </div>
              <p className="text-blue-100">
                Track your project submissions and view feedback from instructors
              </p>
            </div>
            <Link
              to="/student/submit"
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Submission
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-white/80 mr-2" />
                <div>
                  <p className="text-sm text-blue-100">Total</p>
                  <p className="text-lg font-semibold text-white">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
                <div>
                  <p className="text-sm text-blue-100">Approved</p>
                  <p className="text-lg font-semibold text-white">{stats.approved}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-300 mr-2" />
                <div>
                  <p className="text-sm text-blue-100">Pending</p>
                  <p className="text-lg font-semibold text-white">{stats.pending}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-orange-300 mr-2" />
                <div>
                  <p className="text-sm text-blue-100">Action Needed</p>
                  <p className="text-lg font-semibold text-white">{stats.needsAction}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <DataTable
          data={filteredSubmissions}
          columns={columns}
          loading={loading}
          searchable={true}
          filterable={true}
          pagination={true}
          pageSize={10}
          onRowClick={viewSubmission}
          emptyMessage="No submissions found. Start by submitting your first project!"
        />

        {/* Submission Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="Submission Details"
          size="lg"
        >
          {selectedSubmission && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-900">
                      {selectedSubmission.title}
                    </h3>
                    {selectedSubmission.version && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {selectedSubmission.version}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-900 dark:text-gray-900">
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {selectedSubmission.course}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Submitted {selectedSubmission.submittedAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {(() => {
                    // Determine status to display based on resubmitType
                    let displayStatus = selectedSubmission.status;
                    if (selectedSubmission.status === 'resubmit' && selectedSubmission.resubmitType) {
                      displayStatus = `${selectedSubmission.resubmitType}_resubmit`;
                    }
                    const config = getStatusConfig(displayStatus);
                    const StatusIcon = config.icon;
                    return (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {config.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Files */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-900 mb-3">Submitted Files</h4>
                <div className="space-y-2">
                  {selectedSubmission.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3  rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = file.url || file.path || '#';
                          link.download = file.name || 'download';
                          link.target = '_blank';
                          link.rel = 'noopener noreferrer';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* GitHub Link */}
              {selectedSubmission.githubLink && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-900 mb-2">Repository</h4>
                  <a
                    href={selectedSubmission.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                  >
                    View on GitHub →
                  </a>
                </div>
              )}

              {/* Feedback */}
              {selectedSubmission.feedback && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-900 mb-3">Instructor Feedback</h4>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400 dark:border-blue-500">
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-700">{selectedSubmission.feedback}</p>
                        {selectedSubmission.reviewedAt && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            Reviewed on {selectedSubmission.reviewedAt.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Student Comment Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-900 mb-3">Student Comments</h4>
                
                {/* Display existing comments */}
                {selectedSubmission.comments && selectedSubmission.comments.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {selectedSubmission.comments.map((comment) => (
                      <div key={comment.id} className="p-3 bg-gray-50 dark:bg-gray-100 rounded-lg border border-gray-200">
                        <div className="flex items-start space-x-3">
                          <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-gray-900">{comment.text}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {comment.author} • {new Date(comment.date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new comment */}
                <div className="space-y-3">
                  <textarea
                    value={studentComment}
                    onChange={(e) => setStudentComment(e.target.value)}
                    placeholder="Add your comment or question about this submission..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 dark:text-gray-900 bg-white dark:bg-gray-50"
                    rows="4"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmitComment}
                      disabled={!studentComment.trim()}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Submit Comment
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedSubmission.status === 'resubmit' && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to="/student/submit"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Revision
                  </Link>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </AppLayout>
  );
};

export default StudentSubmissions;