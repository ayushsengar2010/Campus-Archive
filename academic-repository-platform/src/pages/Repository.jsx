import { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, Bookmark, BookmarkCheck, Eye, Download, ExternalLink, Star, Calendar, User, FileText, TrendingUp } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import DataTable from '../components/ui/DataTable';
import { useRepositoryData } from '../hooks/useRepositoryData';
import { useAuth } from '../hooks/useAuth';

const Repository = () => {
    const { user } = useAuth();
    const { submissions, isLoading, bookmarks, toggleBookmark } = useRepositoryData();

    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchQuery, setSearchQuery] = useState('');
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            case 'resubmit': return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'project': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'research': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'assignment': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'proposal': return 'bg-pink-100 text-pink-800 border-pink-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'project': return <FileText className="w-3 h-3" />;
            case 'research': return <TrendingUp className="w-3 h-3" />;
            case 'assignment': return <FileText className="w-3 h-3" />;
            case 'proposal': return <Star className="w-3 h-3" />;
            default: return <FileText className="w-3 h-3" />;
        }
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
                <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(value)}`}>
                    {value}
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
                        onClick={() => toggleBookmark(item.id)}
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
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button 
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Download"
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
                <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.status)}`}>
                    {item.status}
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
                    <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                    </button>
                </div>
                {item.githubUrl && (
                    <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
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
                            <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <FileText className="w-4 h-4" />
                                    <span>{submissions.length} Total Submissions</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4" />
                                    <span>{bookmarks.length} Bookmarked</span>
                                </div>
                            </div>
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
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-600 font-medium">
                        <span className="text-indigo-600 font-semibold">{filteredSubmissions.length}</span> result{filteredSubmissions.length !== 1 ? 's' : ''} found
                        {searchQuery && <span className="ml-1">for "{searchQuery}"</span>}
                    </p>
                    {filteredSubmissions.length > 0 && (
                        <div className="text-sm text-gray-500">
                            Showing {viewMode === 'grid' ? 'grid' : 'list'} view
                        </div>
                    )}
                </div>

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
        </AppLayout>
    );
};

export default Repository;