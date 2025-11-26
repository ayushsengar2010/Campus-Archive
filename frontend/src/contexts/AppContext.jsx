import { createContext, useContext, useState, useEffect } from 'react';

/**
 * Global Application Context for managing app-wide state
 * Handles notifications, classrooms, assignments, submissions, and repository data
 */
const AppContext = createContext(null);

/**
 * App Provider Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AppProvider = ({ children }) => {
  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Classrooms state
  const [classrooms, setClassrooms] = useState([]);
  const [activeClassroom, setActiveClassroom] = useState(null);

  // Assignments state
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // Repository state
  const [repositoryItems, setRepositoryItems] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  // Loading states
  const [loadingStates, setLoadingStates] = useState({
    classrooms: false,
    assignments: false,
    submissions: false,
    repository: false,
    notifications: false,
  });

  // Error states
  const [errors, setErrors] = useState({});

  /**
   * Add a notification
   * @param {Object} notification - Notification object
   */
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      ...notification,
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   */
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  /**
   * Clear all read notifications
   */
  const clearReadNotifications = () => {
    setNotifications(prev => prev.filter(n => !n.read));
  };

  /**
   * Set loading state for a specific resource
   * @param {string} resource - Resource name
   * @param {boolean} isLoading - Loading state
   */
  const setLoading = (resource, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [resource]: isLoading,
    }));
  };

  /**
   * Set error for a specific resource
   * @param {string} resource - Resource name
   * @param {string} error - Error message
   */
  const setError = (resource, error) => {
    setErrors(prev => ({
      ...prev,
      [resource]: error,
    }));
  };

  /**
   * Clear error for a specific resource
   * @param {string} resource - Resource name
   */
  const clearError = (resource) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[resource];
      return newErrors;
    });
  };

  /**
   * Add classroom to state
   * @param {Object} classroom - Classroom object
   */
  const addClassroom = (classroom) => {
    setClassrooms(prev => [...prev, classroom]);
    addNotification({
      type: 'success',
      title: 'Classroom Created',
      message: `${classroom.name} has been created successfully`,
    });
  };

  /**
   * Update classroom in state
   * @param {string} classroomId - Classroom ID
   * @param {Object} updates - Updates object
   */
  const updateClassroom = (classroomId, updates) => {
    setClassrooms(prev =>
      prev.map(c => c._id === classroomId ? { ...c, ...updates } : c)
    );
  };

  /**
   * Remove classroom from state
   * @param {string} classroomId - Classroom ID
   */
  const removeClassroom = (classroomId) => {
    setClassrooms(prev => prev.filter(c => c._id !== classroomId));
    if (activeClassroom?._id === classroomId) {
      setActiveClassroom(null);
    }
  };

  /**
   * Add assignment to state
   * @param {Object} assignment - Assignment object
   */
  const addAssignment = (assignment) => {
    setAssignments(prev => [...prev, assignment]);
    addNotification({
      type: 'info',
      title: 'New Assignment',
      message: `${assignment.title} has been posted`,
    });
  };

  /**
   * Update assignment in state
   * @param {string} assignmentId - Assignment ID
   * @param {Object} updates - Updates object
   */
  const updateAssignment = (assignmentId, updates) => {
    setAssignments(prev =>
      prev.map(a => a._id === assignmentId ? { ...a, ...updates } : a)
    );
  };

  /**
   * Remove assignment from state
   * @param {string} assignmentId - Assignment ID
   */
  const removeAssignment = (assignmentId) => {
    setAssignments(prev => prev.filter(a => a._id !== assignmentId));
  };

  /**
   * Add submission to state
   * @param {Object} submission - Submission object
   */
  const addSubmission = (submission) => {
    setSubmissions(prev => [...prev, submission]);
    addNotification({
      type: 'success',
      title: 'Submission Added',
      message: 'Your work has been submitted successfully',
    });
  };

  /**
   * Update submission in state
   * @param {string} submissionId - Submission ID
   * @param {Object} updates - Updates object
   */
  const updateSubmission = (submissionId, updates) => {
    setSubmissions(prev =>
      prev.map(s => s._id === submissionId ? { ...s, ...updates } : s)
    );
  };

  /**
   * Add bookmark
   * @param {string} itemId - Repository item ID
   */
  const addBookmark = (itemId) => {
    setBookmarks(prev => [...prev, itemId]);
  };

  /**
   * Remove bookmark
   * @param {string} itemId - Repository item ID
   */
  const removeBookmark = (itemId) => {
    setBookmarks(prev => prev.filter(id => id !== itemId));
  };

  /**
   * Check if item is bookmarked
   * @param {string} itemId - Repository item ID
   * @returns {boolean} True if bookmarked
   */
  const isBookmarked = (itemId) => {
    return bookmarks.includes(itemId);
  };

  /**
   * Reset all state
   */
  const resetState = () => {
    setNotifications([]);
    setUnreadCount(0);
    setClassrooms([]);
    setActiveClassroom(null);
    setAssignments([]);
    setSubmissions([]);
    setRepositoryItems([]);
    setBookmarks([]);
    setLoadingStates({
      classrooms: false,
      assignments: false,
      submissions: false,
      repository: false,
      notifications: false,
    });
    setErrors({});
  };

  const value = {
    // Notifications
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearReadNotifications,

    // Classrooms
    classrooms,
    setClassrooms,
    activeClassroom,
    setActiveClassroom,
    addClassroom,
    updateClassroom,
    removeClassroom,

    // Assignments
    assignments,
    setAssignments,
    addAssignment,
    updateAssignment,
    removeAssignment,

    // Submissions
    submissions,
    setSubmissions,
    addSubmission,
    updateSubmission,

    // Repository
    repositoryItems,
    setRepositoryItems,
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,

    // Loading & Errors
    loadingStates,
    setLoading,
    errors,
    setError,
    clearError,

    // Reset
    resetState,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Hook to use app context
 * @returns {Object} App context value
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
