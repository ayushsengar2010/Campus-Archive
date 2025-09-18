import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  BookOpen, 
  Users, 
  Calendar, 
  Clock,
  FileText,
  MessageSquare,
  MoreVertical,
  ClipboardList,
  Folder,
  ArrowLeft,
  Home
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../hooks/useAuth';

/**
 * Student Classroom Page - Google Classroom Style
 */
const StudentClassroom = () => {
  const { user } = useAuth();
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockClasses = [
        {
          id: '1',
          name: 'Biomedical Text Mining',
          code: 'CSE',
          instructor: 'Yogesh Gupta',
          color: 'bg-gray-700',
          avatar: 'Y',
          students: 45,
          assignments: 8,
          nextDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          recentActivity: 'New assignment posted: Literature Review'
        },
        {
          id: '2',
          name: 'Statistical Learning AY 2024-25',
          code: 'STAT 401',
          instructor: 'Arjit Maitra',
          color: 'bg-blue-600',
          avatar: 'A',
          students: 32,
          assignments: 12,
          nextDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          recentActivity: 'Due Sunday: Report of Literature Review (15 Marks)'
        },
        {
          id: '3',
          name: 'Computer Vision-I',
          code: 'CS 501',
          instructor: 'Manisha Saini',
          color: 'bg-teal-600',
          avatar: 'M',
          students: 28,
          assignments: 6,
          nextDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          recentActivity: 'New material uploaded: CNN Architectures'
        },
        {
          id: '4',
          name: 'VIBE Learn with Fun',
          code: 'VIBE',
          instructor: 'Arun Kumar Pooria',
          color: 'bg-blue-500',
          avatar: 'A',
          students: 50,
          assignments: 4,
          nextDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          recentActivity: 'Class scheduled for tomorrow'
        },
        {
          id: '5',
          name: 'Cryptography_CSE IV',
          code: 'CS 402',
          instructor: 'Premod Maurya',
          color: 'bg-green-600',
          avatar: 'P',
          students: 35,
          assignments: 10,
          nextDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          recentActivity: 'Assignment graded: RSA Implementation'
        },
        {
          id: '6',
          name: 'Excel-Novice to competent',
          code: '2025-Jan-June',
          instructor: 'Suchitra Chauhan',
          color: 'bg-red-500',
          avatar: 'S',
          students: 60,
          assignments: 15,
          nextDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          recentActivity: 'New tutorial: Advanced Formulas'
        }
      ];
      
      setEnrolledClasses(mockClasses);
      setLoading(false);
    };

    fetchClasses();
  }, []);

  /**
   * Format days until deadline
   */
  const getDaysUntilDeadline = (date) => {
    const now = new Date();
    const diffInDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Due today';
    if (diffInDays === 1) return 'Due tomorrow';
    if (diffInDays > 0) return `Due in ${diffInDays} days`;
    return `Overdue`;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to="/student"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Classroom</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.name?.split(' ')[0]}! You have {enrolledClasses.length} enrolled classes.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <Link
                to="/student"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/student/submit"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit Work
              </Link>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
                <div className="h-24 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : (
            enrolledClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              >
                {/* Class Header */}
                <div className={`${classItem.color} p-4 text-white relative`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold truncate group-hover:text-blue-100 transition-colors">
                        {classItem.name}
                      </h3>
                      <p className="text-sm opacity-90 mt-1">
                        {classItem.code}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold">
                          {classItem.avatar}
                        </span>
                      </div>
                      <button className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm opacity-90">
                    <p>{classItem.instructor}</p>
                  </div>
                </div>

                {/* Class Content */}
                <div className="p-4 space-y-3">
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {classItem.students}
                      </span>
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {classItem.assignments}
                      </span>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {classItem.recentActivity}
                      </p>
                    </div>
                  </div>

                  {/* Next Deadline */}
                  {classItem.nextDeadline && (
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-md border border-yellow-200">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">
                          Next deadline
                        </span>
                      </div>
                      <span className="text-sm text-yellow-700">
                        {getDaysUntilDeadline(classItem.nextDeadline)}
                      </span>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Folder className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                        <ClipboardList className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                        <Calendar className="h-4 w-4" />
                      </button>
                    </div>
                    <Link
                      to={`/student/class/${classItem.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Class
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {!loading && enrolledClasses.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No classes enrolled</h3>
            <p className="text-gray-600 mb-6">
              You haven't enrolled in any classes yet. Contact your administrator to get enrolled.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/student"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Link>
              <Link
                to="/student/submissions"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                View My Submissions
              </Link>
              <Link
                to="/student/submit"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit New Work
              </Link>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {!loading && enrolledClasses.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {enrolledClasses.length}
                </div>
                <div className="text-sm text-gray-600">Enrolled Classes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {enrolledClasses.reduce((sum, c) => sum + c.assignments, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Assignments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {enrolledClasses.reduce((sum, c) => sum + c.students, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Classmates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {enrolledClasses.filter(c => c.nextDeadline && getDaysUntilDeadline(c.nextDeadline).includes('Due')).length}
                </div>
                <div className="text-sm text-gray-600">Upcoming Deadlines</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default StudentClassroom;