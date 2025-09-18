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
  Award,
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

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSubmissions = [
        {
          id: '1',
          title: 'Machine Learning Classification Project',
          type: 'project',
          course: 'CS 401 - Advanced AI',
          status: 'approved',
          grade: 'A',
          submittedAt: new Date('2024-01-15'),
          reviewedAt: new Date('2024-01-18'),
          feedback: 'Excellent implementation of the neural network. Great documentation and clear methodology. The results analysis is thorough and well-presented.',
          files: [
            { name: 'ML_Project_Report.pdf', size: '2.4 MB' },
            { name: 'source_code.zip', size: '1.8 MB' }
          ],
          githubLink: 'https://github.com/student/ml-project'
        },
        {
          id: '2',
          title: 'Database Design Assignment',
          type: 'assignment',
          course: 'CS 301 - Database Systems',
          status: 'pending',
          submittedAt: new Date('2024-01-20'),
          files: [
            { name: 'Database_Schema.sql', size: '156 KB' },
            { name: 'ER_Diagram.pdf', size: '890 KB' }
          ]
        },
        {
          id: '3',
          title: 'Research Proposal: Blockchain Security',
          type: 'research',
          course: 'CS 501 - Research Methods',
          status: 'resubmit',
          submittedAt: new Date('2024-01-10'),
          reviewedAt: new Date('2024-01-14'),
          feedback: 'Good topic selection, but the methodology section needs more detail. Please expand on the research approach and add more recent references (2022-2024).',
          files: [
            { name: 'Research_Proposal.docx', size: '1.2 MB' }
          ]
        },
        {
          id: '4',
          title: 'Web Development Portfolio',
          type: 'project',
          course: 'CS 201 - Web Programming',
          status: 'approved',
          grade: 'A-',
          submittedAt: new Date('2024-01-05'),
          reviewedAt: new Date('2024-01-08'),
          feedback: 'Great responsive design and clean code structure. Minor improvements needed in accessibility features.',
          files: [
            { name: 'portfolio_website.zip', size: '5.2 MB' }
          ],
          githubLink: 'https://github.com/student/portfolio'
        },
        {
          id: '5',
          title: 'Software Testing Report',
          type: 'assignment',
          course: 'CS 302 - Software Engineering',
          status: 'rejected',
          submittedAt: new Date('2024-01-12'),
          reviewedAt: new Date('2024-01-16'),
          feedback: 'The test cases are incomplete and do not cover edge cases. Please revise and include unit tests, integration tests, and performance tests.',
          files: [
            { name: 'Testing_Report.pdf', size: '980 KB' }
          ]
        }
      ];
      
      setSubmissions(mockSubmissions);
      setLoading(false);
    };

    fetchSubmissions();
  }, []);

  /**
   * Get status configuration
   */
  const getStatusConfig = (status) => {
    const configs = {
      approved: { 
        color: 'text-green-600', 
        bg: 'bg-green-100', 
        icon: CheckCircle, 
        label: 'Approved',
        badgeColors: 'bg-green-100 text-green-800'
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
          <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
          <p className="text-sm text-gray-500 capitalize">{item.type}</p>
        </div>
      )
    },
    {
      key: 'course',
      header: 'Course',
      render: (value) => (
        <span className="text-sm text-gray-900">{value}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      type: 'badge',
      badgeColors: {
        approved: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        rejected: 'bg-red-100 text-red-800',
        resubmit: 'bg-orange-100 text-orange-800'
      },
      filterable: true
    },
    {
      key: 'grade',
      header: 'Grade',
      render: (value) => value ? (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Award className="h-3 w-3 mr-1" />
          {value}
        </span>
      ) : (
        <span className="text-gray-400 text-sm">-</span>
      )
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
    setShowDetailModal(true);
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
    approved: submissions.filter(s => s.status === 'approved').length,
    pending: submissions.filter(s => s.status === 'pending').length,
    needsAction: submissions.filter(s => s.status === 'resubmit').length
  };

  return (
    <AppLayout>
      <div className="space-y-6 w-full m-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Link
                  to="/student"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">My Submissions</h1>
              </div>
              <p className="text-gray-600">
                Track your project submissions and view feedback from instructors
              </p>
            </div>
            <Link
              to="/student/submit"
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Submission
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-lg font-semibold text-green-600">{stats.approved}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-lg font-semibold text-yellow-600">{stats.pending}</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Action Needed</p>
                  <p className="text-lg font-semibold text-orange-600">{stats.needsAction}</p>
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
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedSubmission.title}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
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
                    const config = getStatusConfig(selectedSubmission.status);
                    const StatusIcon = config.icon;
                    return (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {config.label}
                      </span>
                    );
                  })()}
                  {selectedSubmission.grade && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <Award className="h-4 w-4 mr-1" />
                      {selectedSubmission.grade}
                    </span>
                  )}
                </div>
              </div>

              {/* Files */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Submitted Files</h4>
                <div className="space-y-2">
                  {selectedSubmission.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* GitHub Link */}
              {selectedSubmission.githubLink && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Repository</h4>
                  <a
                    href={selectedSubmission.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View on GitHub →
                  </a>
                </div>
              )}

              {/* Feedback */}
              {selectedSubmission.feedback && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Instructor Feedback</h4>
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-700">{selectedSubmission.feedback}</p>
                        {selectedSubmission.reviewedAt && (
                          <p className="text-xs text-gray-500 mt-2">
                            Reviewed on {selectedSubmission.reviewedAt.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedSubmission.status === 'resubmit' && (
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    to="/student/submit"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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