export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  STUDENT_DASHBOARD: '/student',
  FACULTY_DASHBOARD: '/faculty',
  ADMIN_DASHBOARD: '/admin',
  RESEARCHER_DASHBOARD: '/researcher',
  REPOSITORY: '/repository',
};

export const USER_ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  ADMIN: 'admin',
  RESEARCHER: 'researcher',
};

export const SUBMISSION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RESUBMIT: 'resubmit',
};

export const SUBMISSION_TYPES = {
  PROJECT: 'project',
  ASSIGNMENT: 'assignment',
  RESEARCH: 'research',
  PROPOSAL: 'proposal',
};

export const NOTIFICATION_TYPES = {
  SUBMISSION: 'submission',
  FEEDBACK: 'feedback',
  DEADLINE: 'deadline',
  SYSTEM: 'system',
};