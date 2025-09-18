import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Plus,
    Search,
    Filter,
    MessageSquare,
    Eye,
    Edit,
    Share2,
    Clock,
    CheckCircle,
    AlertCircle,
    UserPlus,
    Mail,
    Calendar,
    FileText,
    Star,
    MoreVertical
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import DashboardCard from '../../components/ui/DashboardCard';

const Collaborations = () => {
    const [activeTab, setActiveTab] = useState('active'); // 'active', 'invitations', 'requests'
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    // Mock data for collaborations
    const collaborations = [
        {
            id: 1,
            paperId: 1,
            paperTitle: "Machine Learning Applications in Academic Assessment",
            role: "lead-author",
            status: "active",
            collaborators: [
                {
                    id: 1,
                    name: "Dr. Sarah Johnson",
                    email: "sarah.johnson@university.edu",
                    role: "co-author",
                    status: "active",
                    avatar: null,
                    lastActive: "2024-03-15T10:30:00Z",
                    contributions: ["Data Analysis", "Writing"]
                },
                {
                    id: 2,
                    name: "Prof. Michael Brown",
                    email: "michael.brown@university.edu",
                    role: "supervisor",
                    status: "active",
                    avatar: null,
                    lastActive: "2024-03-14T15:45:00Z",
                    contributions: ["Supervision", "Review"]
                }
            ],
            lastActivity: "2024-03-15T14:20:00Z",
            progress: 85,
            comments: 12,
            pendingTasks: 3,
            createdAt: "2024-01-10T09:00:00Z"
        },
        {
            id: 2,
            paperId: 2,
            paperTitle: "Collaborative Learning Platforms: A Systematic Review",
            role: "co-author",
            status: "active",
            collaborators: [
                {
                    id: 3,
                    name: "Dr. Emily Davis",
                    email: "emily.davis@university.edu",
                    role: "lead-author",
                    status: "active",
                    avatar: null,
                    lastActive: "2024-03-16T09:15:00Z",
                    contributions: ["Research Design", "Writing"]
                }
            ],
            lastActivity: "2024-03-16T11:30:00Z",
            progress: 92,
            comments: 8,
            pendingTasks: 1,
            createdAt: "2024-02-01T10:00:00Z"
        }
    ];

    const invitations = [
        {
            id: 1,
            paperId: 5,
            paperTitle: "AI Ethics in Educational Technology",
            invitedBy: "Dr. Lisa Wang",
            invitedByEmail: "lisa.wang@university.edu",
            role: "co-author",
            message: "Would you like to collaborate on this paper about AI ethics? Your expertise in educational technology would be valuable.",
            invitedAt: "2024-03-10T14:00:00Z",
            expiresAt: "2024-03-24T14:00:00Z"
        },
        {
            id: 2,
            paperId: 6,
            paperTitle: "Blockchain Applications in Academic Credentials",
            invitedBy: "Prof. Robert Chen",
            invitedByEmail: "robert.chen@university.edu",
            role: "reviewer",
            message: "I would appreciate your feedback on this blockchain research paper.",
            invitedAt: "2024-03-12T16:30:00Z",
            expiresAt: "2024-03-26T16:30:00Z"
        }
    ];

    const requests = [
        {
            id: 1,
            paperId: 3,
            paperTitle: "Digital Transformation in Higher Education",
            requestedBy: "Dr. Amanda Wilson",
            requestedByEmail: "amanda.wilson@university.edu",
            requestedRole: "co-author",
            message: "I'm interested in collaborating on your digital transformation research. I have experience in change management.",
            requestedAt: "2024-03-08T11:20:00Z",
            status: "pending"
        }
    ];

    const stats = {
        activeCollaborations: collaborations.filter(c => c.status === 'active').length,
        totalCollaborators: collaborations.reduce((sum, c) => sum + c.collaborators.length, 0),
        pendingInvitations: invitations.length,
        pendingRequests: requests.length,
        avgProgress: Math.round(collaborations.reduce((sum, c) => sum + c.progress, 0) / collaborations.length),
        totalComments: collaborations.reduce((sum, c) => sum + c.comments, 0)
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'lead-author': return 'text-purple-700 bg-purple-100 border-purple-200';
            case 'co-author': return 'text-blue-700 bg-blue-100 border-blue-200';
            case 'supervisor': return 'text-green-700 bg-green-100 border-green-200';
            case 'reviewer': return 'text-orange-700 bg-orange-100 border-orange-200';
            default: return 'text-gray-700 bg-gray-100 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
            case 'completed': return <CheckCircle className="w-4 h-4 text-blue-600" />;
            default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleAcceptInvitation = (invitationId) => {
        console.log('Accepting invitation:', invitationId);
        // Implementation for accepting invitation
    };

    const handleDeclineInvitation = (invitationId) => {
        console.log('Declining invitation:', invitationId);
        // Implementation for declining invitation
    };

    const handleApproveRequest = (requestId) => {
        console.log('Approving request:', requestId);
        // Implementation for approving collaboration request
    };

    const handleRejectRequest = (requestId) => {
        console.log('Rejecting request:', requestId);
        // Implementation for rejecting collaboration request
    };

    const CollaborationCard = ({ collaboration }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(collaboration.role)}`}>
                            {collaboration.role.replace('-', ' ').toUpperCase()}
                        </span>
                        {getStatusIcon(collaboration.status)}
                        <span className="text-xs text-gray-500 capitalize">{collaboration.status}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {collaboration.paperTitle}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span>{collaboration.collaborators.length} collaborators</span>
                        <span>•</span>
                        <span>{collaboration.progress}% complete</span>
                        <span>•</span>
                        <span>{collaboration.comments} comments</span>
                    </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">{collaboration.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${collaboration.progress}%` }}
                    />
                </div>
            </div>

            {/* Collaborators */}
            <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Collaborators</h4>
                <div className="space-y-2">
                    {collaboration.collaborators.map((collaborator) => (
                        <div key={collaborator.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-indigo-600">
                                        {collaborator.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{collaborator.name}</p>
                                    <p className="text-xs text-gray-500">{collaborator.role}</p>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">
                                Last active: {formatTime(collaborator.lastActive)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                    <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <MessageSquare className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-xs text-gray-500">
                    Last activity: {formatDate(collaboration.lastActivity)}
                </div>
            </div>
        </div>
    );

    const InvitationCard = ({ invitation }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(invitation.role)}`}>
                            {invitation.role.replace('-', ' ').toUpperCase()}
                        </span>
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span className="text-xs text-gray-500">Pending</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {invitation.paperTitle}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                        Invited by <span className="font-medium">{invitation.invitedBy}</span>
                    </p>
                </div>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{invitation.message}</p>
            </div>

            <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                    Expires: {formatDate(invitation.expiresAt)}
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleDeclineInvitation(invitation.id)}
                        className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Decline
                    </button>
                    <button
                        onClick={() => handleAcceptInvitation(invitation.id)}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );

    const RequestCard = ({ request }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(request.requestedRole)}`}>
                            {request.requestedRole.replace('-', ' ').toUpperCase()}
                        </span>
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span className="text-xs text-gray-500">Pending</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {request.paperTitle}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                        Request from <span className="font-medium">{request.requestedBy}</span>
                    </p>
                </div>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{request.message}</p>
            </div>

            <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                    Requested: {formatDate(request.requestedAt)}
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Reject
                    </button>
                    <button
                        onClick={() => handleApproveRequest(request.id)}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Approve
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Collaborations</h1>
                        <p className="text-gray-600 mt-1">Manage your research collaborations and partnerships</p>
                    </div>
                    <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite Collaborator
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <DashboardCard
                        title="Active Projects"
                        value={stats.activeCollaborations}
                        icon={<FileText className="w-6 h-6" />}
                        color="primary"
                    />
                    <DashboardCard
                        title="Collaborators"
                        value={stats.totalCollaborators}
                        icon={<Users className="w-6 h-6" />}
                        color="success"
                    />
                    <DashboardCard
                        title="Invitations"
                        value={stats.pendingInvitations}
                        icon={<Mail className="w-6 h-6" />}
                        color="warning"
                    />
                    <DashboardCard
                        title="Requests"
                        value={stats.pendingRequests}
                        icon={<Clock className="w-6 h-6" />}
                        color="warning"
                    />
                    <DashboardCard
                        title="Avg Progress"
                        value={`${stats.avgProgress}%`}
                        icon={<Star className="w-6 h-6" />}
                        color="success"
                    />
                    <DashboardCard
                        title="Comments"
                        value={stats.totalComments}
                        icon={<MessageSquare className="w-6 h-6" />}
                        color="primary"
                    />
                </div>

                {/* Tabs and Filters */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        {/* Tabs */}
                        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'active'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Active ({stats.activeCollaborations})
                            </button>
                            <button
                                onClick={() => setActiveTab('invitations')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'invitations'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Invitations ({stats.pendingInvitations})
                            </button>
                            <button
                                onClick={() => setActiveTab('requests')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'requests'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Requests ({stats.pendingRequests})
                            </button>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search collaborations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
                                />
                            </div>

                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">All Roles</option>
                                <option value="lead-author">Lead Author</option>
                                <option value="co-author">Co-Author</option>
                                <option value="supervisor">Supervisor</option>
                                <option value="reviewer">Reviewer</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content based on active tab */}
                <div className="space-y-4">
                    {activeTab === 'active' && (
                        <>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Active Collaborations ({collaborations.length})
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {collaborations.map(collaboration => (
                                    <CollaborationCard key={collaboration.id} collaboration={collaboration} />
                                ))}
                            </div>
                            {collaborations.length === 0 && (
                                <div className="text-center py-12">
                                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No active collaborations</h3>
                                    <p className="text-gray-600 mb-4">Start collaborating with other researchers</p>
                                    <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Invite Collaborator
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'invitations' && (
                        <>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Pending Invitations ({invitations.length})
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {invitations.map(invitation => (
                                    <InvitationCard key={invitation.id} invitation={invitation} />
                                ))}
                            </div>
                            {invitations.length === 0 && (
                                <div className="text-center py-12">
                                    <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pending invitations</h3>
                                    <p className="text-gray-600">You have no collaboration invitations at the moment</p>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'requests' && (
                        <>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Collaboration Requests ({requests.length})
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {requests.map(request => (
                                    <RequestCard key={request.id} request={request} />
                                ))}
                            </div>
                            {requests.length === 0 && (
                                <div className="text-center py-12">
                                    <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No collaboration requests</h3>
                                    <p className="text-gray-600">You have no pending collaboration requests</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Collaborations;