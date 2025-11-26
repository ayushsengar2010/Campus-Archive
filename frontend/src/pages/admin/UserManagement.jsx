import { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Download,
  Upload,
  RefreshCw,
  Shield,
  Mail,
  Calendar,
  CheckSquare,
  Square
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { USER_ROLES } from '../../constants';
import apiService from '../../services/apiService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  // Form state for add/edit user
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: USER_ROLES.STUDENT,
    department: '',
    status: 'active'
  });

  useEffect(() => {
    loadUsers();
    loadAuditLogs();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    
    try {
      // Fetch real users from backend
      const usersData = await apiService.getUsers();
      const usersArray = Array.isArray(usersData) ? usersData : [];
      
      // Transform to match UI format
      const transformedUsers = usersArray.map(user => ({
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department || 'N/A',
        status: user.status || 'active',
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : new Date(),
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
        submissionCount: 0 // This would need to be calculated from submissions
      }));
      
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAuditLogs = async () => {
    // Simulate loading audit logs
    const mockLogs = [
      {
        id: '1',
        action: 'USER_CREATED',
        details: 'Created user: john.smith@university.edu',
        performedBy: 'admin@university.edu',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        targetUser: 'john.smith@university.edu'
      },
      {
        id: '2',
        action: 'ROLE_CHANGED',
        details: 'Changed role from student to faculty for sarah.johnson@university.edu',
        performedBy: 'admin@university.edu',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        targetUser: 'sarah.johnson@university.edu'
      },
      {
        id: '3',
        action: 'USER_DEACTIVATED',
        details: 'Deactivated user: mike.wilson@university.edu',
        performedBy: 'admin@university.edu',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        targetUser: 'mike.wilson@university.edu'
      }
    ];
    
    setAuditLogs(mockLogs);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser = {
      id: Date.now().toString(),
      ...userForm,
      lastLogin: null,
      createdAt: new Date(),
      submissionCount: 0
    };
    
    setUsers(prev => [...prev, newUser]);
    
    // Add audit log
    const auditLog = {
      id: Date.now().toString(),
      action: 'USER_CREATED',
      details: `Created user: ${userForm.email}`,
      performedBy: 'admin@university.edu',
      timestamp: new Date(),
      targetUser: userForm.email
    };
    setAuditLogs(prev => [auditLog, ...prev]);
    
    setShowAddModal(false);
    setUserForm({
      name: '',
      email: '',
      role: USER_ROLES.STUDENT,
      department: '',
      status: 'active'
    });
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUsers(prev => prev.map(user => 
      user.id === editingUser.id 
        ? { ...user, ...userForm }
        : user
    ));
    
    // Add audit log
    const auditLog = {
      id: Date.now().toString(),
      action: 'USER_UPDATED',
      details: `Updated user: ${userForm.email}`,
      performedBy: 'admin@university.edu',
      timestamp: new Date(),
      targetUser: userForm.email
    };
    setAuditLogs(prev => [auditLog, ...prev]);
    
    setShowEditModal(false);
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      role: USER_ROLES.STUDENT,
      department: '',
      status: 'active'
    });
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    const user = users.find(u => u.id === userId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUsers(prev => prev.filter(u => u.id !== userId));
    
    // Add audit log
    const auditLog = {
      id: Date.now().toString(),
      action: 'USER_DELETED',
      details: `Deleted user: ${user.email}`,
      performedBy: 'admin@university.edu',
      timestamp: new Date(),
      targetUser: user.email
    };
    setAuditLogs(prev => [auditLog, ...prev]);
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const selectedUserData = users.filter(u => selectedUsers.includes(u.id));
    
    switch (action) {
      case 'activate':
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: 'active' }
            : user
        ));
        break;
      case 'deactivate':
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: 'inactive' }
            : user
        ));
        break;
      case 'delete':
        if (!confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) return;
        setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
        break;
    }
    
    // Add audit log
    const auditLog = {
      id: Date.now().toString(),
      action: `BULK_${action.toUpperCase()}`,
      details: `Bulk ${action} performed on ${selectedUsers.length} users`,
      performedBy: 'admin@university.edu',
      timestamp: new Date(),
      targetUser: selectedUserData.map(u => u.email).join(', ')
    };
    setAuditLogs(prev => [auditLog, ...prev]);
    
    setSelectedUsers([]);
    setShowBulkModal(false);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status
    });
    setShowEditModal(true);
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'Never';
    const minutes = Math.floor((new Date() - date) / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getRoleColor = (role) => {
    const colors = {
      [USER_ROLES.STUDENT]: 'bg-blue-100 text-blue-800',
      [USER_ROLES.FACULTY]: 'bg-green-100 text-green-800',
      [USER_ROLES.RESEARCHER]: 'bg-purple-100 text-purple-800',
      [USER_ROLES.ADMIN]: 'bg-red-100 text-red-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const userColumns = [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUsers(filteredUsers.map(u => u.id));
            } else {
              setSelectedUsers([]);
            }
          }}
          className="rounded border-gray-300"
        />
      ),
      render: (_, user) => (
        <input
          type="checkbox"
          checked={selectedUsers.includes(user.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUsers(prev => [...prev, user.id]);
            } else {
              setSelectedUsers(prev => prev.filter(id => id !== user.id));
            }
          }}
          className="rounded border-gray-300"
        />
      )
    },
    {
      key: 'name',
      header: 'User',
      render: (_, user) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-indigo-600">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      render: (role) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(role)}`}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
      )
    },
    {
      key: 'department',
      header: 'Department',
      render: (department) => (
        <span className="text-sm text-gray-900">{department}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (status) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      render: (lastLogin) => (
        <span className="text-sm text-gray-500">{formatTimeAgo(lastLogin)}</span>
      )
    },
    {
      key: 'submissionCount',
      header: 'Submissions',
      render: (count) => (
        <span className="text-sm text-gray-900">{count}</span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, user) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openEditModal(user)}
            className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
            title="Edit user"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete user"
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
            <p className="text-gray-500">Loading users...</p>
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
                User Management 👥
              </h1>
              <p className="text-indigo-100">
                Manage users, roles, and permissions across the platform
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add User</span>
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
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Inactive Users</p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter(u => u.status === 'inactive').length}
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Selected</p>
                <p className="text-2xl font-bold text-indigo-600">{selectedUsers.length}</p>
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value={USER_ROLES.STUDENT}>Students</option>
                <option value={USER_ROLES.FACULTY}>Faculty</option>
                <option value={USER_ROLES.RESEARCHER}>Researchers</option>
                <option value={USER_ROLES.ADMIN}>Admins</option>
              </select>
            </div>
            
            {selectedUsers.length > 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center space-x-2"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span>Bulk Actions ({selectedUsers.length})</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <DataTable
            data={filteredUsers}
            columns={userColumns}
            searchable={false}
            pagination={true}
          />
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New User"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={userForm.name}
              onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={userForm.email}
              onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={userForm.role}
              onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value={USER_ROLES.STUDENT}>Student</option>
              <option value={USER_ROLES.FACULTY}>Faculty</option>
              <option value={USER_ROLES.RESEARCHER}>Researcher</option>
              <option value={USER_ROLES.ADMIN}>Admin</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              required
              value={userForm.department}
              onChange={(e) => setUserForm(prev => ({ ...prev, department: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter department"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={userForm.status}
              onChange={(e) => setUserForm(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
              Add User
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit User"
      >
        <form onSubmit={handleEditUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={userForm.name}
              onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={userForm.email}
              onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={userForm.role}
              onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value={USER_ROLES.STUDENT}>Student</option>
              <option value={USER_ROLES.FACULTY}>Faculty</option>
              <option value={USER_ROLES.RESEARCHER}>Researcher</option>
              <option value={USER_ROLES.ADMIN}>Admin</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              required
              value={userForm.department}
              onChange={(e) => setUserForm(prev => ({ ...prev, department: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={userForm.status}
              onChange={(e) => setUserForm(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
              Update User
            </button>
          </div>
        </form>
      </Modal>

      {/* Bulk Actions Modal */}
      <Modal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title={`Bulk Actions (${selectedUsers.length} users selected)`}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Choose an action to perform on the selected users:
          </p>
          
          <div className="space-y-2">
            <button
              onClick={() => handleBulkAction('activate')}
              className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center space-x-3"
            >
              <UserCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Activate Users</p>
                <p className="text-sm text-green-600">Set selected users as active</p>
              </div>
            </button>
            
            <button
              onClick={() => handleBulkAction('deactivate')}
              className="w-full p-3 text-left bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors flex items-center space-x-3"
            >
              <UserX className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">Deactivate Users</p>
                <p className="text-sm text-yellow-600">Set selected users as inactive</p>
              </div>
            </button>
            
            <button
              onClick={() => handleBulkAction('delete')}
              className="w-full p-3 text-left bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center space-x-3"
            >
              <Trash2 className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-900">Delete Users</p>
                <p className="text-sm text-red-600">Permanently remove selected users</p>
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

export default UserManagement;