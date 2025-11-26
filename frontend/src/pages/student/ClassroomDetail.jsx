import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    BookOpen,
    Users,
    Calendar,
    FileText,
    MessageSquare,
    Clock,
    Upload,
    Eye,
    Download,
    X,
    File,
    CheckCircle
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import apiService from '../../services/apiService';


/**
 * Individual Classroom Detail Page
 */
const ClassroomDetail = () => {
    const { classId } = useParams();
    const navigate = useNavigate();

    const [classData, setClassData] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'completed'
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const fetchClassroomData = async () => {
            setLoading(true);
            try {
                // Fetch classroom details from backend
                const classroomData = await apiService.getClassroom(classId);
                
                setClassData({
                    id: classroomData._id,
                    name: classroomData.name,
                    code: classroomData.code,
                    instructor: classroomData.faculty?.name || 'Unknown',
                    color: 'bg-gradient-to-r from-blue-600 to-indigo-700',
                    avatar: classroomData.name?.charAt(0) || 'C',
                    students: classroomData.students?.length || 0,
                    description: classroomData.description || 'No description available',
                    semester: classroomData.semester || 'Current Semester'
                });

                // Fetch assignments (subjects) for this classroom
                const assignmentsData = await apiService.getAssignments({ classroom: classId });
                const assignments = Array.isArray(assignmentsData) ? assignmentsData : [];
                
                // Fetch user submissions to determine status
                const submissionsData = await apiService.getSubmissions({ classroom: classId });
                const userSubmissions = Array.isArray(submissionsData) ? submissionsData : [];
                setSubmissions(userSubmissions);
                
                const transformedSubjects = assignments.map(assignment => {
                    const submission = userSubmissions.find(sub => {
                        const subAssignmentId = sub.assignment?._id || sub.assignment;
                        return subAssignmentId === assignment._id;
                    });
                    
                    // Determine status based on submission
                    let status = 'pending';
                    if (submission) {
                        // Map backend status to UI status
                        if (submission.status === 'accepted' || submission.status === 'graded') {
                            status = 'completed';
                        } else if (submission.status === 'submitted' || submission.status === 'pending') {
                            status = 'completed'; // Already submitted, show in completed
                        } else {
                            status = 'completed'; // Any submission means it's in completed
                        }
                    }
                    
                    return {
                        id: assignment._id,
                        name: assignment.title,
                        description: assignment.description || 'No description',
                        dueDate: new Date(assignment.dueDate),
                        status: status,
                        submissionId: submission?._id,
                        grade: submission?.marks,
                        submittedAt: submission?.submittedAt,
                        maxMarks: assignment.maxMarks || 100,
                        type: assignment.type || 'Assignment',
                        instructions: assignment.instructions || 'Follow the assignment guidelines',
                        documents: assignment.attachments || [], // Get attachments from backend
                        requirements: (() => {
                            const reqs = [];
                            // Add required fields if they exist
                            if (assignment.requiredFields) {
                                if (assignment.requiredFields.report) reqs.push('Submit a detailed report');
                                if (assignment.requiredFields.presentation) reqs.push('Prepare a presentation');
                                if (assignment.requiredFields.code) reqs.push('Include source code');
                                if (assignment.requiredFields.githubLink) reqs.push('Provide GitHub repository link');
                            }
                            // If no specific requirements, add generic ones based on type
                            if (reqs.length === 0) {
                                if (assignment.type === 'project') {
                                    reqs.push('Complete the project as per assignment description');
                                    reqs.push('Submit all required deliverables');
                                    reqs.push('Follow coding standards and documentation guidelines');
                                } else if (assignment.type === 'assignment') {
                                    reqs.push('Complete the assignment as per instructions');
                                    reqs.push('Submit before the due date');
                                    reqs.push('Ensure proper formatting and documentation');
                                } else {
                                    reqs.push('Complete the work as per assignment guidelines');
                                    reqs.push('Submit all required materials');
                                }
                            }
                            return reqs;
                        })()
                    };
                });

                setSubjects(transformedSubjects);
            } catch (error) {
                console.error('Error fetching classroom data:', error);
                setClassData(null);
                setSubjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchClassroomData();
    }, [classId]);

    const getDaysUntilDeadline = (date) => {
        const now = new Date();
        const diffInDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Due today';
        if (diffInDays === 1) return 'Due tomorrow';
        if (diffInDays > 0) return `Due in ${diffInDays} days`;
        return `Overdue`;
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'assignment': return <FileText className="h-5 w-5" />;
            case 'project': return <BookOpen className="h-5 w-5" />;
            case 'research': return <Eye className="h-5 w-5" />;
            default: return <FileText className="h-5 w-5" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'assignment': return 'bg-blue-100 text-blue-800';
            case 'project': return 'bg-green-100 text-green-800';
            case 'research': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleSubjectClick = (subject) => {
        navigate(`/student/submit-work/${classId}/${subject.id}`, {
            state: {
                classData,
                subject,
                className: classData.name,
                subjectName: subject.name
            }
        });
    };

    const handleViewDetails = (subject) => {
        setSelectedSubject(subject);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedSubject(null);
    };

    const getFileIcon = (type) => {
        const fileType = type?.toLowerCase() || '';
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('doc')) return '📝';
        if (fileType.includes('xls') || fileType.includes('sheet')) return '📊';
        if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
        if (fileType.includes('csv')) return '📈';
        if (fileType.includes('ppt') || fileType.includes('presentation')) return '📊';
        if (fileType.includes('image') || fileType.includes('png') || fileType.includes('jpg')) return '🖼️';
        return '📁';
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return 'Unknown size';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="space-y-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!classData) {
        return (
            <AppLayout>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Classroom not found</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">The requested classroom could not be found.</p>
                    <Link
                        to="/student/classroom"
                        className="inline-flex items-center mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Classroom
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header with Class Info */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 text-white rounded-xl shadow-sm transition-colors duration-300">
                    <div className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <Link
                                to="/student/classroom"
                                className="inline-flex items-center text-white hover:text-blue-100 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back to Classroom
                            </Link>
                        </div>

                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold mb-2">{classData.name}</h1>
                                <p className="text-lg opacity-90 mb-2">{classData.code}</p>
                                <p className="opacity-80">{classData.instructor}</p>
                                <p className="text-sm opacity-70 mt-2">{classData.description}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-white text-black bg-opacity-20 rounded-full flex items-center justify-center">
                                    <span className="text-2xl font-bold">{classData.avatar}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6 mt-4 text-sm opacity-90">
                            <span className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {classData.students} students
                            </span>
                            <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {classData.semester}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Subjects/Assignments Grid */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-300">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                <BookOpen className="h-5 w-5 mr-2" />
                                Subjects & Assignments
                            </h2>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {subjects.length} subjects available
                            </span>
                        </div>
                        
                        {/* Tabs */}
                        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                    activeTab === 'pending'
                                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <div className="flex items-center justify-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Pending ({subjects.filter(s => s.status === 'pending').length})
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('completed')}
                                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                    activeTab === 'completed'
                                        ? 'bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <div className="flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Completed ({subjects.filter(s => s.status === 'completed').length})
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subjects.filter(s => s.status === activeTab).map((subject) => (
                                <div
                                    key={subject.id}
                                    className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-gray-100 dark:bg-gray-600 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                                            {getTypeIcon(subject.type)}
                                        </div>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(subject.type)}`}>
                                            {subject.type}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {subject.name}
                                    </h3>

                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                        {subject.description}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Max Marks:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{subject.maxMarks}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Due Date:</span>
                                            <span className="font-medium text-orange-600 dark:text-orange-400">
                                                {getDaysUntilDeadline(subject.dueDate)}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Documents:</span>
                                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                                {subject.documents?.length || 0} files
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-600 space-y-2">
                                        <button
                                            onClick={() => handleViewDetails(subject)}
                                            className="w-full flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </button>
                                        
                                        <button
                                            onClick={() => handleSubjectClick(subject)}
                                            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Submit Work
                                        </button>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                                        {subject.status === 'completed' ? (
                                            <div className="flex items-center justify-between">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Submitted
                                                </span>
                                                {subject.grade !== undefined && (
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {subject.grade}/{subject.maxMarks}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                <Clock className="h-3 w-3 mr-1" />
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {subjects.filter(s => s.status === activeTab).length === 0 && (
                            <div className="text-center py-12">
                                {activeTab === 'pending' ? (
                                    <>
                                        <Clock className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No pending assignments</h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            You're all caught up! No pending assignments at the moment.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No completed assignments</h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Assignments you submit will appear here.
                                        </p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link
                            to="/student/submissions"
                            className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">My Submissions</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">View all submissions</p>
                            </div>
                        </Link>

                        <Link
                            to="/student/submit"
                            className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Upload className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Submit New Work</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Upload new project</p>
                            </div>
                        </Link>

                        <button className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Class Discussion</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Join class chat</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedSubject && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col transition-colors duration-300">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedSubject.name}</h2>
                                <p className="text-gray-600 dark:text-gray-300 mt-1">{selectedSubject.description}</p>
                            </div>
                            <button
                                onClick={closeDetailModal}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Assignment Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                                    <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Type</div>
                                    <div className="font-semibold text-gray-900 dark:text-white capitalize">{selectedSubject.type}</div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                                    <div className="text-sm text-green-600 dark:text-green-400 mb-1">Max Marks</div>
                                    <div className="font-semibold text-gray-900 dark:text-white">{selectedSubject.maxMarks}</div>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
                                    <div className="text-sm text-orange-600 dark:text-orange-400 mb-1">Due Date</div>
                                    <div className="font-semibold text-gray-900 dark:text-white">{getDaysUntilDeadline(selectedSubject.dueDate)}</div>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                                    <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Status</div>
                                    <div className="font-semibold text-gray-900 dark:text-white capitalize">{selectedSubject.status}</div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                    Instructions
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedSubject.instructions}</p>
                            </div>

                            {/* Requirements */}
                            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                    <CheckCircle className="h-5 w-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                                    Requirements
                                </h3>
                                <ul className="space-y-2">
                                    {selectedSubject.requirements && selectedSubject.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                                            <span className="text-yellow-600 dark:text-yellow-400 mr-2">•</span>
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Documents */}
                            {selectedSubject.documents && selectedSubject.documents.length > 0 && (
                                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                        <File className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                        Documents & Resources ({selectedSubject.documents.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedSubject.documents.map((doc, index) => (
                                            <div
                                                key={doc._id || index}
                                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 rounded-lg border border-gray-200 dark:border-gray-500 transition-colors group"
                                            >
                                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                    <div className="text-3xl flex-shrink-0">
                                                        {getFileIcon(doc.mimetype || doc.type || '')}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                            {doc.originalName || doc.filename || doc.name || 'Untitled'}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {formatFileSize(doc.size)} • {(doc.mimetype || doc.type || 'file').split('/').pop().toUpperCase()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const link = document.createElement('a');
                                                        link.href = `http://localhost:5000${doc.path}`;
                                                        link.download = doc.originalName || doc.filename || doc.name || 'download';
                                                        link.target = '_blank';
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                    }}
                                                    className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Download className="h-4 w-4 mr-1" />
                                                    Download
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex items-center justify-end space-x-3">
                            <button
                                onClick={closeDetailModal}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    closeDetailModal();
                                    handleSubjectClick(selectedSubject);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all flex items-center shadow-md hover:shadow-lg"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Submit Work
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
};

export default ClassroomDetail;