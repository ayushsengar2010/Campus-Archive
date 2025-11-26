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
import apiService from '../../services/apiService';
import JoinClassroomModal from '../../components/ui/JoinClassroomModal';

/**
 * Student Classroom Page - Google Classroom Style
 */
const StudentClassroom = () => {
  const { user } = useAuth();
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        // Fetch student's enrolled classrooms from backend
        const classroomsData = await apiService.getClassrooms();
        const classrooms = Array.isArray(classroomsData) ? classroomsData : [];
        
        // Fetch all student submissions once
        const submissionsData = await apiService.getSubmissions();
        const submissions = Array.isArray(submissionsData) ? submissionsData : [];
        const submittedAssignmentIds = submissions.map(sub => 
          sub.assignment?._id || sub.assignment
        );
        
        // Transform backend data to match component structure
        const transformedClasses = await Promise.all(classrooms.map(async (classroom) => {
          try {
            // Fetch assignments for each classroom
            const assignmentsData = await apiService.getAssignments({ classroom: classroom._id });
            const assignments = Array.isArray(assignmentsData) ? assignmentsData : [];
            
            // Find next deadline - exclude already submitted assignments
            const now = new Date();
            const upcomingAssignments = assignments
              .filter(a => {
                const isUpcoming = new Date(a.dueDate) > now;
                const isNotSubmitted = !submittedAssignmentIds.includes(a._id);
                return isUpcoming && isNotSubmitted;
              })
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            
            const nextDeadline = upcomingAssignments.length > 0 
              ? new Date(upcomingAssignments[0].dueDate)
              : null;

            return {
              id: classroom._id,
              name: classroom.name,
              code: classroom.code,
              instructor: classroom.faculty?.name || 'Unknown',
              color: classroom.color || 'bg-blue-600',
              avatar: classroom.name?.charAt(0) || 'C',
              students: classroom.students?.length || 0,
              assignments: assignments.length,
              nextDeadline: nextDeadline,
              recentActivity: upcomingAssignments.length > 0 
                ? `Due: ${upcomingAssignments[0].title}`
                : 'No upcoming assignments'
            };
          } catch (error) {
            console.error(`Error fetching data for classroom ${classroom._id}:`, error);
            return {
              id: classroom._id,
              name: classroom.name,
              code: classroom.code,
              instructor: classroom.faculty?.name || 'Unknown',
              color: classroom.color || 'bg-blue-600',
              avatar: classroom.faculty?.name?.charAt(0) || 'C',
              students: classroom.students?.length || 0,
              assignments: 0,
              nextDeadline: null,
              recentActivity: 'Loading...'
            };
          }
        }));
        
        setEnrolledClasses(transformedClasses);
      } catch (error) {
        console.error('Error fetching classrooms:', error);
        setEnrolledClasses([]);
      } finally {
        setLoading(false);
      }
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

  /**
   * Handle joining a classroom with course code
   */
  const handleJoinClassroom = async (courseCode) => {
    try {
      // Call backend API to join classroom
      const classroom = await apiService.joinClassroom(courseCode);
      
      // Transform the new classroom to match UI format
      const newClassroom = {
        id: classroom._id,
        name: classroom.name,
        code: classroom.code,
        instructor: classroom.faculty?.name || 'Unknown',
        color: classroom.color || 'bg-blue-600',
        avatar: classroom.faculty?.name?.charAt(0) || 'C',
        students: classroom.students?.length || 0,
        assignments: 0,
        nextDeadline: null,
        recentActivity: 'No upcoming assignments'
      };
      
      // Add to enrolled classes
      setEnrolledClasses(prev => [newClassroom, ...prev]);
      
      alert(`Successfully joined ${classroom.name}!`);
    } catch (error) {
      console.error('Error joining classroom:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to join classroom';
      throw new Error(errorMessage);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 text-white p-6 rounded-xl shadow-sm transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Classroom </h1>
              <p className="text-blue-100">
                Welcome back, {user?.name?.split(' ')[0]}! You have {enrolledClasses.length} enrolled classes.
              </p>
            </div>
            <button
              onClick={() => setShowJoinModal(true)}
              className="mt-4 sm:mt-0 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2 font-medium shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Join Class</span>
            </button>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden animate-pulse">
                <div className="h-24 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : (
            enrolledClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Class Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 p-4 text-white relative">
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
                      <div className="w-10 h-10 bg-white text-black bg-opacity-20 rounded-full flex items-center justify-center">
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
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
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
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
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
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                        <Folder className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors">
                        <ClipboardList className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors">
                        <Calendar className="h-4 w-4" />
                      </button>
                    </div>
                    <Link
                      to={`/student/classroom/${classItem.id}`}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No classes enrolled</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You haven't enrolled in any classes yet. Join a class using the course code provided by your instructor.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowJoinModal(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Join a Class
              </button>
              <Link
                to="/student"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {!loading && enrolledClasses.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {enrolledClasses.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Enrolled Classes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {enrolledClasses.reduce((sum, c) => sum + c.assignments, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Assignments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {enrolledClasses.reduce((sum, c) => sum + c.students, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Classmates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {enrolledClasses.filter(c => c.nextDeadline && getDaysUntilDeadline(c.nextDeadline).includes('Due')).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming Deadlines</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Join Classroom Modal */}
      <JoinClassroomModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoinClassroom={handleJoinClassroom}
      />
    </AppLayout>
  );
};

export default StudentClassroom;