import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Users,
  Calendar,
  FileText,
  Clock,
  Plus,
  Eye,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  User,
  TrendingUp,
  BarChart3,
  Upload,
  MessageSquare
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import DataTable from '../../components/ui/DataTable';
import SubmissionDetailModal from '../../components/ui/SubmissionDetailModal';
import CreateAssignmentModal from '../../components/ui/CreateAssignmentModal';

/**
 * Faculty Classroom Detail Page
 * Shows assignments, student submissions, and grading interface for a specific class
 */
const FacultyClassroomDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assignments'); // assignments, submissions, students, analytics
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null); // Track selected assignment
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);

  useEffect(() => {
    const fetchClassroomData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock class data
      const mockClassData = {
        id: classId,
        name: 'Computer Science IV',
        code: 'CS 401',
        section: 'A',
        semester: 'Fall 2024',
        color: 'bg-blue-600',
        avatar: 'CS',
        students: 45,
        description: 'Advanced computer science topics including algorithms, data structures, and system design.',
        totalAssignments: 8,
        activeAssignments: 3
      };

      // Mock assignments data
      const mockAssignments = [
        {
          id: '1',
          title: 'Database Design Assignment',
          description: 'Design a relational database for an e-commerce system',
          type: 'assignment',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          maxMarks: 100,
          status: 'active',
          totalSubmissions: 28,
          pendingReview: 12,
          graded: 16,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          title: 'Machine Learning Project',
          description: 'Implement and compare ML classification algorithms',
          type: 'project',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          maxMarks: 150,
          status: 'active',
          totalSubmissions: 15,
          pendingReview: 8,
          graded: 7,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        },
        {
          id: '3',
          title: 'Algorithm Analysis Quiz',
          description: 'Short quiz on time complexity and algorithm analysis',
          type: 'quiz',
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          maxMarks: 50,
          status: 'closed',
          totalSubmissions: 42,
          pendingReview: 0,
          graded: 42,
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
        },
        {
          id: '4',
          title: 'System Design Project',
          description: 'Design a scalable distributed system architecture',
          type: 'project',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          maxMarks: 200,
          status: 'active',
          totalSubmissions: 5,
          pendingReview: 3,
          graded: 2,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      ];

      // Mock submissions data
      const mockSubmissions = [
        {
          id: '1',
          assignmentId: '1',
          assignmentTitle: 'Database Design Assignment',
          studentName: 'John Doe',
          studentId: 'ST001',
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: 'pending',
          type: 'assignment',
          fileCount: 3,
          lateSubmission: false,
          maxMarks: 100,
          tags: ['Database', 'SQL', 'Design Patterns']
        },
        {
          id: '2',
          assignmentId: '2',
          assignmentTitle: 'Machine Learning Project',
          studentName: 'Jane Smith',
          studentId: 'ST002',
          submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: 'pending',
          type: 'project',
          fileCount: 5,
          lateSubmission: false,
          tags: ['Machine Learning', 'Python', 'Classification', 'Final Project']
        },
        {
          id: '3',
          assignmentId: '1',
          assignmentTitle: 'Database Design Assignment',
          studentName: 'Mike Johnson',
          studentId: 'ST003',
          submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: 'graded',
          grade: 'A',
          score: 92,
          type: 'assignment',
          fileCount: 2,
          lateSubmission: false,
          tags: ['Database', 'SQL', 'Design Patterns']
        },
        {
          id: '4',
          assignmentId: '2',
          assignmentTitle: 'Machine Learning Project',
          studentName: 'Sarah Williams',
          studentId: 'ST004',
          submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          status: 'resubmit',
          type: 'project',
          fileCount: 4,
          lateSubmission: false,
          tags: ['Machine Learning', 'Python', 'Classification']
        },
        {
          id: '5',
          assignmentId: '3',
          assignmentTitle: 'Algorithm Analysis Quiz',
          studentName: 'David Brown',
          studentId: 'ST005',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'graded',
          type: 'quiz',
          fileCount: 1,
          lateSubmission: true,
          tags: ['Algorithms', 'Time Complexity', 'Quiz']
        }
      ];

      setClassData(mockClassData);
      setAssignments(mockAssignments);
      setSubmissions(mockSubmissions);
      setLoading(false);
    };

    fetchClassroomData();
  }, [classId]);

  const getDaysUntilDeadline = (date) => {
    const now = new Date();
    const diffInDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Due today';
    if (diffInDays === 1) return 'Due tomorrow';
    if (diffInDays > 0) return `Due in ${diffInDays} days`;
    return 'Overdue';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      graded: 'bg-green-100 text-green-800',
      resubmit: 'bg-orange-100 text-orange-800',
      rejected: 'bg-red-100 text-red-800',
      active: 'bg-blue-100 text-blue-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.pending;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <FileText className="h-4 w-4" />;
      case 'project':
        return <BookOpen className="h-4 w-4" />;
      case 'quiz':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const openReviewModal = (submission) => {
    setSelectedSubmission(submission);
    setShowFeedbackModal(true);
  };

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment);
    setActiveTab('submissions'); // Switch to submissions tab
    setSearchQuery(''); // Clear search
    setFilterType('all'); // Reset filter
  };

  const handleBackToAssignments = () => {
    setSelectedAssignment(null);
    setActiveTab('assignments');
  };

  const handleCreateAssignment = async (assignmentData) => {
    console.log('Creating assignment:', assignmentData);

    // Generate a new ID
    const newId = (assignments.length + 1).toString();
    
    const newAssignment = {
      id: newId,
      ...assignmentData,
      totalSubmissions: 0,
      pendingReview: 0,
      graded: 0,
      createdAt: new Date()
    };

    // Add to assignments list
    setAssignments(prev => [newAssignment, ...prev]);

    alert('Assignment created successfully!');
  };

  const submitFeedback = async (feedbackData) => {
    console.log('Feedback submitted:', feedbackData);

    // Update submission status
    setSubmissions(prev =>
      prev.map(s =>
        s.id === feedbackData.submissionId
          ? { ...s, status: feedbackData.status, grade: feedbackData.grade, score: feedbackData.score }
          : s
      )
    );

    // If uploadToRepository is true, add to repository
    if (feedbackData.uploadToRepository) {
      console.log('Uploading project to repository:', {
        submissionId: feedbackData.submissionId,
        decision: feedbackData.decision,
        uploadedAt: feedbackData.reviewedAt
      });
      // TODO: Call repository API service to add this project
      // This will be handled by the Repository page integration
      alert('Project accepted and uploaded to repository successfully!');
    } else {
      alert('Feedback submitted successfully!');
    }
  };

  const formatTimeAgo = (date) => {
    const hours = Math.floor((new Date() - date) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Assignment columns for table
  const assignmentColumns = [
    {
      key: 'title',
      header: 'Assignment',
      render: (value, item) => (
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            {getTypeIcon(item.type)}
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
          </div>
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
      key: 'dueDate',
      header: 'Due Date',
      render: (value, item) => (
        <div>
          <p className="text-sm text-gray-900">{value.toLocaleDateString()}</p>
          <p className={`text-xs ${item.status === 'closed' ? 'text-gray-500' : 'text-orange-600'}`}>
            {getDaysUntilDeadline(value)}
          </p>
        </div>
      )
    },
    {
      key: 'totalSubmissions',
      header: 'Submissions',
      render: (value, item) => (
        <div className="text-sm">
          <p className="font-medium text-gray-900">{value}/{classData?.students}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-orange-600">{item.pendingReview} pending</span>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (_, item) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAssignmentClick(item);
            }}
            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium"
            title="View Submissions"
          >
            <Eye className="h-4 w-4 inline mr-1" />
            View Submissions
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="p-1 text-green-600 hover:text-green-800" 
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="p-1 text-red-600 hover:text-red-800" 
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  // Submission columns for table
  const submissionColumns = [
    {
      key: 'studentName',
      header: 'Student',
      render: (value, item) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{item.studentId}</p>
          </div>
        </div>
      )
    },
    // Only show assignment title when NOT viewing a specific assignment
    ...(!selectedAssignment ? [{
      key: 'assignmentTitle',
      header: 'Assignment',
      render: (value, item) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize`}>
              {item.type}
            </span>
            {item.lateSubmission && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                Late
              </span>
            )}
          </div>
        </div>
      )
    }] : []),
    {
      key: 'submittedAt',
      header: 'Submitted',
      render: (value) => (
        <div>
          <p className="text-sm text-gray-900">{value.toLocaleDateString()}</p>
          <p className="text-xs text-gray-500">{formatTimeAgo(value)}</p>
        </div>
      )
    },
    {
      key: 'fileCount',
      header: 'Files',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <FileText className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-900">{value}</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (_, item) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openReviewModal(item)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="View & Grade"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-1 text-green-600 hover:text-green-800" title="Download">
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={() => openReviewModal(item)}
            className="p-1 text-purple-600 hover:text-purple-800"
            title="Feedback"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const getFilteredSubmissions = () => {
    let filtered = submissions;

    // Filter by selected assignment if one is selected
    if (selectedAssignment) {
      filtered = filtered.filter(s => s.assignmentId === selectedAssignment.id);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(s => s.status === filterType);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        s =>
          s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!classData) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Classroom not found</h2>
          <Link
            to="/faculty/classroom"
            className="inline-flex items-center mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Classroom
          </Link>
        </div>
      </AppLayout>
    );
  }

  const filteredSubmissions = getFilteredSubmissions();
  const pendingCount = submissions.filter(s => s.status === 'pending').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl shadow-sm">
          <div className="p-6">
            <Link
              to="/faculty/classroom"
              className="inline-flex items-center text-white hover:text-green-100 transition-colors mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Classroom
            </Link>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{classData.name}</h1>
                <p className="text-lg opacity-90 mb-2">
                  {classData.code} • Section {classData.section} • {classData.semester}
                </p>
                <p className="text-sm opacity-80">{classData.description}</p>
              </div>
              <div className="w-16 h-16 bg-white text-black bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold">{classData.avatar}</span>
              </div>
            </div>

            <div className="flex items-center space-x-6 mt-4 text-sm opacity-90">
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {classData.students} students
              </span>
              <span className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                {classData.totalAssignments} assignments
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {classData.activeAssignments} active
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Assignments</p>
                <p className="text-3xl font-bold text-blue-600">{assignments.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Assignments</p>
                <p className="text-3xl font-bold text-green-600">{classData.activeAssignments}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Reviews</p>
                <p className="text-3xl font-bold text-orange-600">{pendingCount}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
                <p className="text-3xl font-bold text-purple-600">{submissions.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Upload className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('assignments')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'assignments'
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="h-4 w-4 inline mr-2" />
                  Assignments ({assignments.length})
                </button>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'submissions'
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Upload className="h-4 w-4 inline mr-2" />
                  Submissions ({submissions.length})
                  {pendingCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'students'
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Users className="h-4 w-4 inline mr-2" />
                  Students ({classData.students})
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="h-4 w-4 inline mr-2" />
                  Analytics
                </button>
              </div>

              {activeTab === 'assignments' && (
                <button 
                  onClick={() => setShowCreateAssignmentModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Assignment
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Assignments Tab */}
            {activeTab === 'assignments' && (
              <div className="space-y-4">
                <DataTable
                  data={assignments}
                  columns={assignmentColumns}
                  searchable={true}
                  searchPlaceholder="Search assignments..."
                  pagination={true}
                  className="border-0 shadow-none"
                />
              </div>
            )}

            {/* Submissions Tab */}
            {activeTab === 'submissions' && (
              <div className="space-y-4">
                {/* Show assignment info and back button when viewing specific assignment */}
                {selectedAssignment && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={handleBackToAssignments}
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                        >
                          <ArrowLeft className="h-5 w-5 text-green-600" />
                        </button>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {selectedAssignment.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {selectedAssignment.description}
                          </p>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium capitalize">
                              {selectedAssignment.type}
                            </span>
                            <span className="text-sm text-gray-600">
                              Due: {selectedAssignment.dueDate.toLocaleDateString()}
                            </span>
                            <span className="text-sm text-gray-600">
                              {filteredSubmissions.length} submissions
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="graded">Graded</option>
                      <option value="resubmit">Need Resubmit</option>
                    </select>
                  </div>
                </div>

                <DataTable
                  data={filteredSubmissions}
                  columns={submissionColumns}
                  searchable={false}
                  pagination={true}
                  onRowClick={openReviewModal}
                  className="border-0 shadow-none"
                />
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Student List</h3>
                <p className="text-gray-600">
                  Student management features coming soon
                </p>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Class Analytics</h3>
                <p className="text-gray-600">
                  Detailed analytics and performance metrics coming soon
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submission Detail Modal with Version Tracking */}
      <SubmissionDetailModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        submission={selectedSubmission}
        onSubmitDecision={submitFeedback}
      />

      {/* Create Assignment Modal */}
      <CreateAssignmentModal
        isOpen={showCreateAssignmentModal}
        onClose={() => setShowCreateAssignmentModal(false)}
        onCreateAssignment={handleCreateAssignment}
        classroomId={classId}
      />
    </AppLayout>
  );
};

export default FacultyClassroomDetail;
