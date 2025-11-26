import { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, Bookmark, BookmarkCheck, Eye, Download, ExternalLink, Star, Calendar, User, FileText, TrendingUp, X, GitBranch, Code, Folder, Tag, Clock, Award, CheckCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import DataTable from '../components/ui/DataTable';
import { useRepositoryData } from '../hooks/useRepositoryData';
import { useAuth } from '../hooks/useAuth';

const Repository = () => {
    const { user } = useAuth();
    const { submissions, isLoading, bookmarks, toggleBookmark } = useRepositoryData();

    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProject, setSelectedProject] = useState(null); // For detail modal
    const [filters, setFilters] = useState({
        department: '',
        year: '',
        type: '',
        status: 'approved', // Only show approved submissions by default
        showBookmarked: false
    });
    const [showFilters, setShowFilters] = useState(false);

    // Get unique filter options from data
    const filterOptions = useMemo(() => {
        const departments = [...new Set(submissions.map(s => s.metadata?.department).filter(Boolean))];
        const years = [...new Set(submissions.map(s => s.metadata?.year).filter(Boolean))].sort((a, b) => b - a);
        const types = [...new Set(submissions.map(s => s.type).filter(Boolean))];

        return { departments, years, types };
    }, [submissions]);

    // Filter and search submissions
    const filteredSubmissions = useMemo(() => {
        let filtered = submissions.filter(submission => {
            // Only show approved submissions unless user is admin/faculty
            if (!['admin', 'faculty'].includes(user?.role) && submission.status !== 'approved') {
                return false;
            }

            // Apply filters
            if (filters.department && submission.metadata?.department !== filters.department) return false;
            if (filters.year && submission.metadata?.year !== parseInt(filters.year)) return false;
            if (filters.type && submission.type !== filters.type) return false;
            if (filters.status && submission.status !== filters.status) return false;
            if (filters.showBookmarked && !bookmarks.includes(submission.id)) return false;

            // Apply search
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const searchableText = [
                    submission.title,
                    submission.description,
                    submission.tags?.join(' '),
                    submission.metadata?.department,
                    submission.metadata?.course
                ].join(' ').toLowerCase();

                if (!searchableText.includes(query)) return false;
            }

            return true;
        });

        return filtered;
    }, [submissions, filters, searchQuery, bookmarks, user?.role]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            department: '',
            year: '',
            type: '',
            status: 'approved',
            showBookmarked: false
        });
        setSearchQuery('');
    };

    // Download single file
    const downloadFile = async (file) => {
        console.log('Downloading file:', file);
        // Normalize path - replace backslashes with forward slashes
        const normalizedPath = file.path.replace(/\\/g, '/');
        const downloadUrl = `http://localhost:5000/${normalizedPath}`;
        console.log('Download URL:', downloadUrl);
        
        try {
            // First, try to fetch the file to check if it exists
            const response = await fetch(downloadUrl, { method: 'HEAD' });
            console.log('File check response:', response.status);
            
            if (!response.ok) {
                console.error('File not accessible:', response.status, response.statusText);
                alert(`File not found or not accessible (${response.status})`);
                return;
            }
            
            // If file exists, proceed with download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = file.originalName || file.filename || file.name || 'download';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log('Download initiated successfully');
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Error downloading file. Please check console for details.');
        }
    };

    // Download project files
    const downloadProjectFiles = async (project) => {
        console.log('Download project:', project);
        console.log('Files:', project.files);
        
        if (!project.files || project.files.length === 0) {
            console.log('No files to download');
            return;
        }

        try {
            // Download files sequentially with async/await
            for (let i = 0; i < project.files.length; i++) {
                const file = project.files[i];
                downloadFile(file);
                
                // Small delay between downloads to avoid issues
                if (i < project.files.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            }
        } catch (error) {
            console.error('Error downloading files:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800 border-green-200';   
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'project': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'project': return <FileText className="w-3 h-3" />;
            default: return <FileText className="w-3 h-3" />;
        }
    };

    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        switch (ext) {
            case 'pdf': return <FileText className="h-5 w-5 text-red-600" />;
            case 'zip': 
            case 'rar': 
            case '7z': return <Folder className="h-5 w-5 text-yellow-600" />;
            case 'doc':
            case 'docx': return <FileText className="h-5 w-5 text-blue-600" />;
            case 'ppt':
            case 'pptx': return <FileText className="h-5 w-5 text-orange-600" />;
            case 'xls':
            case 'xlsx':
            case 'csv': return <FileText className="h-5 w-5 text-green-600" />;
            case 'java':
            case 'py':
            case 'js':
            case 'cpp':
            case 'c': return <Code className="h-5 w-5 text-purple-600" />;
            default: return <FileText className="h-5 w-5 text-gray-600" />;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    };

    // Table columns for list view
    const columns = [
        {
            key: 'title',
            header: 'Title',
            render: (value, item) => (
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(item.type)}`}>
                            {getTypeIcon(item.type)}
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 truncate">{value}</div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                            <span>{item.metadata?.department}</span>
                            <span>•</span>
                            <span>{item.metadata?.course}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'type',
            header: 'Type',
            render: (value) => (
                <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full border ${getTypeColor(value)}`}>
                    {getTypeIcon(value)}
                    <span className="capitalize">{value}</span>
                </span>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (value) => (
                <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(value)}`}>
                    <CheckCircle className="w-3 h-3" />
                    <span className="capitalize">{value}</span>
                </span>
            )
        },
        {
            key: 'metadata.year',
            header: 'Year',
            render: (value) => (
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{value || 'N/A'}</span>
                </div>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (_, item) => (
                <div className="flex items-center space-x-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(item.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                            bookmarks.includes(item.id) 
                                ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
                                : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                        }`}
                        title={bookmarks.includes(item.id) ? 'Remove bookmark' : 'Add bookmark'}
                    >
                        {bookmarks.includes(item.id) ? (
                            <BookmarkCheck className="w-4 h-4" />
                        ) : (
                            <Bookmark className="w-4 h-4" />
                        )}
                    </button>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(item);
                        }}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            downloadProjectFiles(item);
                        }}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Download Files"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    {item.githubUrl && (
                        <a
                            href={item.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="View on GitHub"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>
            )
        }
    ];

    const GridCard = ({ item }) => (
        <div className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(item.type)} group-hover:scale-110 transition-transform`}>
                        {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                            {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-3 leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => toggleBookmark(item.id)}
                    className={`p-2 rounded-lg transition-all ${
                        bookmarks.includes(item.id) 
                            ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
                            : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                    }`}
                    title={bookmarks.includes(item.id) ? 'Remove bookmark' : 'Add bookmark'}
                >
                    {bookmarks.includes(item.id) ? (
                        <BookmarkCheck className="w-5 h-5" />
                    ) : (
                        <Bookmark className="w-5 h-5" />
                    )}
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full border ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                    <span className="capitalize">{item.type}</span>
                </span>
                <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.status)}`}>
                    <CheckCircle className="w-3 h-3" />
                    <span className="capitalize">{item.status}</span>
                </span>
                {item.metadata?.year && (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                        <Calendar className="w-3 h-3" />
                        <span>{item.metadata.year}</span>
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{item.metadata?.department}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(item);
                        }}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                    </button>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            downloadProjectFiles(item);
                        }}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                    </button>
                </div>
                {item.githubUrl && (
                    <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span>GitHub</span>
                    </a>
                )}
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
                        <p className="text-gray-600">Loading repository...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="space-y-8">
                {/* Enhanced Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="mb-6 lg:mb-0">
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">Academic Repository</h1>
                            <p className="text-lg text-gray-600 max-w-2xl">
                                Discover and explore a comprehensive collection of academic work, research papers, 
                                projects, and scholarly contributions from our university community.
                            </p>
                           
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center space-x-2 px-6 py-3 border rounded-xl font-medium transition-all ${
                                    showFilters 
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                                }`}
                            >
                                <Filter className="w-4 h-4" />
                                <span>Filters</span>
                            </button>
                            <div className="flex items-center bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 transition-colors ${
                                        viewMode === 'grid' 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                    }`}
                                    title="Grid view"
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 transition-colors ${
                                        viewMode === 'list' 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                    }`}
                                    title="List view"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Search and Filters */}
                <div className="space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by title, description, tags, department, or course..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all"
                        />
                    </div>

                    {showFilters && (
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                                    <select
                                        value={filters.department}
                                        onChange={(e) => handleFilterChange('department', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                    >
                                        <option value="">All Departments</option>
                                        {filterOptions.departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
                                    <select
                                        value={filters.year}
                                        onChange={(e) => handleFilterChange('year', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                    >
                                        <option value="">All Years</option>
                                        {filterOptions.years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Content Type</label>
                                    <select
                                        value={filters.type}
                                        onChange={(e) => handleFilterChange('type', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                    >
                                        <option value="">All Types</option>
                                        {filterOptions.types.map(type => (
                                            <option key={type} value={type} className="capitalize">{type}</option>
                                        ))}
                                    </select>
                                </div>
                                {['admin', 'faculty'].includes(user?.role) && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                        <select
                                            value={filters.status}
                                            onChange={(e) => handleFilterChange('status', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                        >
                                            <option value="">All Status</option>
                                            <option value="approved">Approved</option>
                                            <option value="pending">Pending</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="resubmit">Resubmit</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={filters.showBookmarked}
                                        onChange={(e) => handleFilterChange('showBookmarked', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Show only bookmarked items</span>
                                </label>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Summary */}
             

                {/* Content */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredSubmissions.map(item => (
                            <GridCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <DataTable
                            data={filteredSubmissions}
                            columns={columns}
                            searchable={false}
                        />
                    </div>
                )}

                {filteredSubmissions.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <div className="text-gray-400 mb-6">
                            <Search className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">No results found</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            We couldn't find any submissions matching your search criteria. 
                            Try adjusting your search terms or filters.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {/* Project Detail Modal */}
            {selectedProject && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full my-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-t-lg z-10">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className="px-3 py-1 bg-white bg-opacity-20 text-black text-sm font-medium rounded">
                                            {selectedProject.metadata?.year || 'N/A'}
                                        </span>
                                        <span className="px-3 py-1 bg-white bg-opacity-20 text-black text-sm font-medium rounded capitalize">
                                            {selectedProject.type}
                                        </span>
                                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded">
                                            <CheckCircle className="w-3 h-3" />
                                            <span className="capitalize">{selectedProject.status}</span>
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">{selectedProject.title}</h2>
                                    <div className="flex items-center space-x-4 text-indigo-100">
                                        <span className="flex items-center">
                                            <User className="h-4 w-4 mr-2" />
                                            {selectedProject.submitter?.name || 'Unknown Student'}
                                        </span>
                                        <span>•</span>
                                        <span>{selectedProject.metadata?.course || 'N/A'}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="p-2 hover:bg-black hover:bg-opacity-10 rounded-lg transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Stats Bar */}
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                <div className="text-center">
                                    <Calendar className="h-5 w-5 mx-auto mb-1" />
                                    <p className="text-sm font-bold">{formatDate(selectedProject.createdAt)}</p>
                                    <p className="text-xs text-indigo-100">Uploaded</p>
                                </div>
                                <div className="text-center">
                                    <Clock className="h-5 w-5 mx-auto mb-1 text-blue-3" />
                                    <p className="text-sm font-bold">{formatDate(selectedProject.updatedAt)}</p>
                                    <p className="text-xs text-indigo-100">Last Updated</p>
                                </div>
                                <div className="text-center">
                                    <CheckCircle className="h-5 w-5 mx-auto mb-1   text-green-500 " />
                                    <p className="text-sm font-bold capitalize">{selectedProject.status}</p>
                                    <p className="text-xs text-indigo-100">Status</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Description</h3>
                                <p className="text-gray-700 leading-relaxed">{selectedProject.description || 'No description available.'}</p>
                            </div>

                            {/* Links */}
                            {selectedProject.githubUrl && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <GitBranch className="h-5 w-5 mr-2 text-gray-900" />
                                        Source Code
                                    </h3>
                                    <a
                                        href={selectedProject.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        <GitBranch className="h-5 w-5 mr-2" />
                                        View on GitHub
                                        <ExternalLink className="h-4 w-4 ml-2" />
                                    </a>
                                </div>
                            )}

                            {/* Tags */}
                            {selectedProject.tags && selectedProject.tags.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <Tag className="h-5 w-5 mr-2 text-blue-600" />
                                        Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Project Files */}
                            {selectedProject.files && selectedProject.files.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <Folder className="h-5 w-5 mr-2 text-yellow-600" />
                                        Project Files ({selectedProject.files.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {selectedProject.files.map((file, index) => (
                                            <button
                                                key={index}
                                                onClick={() => downloadFile(file)}
                                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group transition-all"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    {getFileIcon(file.originalName || file.filename || file.name)}
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{file.originalName || file.filename || file.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {file.size ? formatFileSize(file.size) : 'Unknown size'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Download className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Academic Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                    <Award className="h-5 w-5 mr-2 text-purple-600" />
                                    Academic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Department</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {selectedProject.metadata?.department || 'Not specified'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Course</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {selectedProject.metadata?.course || 'Not specified'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Academic Year</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {selectedProject.metadata?.year || 'Not specified'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Project Type</p>
                                        <p className="text-sm font-medium text-gray-900 capitalize">
                                            {selectedProject.type}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Student/Submitter Info */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                    <User className="h-5 w-5 mr-2 text-green-600" />
                                    Submitted By
                                </h3>
                                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                            <User className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {selectedProject.submitter?.name || 'Unknown Student'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {selectedProject.submitter?.email || 'No email available'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bookmark Button */}
                            <div className="flex justify-end pt-4 border-t">
                                <button
                                    onClick={() => toggleBookmark(selectedProject.id)}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                                        bookmarks.includes(selectedProject.id)
                                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {bookmarks.includes(selectedProject.id) ? (
                                        <>
                                            <BookmarkCheck className="h-5 w-5" />
                                            <span>Bookmarked</span>
                                        </>
                                    ) : (
                                        <>
                                            <Bookmark className="h-5 w-5" />
                                            <span>Add Bookmark</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
};

export default Repository;