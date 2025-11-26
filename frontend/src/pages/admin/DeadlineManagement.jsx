import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Bell,
  Users,
  FileText,
  CheckSquare
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { SUBMISSION_TYPES } from '../../constants';

const DeadlineManagement = () => {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDeadlines, setSelectedDeadlines] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  // Form state for add/edit deadline
  const [deadlineForm, setDeadlineForm] = useState({
    title: '',
    description: '',
    type: SUBMISSION_TYPES.PROJECT,
    dueDate: '',
    dueTime: '23:59',
    department: '',
    course: '',
    notificationDays: 7,
    status: 'active'
  });

  useEffect(() => {
    loadDeadlines();
    loadAuditLogs();
  }, []);

  const loadDeadlines = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockDeadlines = [
      {
        id: '1',
        title: 'Final Project Submission',
        description: 'Submit your final capstone project with documentation',
        type: SUBMISSION_TYPES.PROJECT,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        department: 'Computer Science',
        course: 'CS 401',
        notificationDays: 7,
        status: 'active',
        submissionCount: 23,
        totalStudents: 45,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        createdBy: 'Dr. Sarah Johnson'
      },
      {
        id: '2',
        title: 'Research Paper Draft',
        description: 'Submit first draft of research paper for review',
        type: SUBMISSION_TYPES.RESEARCH,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        department: 'Engineering',
        course: 'ENG 502',
        notificationDays: 5,
        status: 'active',
        submissionCount: 12,
        totalStudents: 20,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        createdBy: 'Dr. Mike Wilson'
      },
      {
        id: '3',
        title: 'Assignment 3 - Data Structures',
        description: 'Implement binary search tree with operations',
        type: SUBMISSION_TYPES.ASSIGNMENT,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        department: 'Computer Science',
        course: 'CS 201',
        notificationDays: 3,
        status: 'expired',
        submissionCount: 67,
        totalStudents: 75,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        createdBy: 'Dr. Emily Chen'
      },
      {
        id: '4',
        title: 'Project Proposal',
        description: 'Submit detailed project proposal with timeline',
        type: SUBMISSION_TYPES.PROPOSAL,
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        department: 'Mathematics',
        course: 'MATH 301',
        notificationDays: 10,
        status: 'active',
        submissionCount: 8,
        totalStudents: 30,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        createdBy: 'Dr. Alex Rodriguez'
      },
      {
        id: '5',
        title: 'Lab Report 5',
        description: 'Submit lab report with experimental results',
        type: SUBMISSION_TYPES.ASSIGNMENT,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        department: 'Physics',
        course: 'PHY 201',
        notificationDays: 2,
        status: 'active',
        submissionCount: 34,
        totalStudents: 40,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        createdBy: 'Dr. Lisa Park'
      }
    ];
    
    setDeadlines(mockDeadlines);
    setLoading(false);
  };

  const loadAuditLogs = async () => {
    // Simulate loading audit logs
    const mockLogs = [
      {
        id: '1',
        action: 'DEADLINE_CREATED',
        details: 'Created deadline: Final Project Submission',
        performedBy: 'admin@university.edu',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        targetDeadline: 'Final Project Submission'
      },
      {
        id: '2',
        action: 'DEADLINE_EXTENDED',
        details: 'Extended deadline by 3 days: Research Paper Draft',
        performedBy: 'admin@university.edu',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        targetDeadline: 'Research Paper Draft'
      },
      {
        id: '3',
        action: 'DEADLINE_DELETED',
        details: 'Deleted deadline: Old Assignment',
        performedBy: 'admin@university.edu',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        targetDeadline: 'Old Assignment'
      }
    ];
    
    setAuditLogs(mockLogs);
  };

  const handleAddDeadline = async (e) => {
    e.preventDefault();
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const dueDateTime = new Date(`${deadlineForm.dueDate}T${deadlineForm.dueTime}`);
    
    const newDeadline = {
      id: Date.now().toString(),
      ...deadlineForm,
      dueDate: dueDateTime,
      submissionCount: 0,
      totalStudents: 0,
      createdAt: new Date(),
      createdBy: 'Admin User'
    };
    
    setDeadlines(prev => [...prev, newDeadline]);
    
    // Add audit log
    const auditLog = {
      id: Date.now().toString(),
      action: 'DEADLINE_CREATED',
      details: `Created deadline: ${deadlineForm.title}`,
      performedBy: 'admin@university.edu',
      timestamp: new Date(),
      targetDeadline: deadlineForm.title
    };
    setAuditLogs(prev => [auditLog, ...prev]);
    
    setShowAddModal(false);
    resetForm();
  };

  const handleEditDeadline = async (e) => {
    e.preventDefault();
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const dueDateTime = new Date(`${deadlineForm.dueDate}T${deadlineForm.dueTime}`);
    
    setDeadlines(prev => prev.map(deadline => 
      deadline.id === editingDeadline.id 
        ? { ...deadline, ...deadlineForm, dueDate: dueDateTime }
        : deadline
    ));
    
    // Add audit log
    const auditLog = {
      id: Date.now().toString(),
      action: 'DEADLINE_UPDATED',
      details: `Updated deadline: ${deadlineForm.title}`,
      performedBy: 'admin@university.edu',
      timestamp: new Date(),
      targetDeadline: deadlineForm.title
    };
    setAuditLogs(prev => [auditLog, ...prev]);
    
    setShowEditModal(false);
    setEditingDeadline(null);
    resetForm();
  };

  const handleDeleteDeadline = async (deadlineId) => {
    if (!confirm('Are you sure you want to delete this deadline?')) return;
    
    const deadline = deadlines.find(d => d.id === deadlineId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setDeadlines(prev => prev.filter(d => d.id !== deadlineId));
    
    // Add audit log
    const auditLog = {
      id: Date.now().toString(),
      action: 'DEADLINE_DELETED',
      details: `Deleted deadline: ${deadline.title}`,
      performedBy: 'admin@university.edu',
      timestamp: new Date(),
      targetDeadline: deadline.title
    };
    setAuditLogs(prev => [auditLog, ...prev]);
  };

  const handleBulkAction = async (action) => {
    if (selectedDeadlines.length === 0) return;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const selectedDeadlineData = deadlines.filter(d => selectedDeadlines.includes(d.id));
    
    switch (action) {
      case 'activate':
        setDeadlines(prev => prev.map(deadline => 
          selectedDeadlines.includes(deadline.id) 
            ? { ...deadline, status: 'active' }
            : deadline
        ));
        break;
      case 'deactivate':
        setDeadlines(prev => prev.map(deadline => 
          selectedDeadlines.includes(deadline.id) 
            ? { ...deadline, status: 'inactive' }
            : deadline
        ));
        break;
      case 'extend':
        // Extend by 7 days
        setDeadlines(prev => prev.map(deadline => 
          selectedDeadlines.includes(deadline.id) 
            ? { ...deadline, dueDate: new Date(deadline.dueDate.getTime() + 7 * 24 * 60 * 60 * 1000) }
            : deadline
        ));
        break;
      case 'delete':
        if (!confirm(`Are you sure you want to delete ${selectedDeadlines.length} deadlines?`)) return;
        setDeadlines(prev => prev.filter(d => !selectedDeadlines.includes(d.id)));
        break;
    }
    
    // Add audit log
    const auditLog = {
      id: Date.now().toString(),
      action: `BULK_${action.toUpperCase()}`,
      details: `Bulk ${action} performed on ${selectedDeadlines.length} deadlines`,
      performedBy: 'admin@university.edu',
      timestamp: new Date(),
      targetDeadline: selectedDeadlineData.map(d => d.title).join(', ')
    };
    setAuditLogs(prev => [auditLog, ...prev]);
    
    setSelectedDeadlines([]);
    setShowBulkModal(false);
  };

  const openEditModal = (deadline) => {
    setEditingDeadline(deadline);
    setDeadlineForm({
      title: deadline.title,
      description: deadline.description,
      type: deadline.type,
      dueDate: deadline.dueDate.toISOString().split('T')[0],
      dueTime: deadline.dueDate.toTimeString().slice(0, 5),
      department: deadline.department,
      course: deadline.course,
      notificationDays: deadline.notificationDays,
      status: deadline.status
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setDeadlineForm({
      title: '',
      description: '',
      type: SUBMISSION_TYPES.PROJECT,
      dueDate: '',
      dueTime: '23:59',
      department: '',
      course: '',
      notificationDays: 7,
      status: 'active'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const now = new Date();
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (deadline) => {
    const daysUntil = getDaysUntilDue(deadline.dueDate);
    
    if (deadline.status === 'inactive') {
      return 'bg-gray-100 text-gray-800';
    }
    
    if (daysUntil < 0) {
      return 'bg-red-100 text-red-800';
    } else if (daysUntil <= 3) {
      return 'bg-orange-100 text-orange-800';
    } else if (daysUntil <= 7) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };

  const getStatusText = (deadline) => {
    const daysUntil = getDaysUntilDue(deadline.dueDate);
    
    if (deadline.status === 'inactive') {
      return 'Inactive';
    }
    
    if (daysUntil < 0) {
      return 'Expired';
    } else if (daysUntil === 0) {
      return 'Due Today';
    } else if (daysUntil === 1) {
      return 'Due Tomorrow';
    } else if (daysUntil <= 7) {
      return `${daysUntil} days left`;
    } else {
      return 'Active';
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      [SUBMISSION_TYPES.PROJECT]: 'bg-blue-100 text-blue-800',
      [SUBMISSION_TYPES.ASSIGNMENT]: 'bg-green-100 text-green-800',
      [SUBMISSION_TYPES.RESEARCH]: 'bg-purple-100 text-purple-800',
      [SUBMISSION_TYPES.PROPOSAL]: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  // Filter deadlines based on search and type
  const filteredDeadlines = deadlines.filter(deadline => {
    const matchesSearch = deadline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deadline.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deadline.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deadline.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || deadline.type === selectedType;
    return matchesSearch && matchesType;
  });

  const deadlineColumns = [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={selectedDeadlines.length === filteredDeadlines.length && filteredDeadlines.length > 0}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedDeadlines(filteredDeadlines.map(d => d.id));
            } else {
              setSelectedDeadlines([]);
            }
          }}
          className="rounded border-gray-300"
        />
      ),
      render: (_, deadline) => (
        <input
          type="checkbox"
          checked={selectedDeadlines.includes(deadline.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedDeadlines(prev => [...prev, deadline.id]);
            } else {
              setSelectedDeadlines(prev => prev.filter(id => id !== deadline.id));
            }
          }}
          className="rounded border-gray-300"
        />
      )
    },
    {
      key: 'title',
      header: 'Deadline',
      render: (_, deadline) => (
        <div>
          <p className="font-medium text-gray-900">{deadline.title}</p>
          <p className="text-sm text-gray-500">{deadline.course} - {deadline.department}</p>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      render: (type) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(type)}`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      )
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (dueDate) => (
        <div>
          <p className="text-sm text-gray-900">{formatDate(dueDate)}</p>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, deadline) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(deadline)}`}>
          {getStatusText(deadline)}
        </span>
      )
    },
    {
      key: 'submissions',
      header: 'Submissions',
      render: (_, deadline) => (
        <div className="text-sm">
          <p className="text-gray-900">{deadline.submissionCount}/{deadline.totalStudents}</p>
          <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
            <div 
              className="bg-indigo-600 h-1 rounded-full"
              style={{ 
                width: `${deadline.totalStudents > 0 ? (deadline.submissionCount / deadline.totalStudents) * 100 : 0}%` 
              }}
            ></div>
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, deadline) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openEditModal(deadline)}
            className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
            title="Edit deadline"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteDeadline(deadline.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete deadline"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading deadlines...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Deadline Management 📅
              </h1>
              <p className="text-indigo-100">
                Create and manage submission deadlines across all courses
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Deadline</span>
              </button>
              <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 font-medium transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Deadlines</p>
                <p className="text-2xl font-bold text-gray-900">{deadlines.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Deadlines</p>
                <p className="text-2xl font-bold text-green-600">
                  {deadlines.filter(d => d.status === 'active' && getDaysUntilDue(d.dueDate) >= 0).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Due Soon</p>
                <p className="text-2xl font-bold text-orange-600">
                  {deadlines.filter(d => {
                    const days = getDaysUntilDue(d.dueDate);
                    return days >= 0 && days <= 7;
                  }).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Selected</p>
                <p className="text-2xl font-bold text-indigo-600">{selectedDeadlines.length}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search deadlines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value={SUBMISSION_TYPES.PROJECT}>Projects</option>
                <option value={SUBMISSION_TYPES.ASSIGNMENT}>Assignments</option>
                <option value={SUBMISSION_TYPES.RESEARCH}>Research</option>
                <option value={SUBMISSION_TYPES.PROPOSAL}>Proposals</option>
              </select>
            </div>
            
            {selectedDeadlines.length > 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center space-x-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Bulk Actions ({selectedDeadlines.length})</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Deadlines Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <DataTable
            data={filteredDeadlines}
            columns={deadlineColumns}
            searchable={false}
            pagination={true}
          />
        </div>
      </div>

      {/* Add Deadline Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Deadline"
      >
        <form onSubmit={handleAddDeadline} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={deadlineForm.title}
              onChange={(e) => setDeadlineForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter deadline title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              value={deadlineForm.description}
              onChange={(e) => setDeadlineForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows="3"
              placeholder="Enter deadline description"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={deadlineForm.type}
                onChange={(e) => setDeadlineForm(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value={SUBMISSION_TYPES.PROJECT}>Project</option>
                <option value={SUBMISSION_TYPES.ASSIGNMENT}>Assignment</option>
                <option value={SUBMISSION_TYPES.RESEARCH}>Research</option>
                <option value={SUBMISSION_TYPES.PROPOSAL}>Proposal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={deadlineForm.status}
                onChange={(e) => setDeadlineForm(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                required
                value={deadlineForm.department}
                onChange={(e) => setDeadlineForm(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter department"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <input
                type="text"
                required
                value={deadlineForm.course}
                onChange={(e) => setDeadlineForm(prev => ({ ...prev, course: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter course code"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={deadlineForm.dueDate}
                onChange={(e) => setDeadlineForm(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Time
              </label>
              <input
                type="time"
                required
                value={deadlineForm.dueTime}
                onChange={(e) => setDeadlineForm(prev => ({ ...prev, dueTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notification Days (days before due date)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              required
              value={deadlineForm.notificationDays}
              onChange={(e) => setDeadlineForm(prev => ({ ...prev, notificationDays: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
            >
              Add Deadline
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Deadline Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Deadline"
      >
        <form onSubmit={handleEditDeadline} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={deadlineForm.title}
              onChange={(e) => setDeadlineForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              value={deadlineForm.description}
              onChange={(e) => setDeadlineForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows="3"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={deadlineForm.type}
                onChange={(e) => setDeadlineForm(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value={SUBMISSION_TYPES.PROJECT}>Project</option>
                <option value={SUBMISSION_TYPES.ASSIGNMENT}>Assignment</option>
                <option value={SUBMISSION_TYPES.RESEARCH}>Research</option>
                <option value={SUBMISSION_TYPES.PROPOSAL}>Proposal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={deadlineForm.status}
                onChange={(e) => setDeadlineForm(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                required
                value={deadlineForm.department}
                onChange={(e) => setDeadlineForm(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <input
                type="text"
                required
                value={deadlineForm.course}
                onChange={(e) => setDeadlineForm(prev => ({ ...prev, course: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={deadlineForm.dueDate}
                onChange={(e) => setDeadlineForm(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Time
              </label>
              <input
                type="time"
                required
                value={deadlineForm.dueTime}
                onChange={(e) => setDeadlineForm(prev => ({ ...prev, dueTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notification Days (days before due date)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              required
              value={deadlineForm.notificationDays}
              onChange={(e) => setDeadlineForm(prev => ({ ...prev, notificationDays: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
            >
              Update Deadline
            </button>
          </div>
        </form>
      </Modal>

      {/* Bulk Actions Modal */}
      <Modal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title={`Bulk Actions (${selectedDeadlines.length} deadlines selected)`}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Choose an action to perform on the selected deadlines:
          </p>
          
          <div className="space-y-2">
            <button
              onClick={() => handleBulkAction('activate')}
              className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center space-x-3"
            >
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Activate Deadlines</p>
                <p className="text-sm text-green-600">Set selected deadlines as active</p>
              </div>
            </button>
            
            <button
              onClick={() => handleBulkAction('deactivate')}
              className="w-full p-3 text-left bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors flex items-center space-x-3"
            >
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">Deactivate Deadlines</p>
                <p className="text-sm text-yellow-600">Set selected deadlines as inactive</p>
              </div>
            </button>
            
            <button
              onClick={() => handleBulkAction('extend')}
              className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center space-x-3"
            >
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Extend Deadlines</p>
                <p className="text-sm text-blue-600">Extend selected deadlines by 7 days</p>
              </div>
            </button>
            
            <button
              onClick={() => handleBulkAction('delete')}
              className="w-full p-3 text-left bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center space-x-3"
            >
              <Trash2 className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-900">Delete Deadlines</p>
                <p className="text-sm text-red-600">Permanently remove selected deadlines</p>
              </div>
            </button>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowBulkModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
};

export default DeadlineManagement;