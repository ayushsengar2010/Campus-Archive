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

    useEffect(() => {
        const fetchClassroomData = async () => {
            setLoading(true);

            // Mock API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock classroom data
            const mockClassData = {
                id: classId,
                name: 'Biomedical Text Mining',
                code: 'CSE',
                instructor: 'Yogesh Gupta',
                color: 'bg-gray-700',
                avatar: 'Y',
                students: 45,
                description: 'Advanced course covering text mining techniques in biomedical literature and data analysis.',
                semester: 'Fall 2024'
            };

            // Mock subjects data
            const mockSubjects = [
                {
                    id: '1',
                    name: 'Introduction to Text Mining',
                    description: 'Basic concepts and techniques in text mining',
                    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                    status: 'pending',
                    maxMarks: 100,
                    type: 'Assignment',
                    instructions: 'Complete the assignment by following the guidelines in the attached document. Submit your work in PDF format with proper citations and references.',
                    documents: [
                        { id: '1', name: 'Assignment_Guidelines.pdf', size: '2.5 MB', type: 'pdf', url: '#' },
                        { id: '2', name: 'Reference_Material.docx', size: '1.8 MB', type: 'docx', url: '#' },
                        { id: '3', name: 'Sample_Output.pdf', size: '850 KB', type: 'pdf', url: '#' }
                    ],
                    requirements: [
                        'Read all reference materials before starting',
                        'Follow the format specified in the guidelines',
                        'Include proper citations for all sources',
                        'Submit before the deadline'
                    ]
                },
                {
                    id: '2',
                    name: 'Natural Language Processing',
                    description: 'NLP techniques for biomedical text processing',
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    status: 'pending',
                    maxMarks: 150,
                    type: 'Project',
                    instructions: 'Implement NLP algorithms for biomedical text analysis. Your project should include data preprocessing, model training, and evaluation metrics.',
                    documents: [
                        { id: '1', name: 'Project_Specification.pdf', size: '3.2 MB', type: 'pdf', url: '#' },
                        { id: '2', name: 'Dataset_Description.xlsx', size: '500 KB', type: 'xlsx', url: '#' },
                        { id: '3', name: 'Starter_Code.zip', size: '5.1 MB', type: 'zip', url: '#' }
                    ],
                    requirements: [
                        'Use the provided dataset only',
                        'Implement at least 3 NLP techniques',
                        'Include detailed documentation',
                        'Provide evaluation results with graphs'
                    ]
                },
                {
                    id: '3',
                    name: 'Literature Review Analysis',
                    description: 'Systematic review and analysis of biomedical literature',
                    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                    status: 'Pending',
                    maxMarks: 200,
                    type: 'research',
                    instructions: 'Conduct a comprehensive literature review on the assigned topic. Analyze at least 20 research papers and provide a critical summary.',
                    documents: [
                        { id: '1', name: 'Review_Template.docx', size: '1.2 MB', type: 'docx', url: '#' },
                        { id: '2', name: 'Citation_Guide.pdf', size: '900 KB', type: 'pdf', url: '#' },
                        { id: '3', name: 'Paper_List.xlsx', size: '350 KB', type: 'xlsx', url: '#' }
                    ],
                    requirements: [
                        'Review minimum 20 research papers',
                        'Use the provided template',
                        'Include proper citations in APA format',
                        'Add your own critical analysis'
                    ]
                },
                {
                    id: '4',
                    name: 'Data Mining Techniques',
                    description: 'Advanced data mining methods for biomedical data',
                    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                    status: 'pending',
                    maxMarks: 120,
                    type: 'assignment',
                    instructions: 'Apply various data mining techniques to the biomedical dataset and compare their performance.',
                    documents: [
                        { id: '1', name: 'Assignment_Brief.pdf', size: '1.5 MB', type: 'pdf', url: '#' },
                        { id: '2', name: 'Dataset.csv', size: '10 MB', type: 'csv', url: '#' },
                        { id: '3', name: 'Evaluation_Metrics.pdf', size: '750 KB', type: 'pdf', url: '#' }
                    ],
                    requirements: [
                        'Use at least 5 different data mining techniques',
                        'Compare performance using standard metrics',
                        'Provide visualization of results',
                        'Submit code along with report'
                    ]
                }
            ];

            setClassData(mockClassData);
            setSubjects(mockSubjects);
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
            case 'Assignment': return 'bg-blue-100 text-blue-800';
            case 'Project': return 'bg-green-100 text-green-800';
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
        switch(type) {
            case 'pdf': return '📄';
            case 'docx': case 'doc': return '📝';
            case 'xlsx': case 'xls': return '📊';
            case 'zip': return '📦';
            case 'csv': return '📈';
            default: return '📁';
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="space-y-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-32 bg-gray-200 rounded mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-40 bg-gray-200 rounded"></div>
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
                    <h2 className="text-2xl font-bold text-gray-900">Classroom not found</h2>
                    <p className="text-gray-600 mt-2">The requested classroom could not be found.</p>
                    <Link
                        to="/student/classroom"
                        className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
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
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                <BookOpen className="h-5 w-5 mr-2" />
                                Subjects & Assignments
                            </h2>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {subjects.length} subjects available
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subjects.map((subject) => (
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

                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${subject.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            <Clock className="h-3 w-3 mr-1" />
                                            {subject.status === 'pending' ? 'Pending' : 'Submitted'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {subjects.length === 0 && (
                            <div className="text-center py-12">
                                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects available</h3>
                                <p className="text-gray-600">
                                    No subjects or assignments have been posted for this class yet.
                                </p>
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
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Assignment Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-sm text-blue-600 mb-1">Type</div>
                                    <div className="font-semibold text-gray-900 capitalize">{selectedSubject.type}</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-sm text-green-600 mb-1">Max Marks</div>
                                    <div className="font-semibold text-gray-900">{selectedSubject.maxMarks}</div>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <div className="text-sm text-orange-600 mb-1">Due Date</div>
                                    <div className="font-semibold text-gray-900">{getDaysUntilDeadline(selectedSubject.dueDate)}</div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="text-sm text-purple-600 mb-1">Status</div>
                                    <div className="font-semibold text-gray-900 capitalize">{selectedSubject.status}</div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                                    Instructions
                                </h3>
                                <p className="text-gray-700 leading-relaxed">{selectedSubject.instructions}</p>
                            </div>

                            {/* Requirements */}
                            {selectedSubject.requirements && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <CheckCircle className="h-5 w-5 mr-2 text-yellow-600" />
                                        Requirements
                                    </h3>
                                    <ul className="space-y-2">
                                        {selectedSubject.requirements.map((req, index) => (
                                            <li key={index} className="flex items-start text-gray-700">
                                                <span className="text-yellow-600 mr-2">•</span>
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Documents */}
                            {selectedSubject.documents && selectedSubject.documents.length > 0 && (
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <File className="h-5 w-5 mr-2 text-blue-600" />
                                        Documents & Resources ({selectedSubject.documents.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedSubject.documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
                                            >
                                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                    <div className="text-3xl flex-shrink-0">
                                                        {getFileIcon(doc.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                                            {doc.name}
                                                        </h4>
                                                        <p className="text-xs text-gray-500">
                                                            {doc.size} • {doc.type.toUpperCase()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={doc.url}
                                                    download
                                                    className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Download className="h-4 w-4 mr-1" />
                                                    Download
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end space-x-3">
                            <button
                                onClick={closeDetailModal}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    closeDetailModal();
                                    handleSubjectClick(selectedSubject);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
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