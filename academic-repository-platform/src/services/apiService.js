// API Service Layer
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async register(userData) {
    return this.post('/auth/register', userData);
  }

  async logout() {
    try {
      await this.post('/auth/logout');
    } finally {
      this.setToken(null);
    }
  }

  async refreshToken() {
    const response = await this.post('/auth/refresh');
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  // User endpoints
  async getCurrentUser() {
    return this.get('/users/me');
  }

  async updateProfile(userData) {
    return this.put('/users/me', userData);
  }

  async getUsers(params = {}) {
    return this.get('/users', params);
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

  // Submission endpoints
  async getSubmissions(params = {}) {
    return this.get('/submissions', params);
  }

  async getSubmission(submissionId) {
    return this.get(`/submissions/${submissionId}`);
  }

  async createSubmission(submissionData) {
    return this.post('/submissions', submissionData);
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
    return this.post(`/submissions/${submissionId}/review`, reviewData);
  }

  async getSubmissionFeedback(submissionId) {
    return this.get(`/submissions/${submissionId}/feedback`);
  }

  // Repository endpoints
  async getRepositoryItems(params = {}) {
    return this.get('/repository', params);
  }

  async searchRepository(query, filters = {}) {
    return this.get('/repository/search', { query, ...filters });
  }

  async getBookmarks() {
    return this.get('/bookmarks');
  }

  async addBookmark(itemId) {
    return this.post('/bookmarks', { itemId });
  }

  async removeBookmark(itemId) {
    return this.delete(`/bookmarks/${itemId}`);
  }

  // Notification endpoints
  async getNotifications(params = {}) {
    return this.get('/notifications', params);
  }

  async markNotificationAsRead(notificationId) {
    return this.patch(`/notifications/${notificationId}`, { read: true });
  }

  async markAllNotificationsAsRead() {
    return this.patch('/notifications/mark-all-read');
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