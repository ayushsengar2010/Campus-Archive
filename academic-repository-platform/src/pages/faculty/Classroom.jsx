import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  BookOpen,
  Users,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  FolderOpen
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import CreateClassroomModal from '../../components/ui/CreateClassroomModal';
import { useAuth } from '../../hooks/useAuth';

/**
 * Faculty Classroom Management Page
 * Shows all classes taught by the faculty with assignments and student submissions
 */
const FacultyClassroom = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, completed
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockClasses = [
        {
          id: '1',
          name: 'Computer Science IV',
          code: 'CS 401',
          section: 'A',
          semester: 'Fall 2024',
          color: 'bg-blue-600',
          avatar: 'CS',
          students: 45,
          totalAssignments: 8,
          activeAssignments: 3,
          pendingSubmissions: 12,
          gradedSubmissions: 28,
          nextDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          recentActivity: 'New assignment posted: Database Design',
          assignmentTypes: {
            assignment: 5,
            project: 2,
            quiz: 1
          }
        },
        {
          id: '2',
          name: 'Data Structures & Algorithms',
          code: 'CS 301',
          section: 'B',
          semester: 'Fall 2024',
          color: 'bg-green-600',
          avatar: 'DS',
          students: 52,
          totalAssignments: 12,
          activeAssignments: 5,
          pendingSubmissions: 25,
          gradedSubmissions: 35,
          nextDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          recentActivity: 'Due tomorrow: Binary Search Tree Implementation',
          assignmentTypes: {
            assignment: 8,
            project: 3,
            quiz: 1
          }
        },
        {
          id: '3',
          name: 'Introduction to Programming',
          code: 'CS 101',
          section: 'C',
          semester: 'Fall 2024',
          color: 'bg-purple-600',
          avatar: 'IP',
          students: 68,
          totalAssignments: 15,
          activeAssignments: 4,
          pendingSubmissions: 35,
          gradedSubmissions: 58,
          nextDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          recentActivity: 'Student submitted: Python Basics Assignment',
          assignmentTypes: {
            assignment: 10,
            project: 3,
            quiz: 2
          }
        },
        {
          id: '4',
          name: 'Advanced Web Development',
          code: 'CS 501',
          section: 'A',
          semester: 'Fall 2024',
          color: 'bg-orange-600',
          avatar: 'WD',
          students: 32,
          totalAssignments: 10,
          activeAssignments: 2,
          pendingSubmissions: 8,
          gradedSubmissions: 45,
          nextDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          recentActivity: 'Graded: React Portfolio Project',
          assignmentTypes: {
            assignment: 4,
            project: 5,
            quiz: 1
          }
        }
      ];

      setClasses(mockClasses);
      setLoading(false);
    };

    fetchClasses();
  }, []);

  const getDaysUntilDeadline = (date) => {
    const now = new Date();
    const diffInDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Due today';
    if (diffInDays === 1) return 'Due tomorrow';
    if (diffInDays > 0) return `Due in ${diffInDays} days`;
    return 'Overdue';
  };

  const getFilteredClasses = () => {
    let filtered = classes;

    // Filter by status
    if (filterStatus === 'active') {
      filtered = filtered.filter(c => c.activeAssignments > 0);
    } else if (filterStatus === 'completed') {
      filtered = filtered.filter(c => c.activeAssignments === 0);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        c =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const totalStats = {
    totalClasses: classes.length,
    totalStudents: classes.reduce((sum, c) => sum + c.students, 0),
    pendingReviews: classes.reduce((sum, c) => sum + c.pendingSubmissions, 0),
    activeAssignments: classes.reduce((sum, c) => sum + c.activeAssignments, 0)
  };

  const filteredClasses = getFilteredClasses();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Classroom </h1>
              
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 font-medium transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Classroom
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Classes</p>
                <p className="text-3xl font-bold text-blue-600">{totalStats.totalClasses}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-green-600">{totalStats.totalStudents}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Reviews</p>
                <p className="text-3xl font-bold text-orange-600">{totalStats.pendingReviews}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Assignments</p>
                <p className="text-3xl font-bold text-purple-600">{totalStats.activeAssignments}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Classes
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
                <div className="h-24 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredClasses.length === 0 ? (
            <div className="col-span-2 bg-white rounded-lg shadow-sm border p-12 text-center">
              <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
              <p className="text-gray-600">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'No classes match the selected filter'}
              </p>
            </div>
          ) : (
            filteredClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-all group"
              >
                {/* Class Header */}
                <div className={`${classItem.color} p-6 text-white relative`}>
                  {/* Completed Badge */}
                  {classItem.status === 'completed' && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold mb-1">
                        {classItem.name}
                      </h3>
                      <p className="text-sm opacity-90">
                        {classItem.code} • Section {classItem.section} • {classItem.semester}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white text-black bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold">{classItem.avatar}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm opacity-90">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {classItem.students} students
                    </span>
                    <span className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {classItem.totalAssignments} assignments
                    </span>
                  </div>
                </div>

                {/* Class Content */}
                <div className="p-6 space-y-4">
                  {/* Assignment Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {classItem.activeAssignments}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">Active</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {classItem.pendingSubmissions}
                      </p>
                      <p className="text-xs text-orange-600 mt-1">Pending</p>
                    </div>
                  </div>

                  {/* Assignment Types Breakdown */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2 font-medium">Assignment Types</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        <span className="text-gray-700">Assignments: {classItem.assignmentTypes.assignment}</span>
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-gray-700">Projects: {classItem.assignmentTypes.project}</span>
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        <span className="text-gray-700">Quizzes: {classItem.assignmentTypes.quiz}</span>
                      </span>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      {classItem.recentActivity}
                    </p>
                  </div>

                  {/* Next Deadline */}
                  {classItem.nextDeadline && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">
                          Next deadline
                        </span>
                      </div>
                      <span className="text-sm text-yellow-700 font-medium">
                        {getDaysUntilDeadline(classItem.nextDeadline)}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                    <Link
                      to={`/faculty/classroom/${classItem.id}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Class
                    </Link>
                    <button
                      onClick={() => {
                        const isCompleted = classItem.status === 'completed';
                        // Toggle classroom complete status
                        setClasses(prev => 
                          prev.map(c => 
                            c.id === classItem.id 
                              ? { ...c, status: isCompleted ? 'active' : 'completed' }
                              : c
                          )
                        );
                        alert(isCompleted ? 'Classroom marked as active!' : 'Classroom marked as complete!');
                      }}
                      className={`px-4 py-2 inline-flex items-center rounded-lg transition-colors text-sm font-medium ${
                        classItem.status === 'completed'
                          ? 'bg-gray-600 text-white hover:bg-gray-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      title={classItem.status === 'completed' ? 'Mark as Active' : 'Mark as Complete'}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {classItem.status === 'completed' ? 'Uncomplete' : 'Complete'}
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Analytics">
                      <BarChart3 className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Create Classroom Modal */}
      <CreateClassroomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateClassroom={(newClassroom) => {
          setClasses(prev => [newClassroom, ...prev]);
          alert('Classroom created successfully!');
        }}
      />
    </AppLayout>
  );
};

export default FacultyClassroom;
