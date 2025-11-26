// API Service Layer for Campus Archive Backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Get authentication headers
  getHeaders(contentType = 'application/json') {
    const headers = {
      'Content-Type': contentType,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.contentType),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle authentication errors
      if (response.status === 401) {
        this.setToken(null);
        window.location.href = '/login';
        throw new Error('Authentication required');
      }

      // Handle other HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // File upload
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      contentType: null, // Let browser set content-type for FormData
    });
  }

  // Authentication endpoints
  async login(credentials) {
    const response = await this.post('/auth/login', credentials);
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async register(userData) {
    const response = await this.post('/auth/register', userData);
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async logout() {
    try {
      await this.post('/auth/logout');
    } finally {
      this.setToken(null);
    }
  }

  async verifyToken() {
    return this.get('/auth/verify');
  }

  // User endpoints
  async getCurrentUser() {
    const response = await this.get('/auth/me');
    return response.data;
  }

  async updateProfile(userData) {
    const response = await this.put('/auth/profile', userData);
    return response.data;
  }

  async changePassword(passwordData) {
    return this.put('/auth/change-password', passwordData);
  }

  async getUsers(params = {}) {
    const response = await this.get('/users', params);
    return response.data;
  }

  async createUser(userData) {
    return this.post('/users', userData);
  }

  async updateUser(userId, userData) {
    return this.put(`/users/${userId}`, userData);
  }

  async deleteUser(userId) {
    return this.delete(`/users/${userId}`);
  }

  // Classroom endpoints
  async getClassrooms(params = {}) {
    const response = await this.get('/classrooms', params);
    return response.data;
  }

  async getClassroom(classroomId) {
    const response = await this.get(`/classrooms/${classroomId}`);
    return response.data;
  }

  async createClassroom(classroomData) {
    const response = await this.post('/classrooms', classroomData);
    return response.data;
  }

  async updateClassroom(classroomId, classroomData) {
    const response = await this.put(`/classrooms/${classroomId}`, classroomData);
    return response.data;
  }

  async deleteClassroom(classroomId) {
    return this.delete(`/classrooms/${classroomId}`);
  }

  async joinClassroom(code) {
    const response = await this.post('/classrooms/join', { code });
    return response.data;
  }

  async leaveClassroom(classroomId) {
    return this.post(`/classrooms/${classroomId}/leave`);
  }

  // Assignment endpoints
  async getAssignments(params = {}) {
    const response = await this.get('/assignments', params);
    return response.data;
  }

  async getAssignment(assignmentId) {
    const response = await this.get(`/assignments/${assignmentId}`);
    return response.data;
  }

  async createAssignment(assignmentData) {
    const response = await this.post('/assignments', assignmentData);
    return response.data;
  }

  // Create assignment with file uploads
  async createAssignmentWithFiles(assignmentData, files = []) {
    console.log('createAssignmentWithFiles called with:', { assignmentData, filesCount: files.length });
    
    const formData = new FormData();
    
    // Append all assignment data fields
    Object.keys(assignmentData).forEach(key => {
      if (assignmentData[key] !== undefined && assignmentData[key] !== null) {
        if (key === 'tags' && Array.isArray(assignmentData[key])) {
          formData.append(key, JSON.stringify(assignmentData[key]));
        } else {
          formData.append(key, assignmentData[key]);
        }
      }
    });
    
    // Append files
    files.forEach((file, index) => {
      console.log(`Appending file ${index}:`, file.name, file.type, file.size);
      formData.append('attachments', file);
    });
    
    // Log FormData contents
    console.log('FormData entries:');
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    
    const url = `${this.baseURL}/assignments`;
    const config = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      body: formData
    };
    
    try {
      console.log('Sending request to:', url);
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        this.setToken(null);
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating assignment with files:', error);
      throw error;
    }
  }

  async updateAssignment(assignmentId, assignmentData) {
    const response = await this.put(`/assignments/${assignmentId}`, assignmentData);
    return response.data;
  }

  // Update assignment with file uploads
  async updateAssignmentWithFiles(assignmentId, assignmentData, files = []) {
    console.log('updateAssignmentWithFiles called with:', { assignmentId, assignmentData, filesCount: files.length });
    
    const formData = new FormData();
    
    // Append all assignment data fields
    Object.keys(assignmentData).forEach(key => {
      if (assignmentData[key] !== undefined && assignmentData[key] !== null) {
        if (key === 'tags' && Array.isArray(assignmentData[key])) {
          formData.append(key, JSON.stringify(assignmentData[key]));
        } else {
          formData.append(key, assignmentData[key]);
        }
      }
    });
    
    // Append files
    files.forEach((file, index) => {
      console.log(`Appending file ${index}:`, file.name, file.type, file.size);
      formData.append('attachments', file);
    });
    
    const url = `${this.baseURL}/assignments/${assignmentId}`;
    const config = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      body: formData
    };
    
    try {
      console.log('Sending update request to:', url);
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        this.setToken(null);
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating assignment with files:', error);
      throw error;
    }
  }

  async deleteAssignment(assignmentId) {
    return this.delete(`/assignments/${assignmentId}`);
  }

  // Submission endpoints
  async getSubmissions(params = {}) {
    const response = await this.get('/submissions', params);
    return response.data;
  }

  async getSubmission(submissionId) {
    const response = await this.get(`/submissions/${submissionId}`);
    return response.data;
  }

  async createSubmission(formData) {
    // Handle FormData for file uploads
    const headers = {
      Authorization: `Bearer ${this.token}`,
    };
    // Don't set Content-Type, let browser set it with boundary for FormData
    
    // Debug: Log FormData contents
    console.log('=== FRONTEND SUBMISSION DEBUG ===');
    console.log('FormData entries:');
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`  ${pair[0]}: File(${pair[1].name}, ${pair[1].size} bytes, ${pair[1].type})`);
      } else {
        console.log(`  ${pair[0]}: ${pair[1]}`);
      }
    }
    console.log('=================================');
    
    const response = await fetch(`${this.baseURL}/submissions`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      throw new Error(errorData.message || 'Failed to create submission');
    }

    const data = await response.json();
    return data.data;
  }

  async updateSubmission(submissionId, submissionData) {
    return this.put(`/submissions/${submissionId}`, submissionData);
  }

  async deleteSubmission(submissionId) {
    return this.delete(`/submissions/${submissionId}`);
  }

  async uploadSubmissionFile(submissionId, file) {
    return this.uploadFile(`/submissions/${submissionId}/files`, file);
  }

  async reviewSubmission(submissionId, reviewData) {
    const response = await this.put(`/submissions/${submissionId}/review`, reviewData);
    return response.data;
  }

  async getSubmissionFeedback(submissionId) {
    return this.get(`/submissions/${submissionId}/feedback`);
  }

  // Repository endpoints
  async getRepositoryItems(params = {}) {
    const response = await this.get('/repository', params);
    return response.data;
  }

  async searchRepository(query, filters = {}) {
    const response = await this.get('/repository/search', { query, ...filters });
    return response.data;
  }

  async getBookmarks() {
    const response = await this.get('/repository/bookmarks/my');
    return response.data;
  }

  async toggleBookmark(itemId) {
    const response = await this.post(`/repository/${itemId}/bookmark`);
    return response.data;
  }

  async addBookmark(itemId) {
    return this.post('/bookmarks', { itemId });
  }

  async removeBookmark(itemId) {
    return this.delete(`/bookmarks/${itemId}`);
  }

  // Notification endpoints
  async getNotifications(params = {}) {
    const response = await this.get('/notifications', params);
    return response.data;
  }

  async markNotificationAsRead(notificationId) {
    const response = await this.put(`/notifications/${notificationId}/read`);
    return response.data;
  }

  async markAllNotificationsAsRead() {
    const response = await this.put('/notifications/read-all');
    return response.data;
  }

  async deleteNotification(notificationId) {
    return this.delete(`/notifications/${notificationId}`);
  }

  // Analytics endpoints
  async getAnalytics(type, params = {}) {
    return this.get(`/analytics/${type}`, params);
  }

  async getDashboardStats(role) {
    return this.get(`/analytics/dashboard/${role}`);
  }

  // Admin endpoints
  async getSystemStats() {
    return this.get('/admin/stats');
  }

  async getAuditLogs(params = {}) {
    return this.get('/admin/audit-logs', params);
  }

  async updateSystemSettings(settings) {
    return this.put('/admin/settings', settings);
  }

  // Duplicate detection
  async checkDuplicates(submissionData) {
    return this.post('/submissions/check-duplicates', submissionData);
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;