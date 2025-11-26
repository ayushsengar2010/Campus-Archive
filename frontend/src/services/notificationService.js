// Notification Service
class NotificationService {
  constructor() {
    this.notifications = [];
    this.subscribers = [];
    this.unreadCount = 0;
  }

  // Subscribe to notification updates
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Notify all subscribers
  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.notifications, this.unreadCount));
  }

  // Add a new notification
  addNotification(notification) {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    this.notifications.unshift(newNotification);
    this.unreadCount++;
    this.notifySubscribers();

    // Auto-remove after 30 days
    setTimeout(() => {
      this.removeNotification(newNotification.id);
    }, 30 * 24 * 60 * 60 * 1000);

    return newNotification.id;
  }

  // Mark notification as read
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
      this.notifySubscribers();
    }
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.unreadCount = 0;
    this.notifySubscribers();
  }

  // Remove notification
  removeNotification(notificationId) {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index > -1) {
      const notification = this.notifications[index];
      if (!notification.read) {
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
      this.notifications.splice(index, 1);
      this.notifySubscribers();
    }
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.unreadCount = 0;
    this.notifySubscribers();
  }

  // Get notifications with pagination
  getNotifications(page = 1, limit = 20) {
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      notifications: this.notifications.slice(start, end),
      total: this.notifications.length,
      unreadCount: this.unreadCount,
      hasMore: end < this.notifications.length
    };
  }

  // Notification type helpers
  createSubmissionNotification(type, data) {
    const notifications = {
      'submission_received': {
        type: 'submission',
        title: 'New Submission Received',
        message: `${data.studentName} submitted "${data.title}"`,
        icon: 'file-text',
        priority: 'medium',
        actionUrl: `/faculty/review/${data.submissionId}`,
        actionText: 'Review Submission'
      },
      'submission_approved': {
        type: 'success',
        title: 'Submission Approved',
        message: `Your submission "${data.title}" has been approved`,
        icon: 'check-circle',
        priority: 'high',
        actionUrl: `/student/submissions/${data.submissionId}`,
        actionText: 'View Details'
      },
      'submission_rejected': {
        type: 'warning',
        title: 'Submission Needs Revision',
        message: `Your submission "${data.title}" requires changes`,
        icon: 'alert-circle',
        priority: 'high',
        actionUrl: `/student/submissions/${data.submissionId}`,
        actionText: 'View Feedback'
      },
      'feedback_received': {
        type: 'info',
        title: 'New Feedback Available',
        message: `${data.facultyName} provided feedback on "${data.title}"`,
        icon: 'message-circle',
        priority: 'medium',
        actionUrl: `/student/submissions/${data.submissionId}`,
        actionText: 'Read Feedback'
      }
    };

    return notifications[type] || null;
  }

  createDeadlineNotification(type, data) {
    const notifications = {
      'deadline_approaching': {
        type: 'warning',
        title: 'Deadline Approaching',
        message: `${data.title} deadline is in ${data.daysLeft} days`,
        icon: 'clock',
        priority: 'medium',
        actionUrl: data.actionUrl,
        actionText: 'View Details'
      },
      'deadline_passed': {
        type: 'error',
        title: 'Deadline Passed',
        message: `${data.title} deadline has passed`,
        icon: 'alert-triangle',
        priority: 'high',
        actionUrl: data.actionUrl,
        actionText: 'Contact Admin'
      }
    };

    return notifications[type] || null;
  }

  createSystemNotification(type, data) {
    const notifications = {
      'system_maintenance': {
        type: 'info',
        title: 'System Maintenance',
        message: `Scheduled maintenance on ${data.date}`,
        icon: 'settings',
        priority: 'low',
        actionUrl: '/announcements',
        actionText: 'Learn More'
      },
      'new_feature': {
        type: 'success',
        title: 'New Feature Available',
        message: data.message,
        icon: 'star',
        priority: 'low',
        actionUrl: data.actionUrl,
        actionText: 'Try It Now'
      }
    };

    return notifications[type] || null;
  }

  // Send notification based on type
  sendNotification(category, type, data) {
    let notification = null;

    switch (category) {
      case 'submission':
        notification = this.createSubmissionNotification(type, data);
        break;
      case 'deadline':
        notification = this.createDeadlineNotification(type, data);
        break;
      case 'system':
        notification = this.createSystemNotification(type, data);
        break;
      default:
        notification = {
          type: 'info',
          title: data.title || 'Notification',
          message: data.message || '',
          icon: data.icon || 'bell',
          priority: data.priority || 'medium'
        };
    }

    if (notification) {
      return this.addNotification(notification);
    }

    return null;
  }
}

// Create singleton instance
const notificationService = new NotificationService();

// Mock some initial notifications for demo
setTimeout(() => {
  notificationService.sendNotification('submission', 'submission_received', {
    studentName: 'John Doe',
    title: 'Machine Learning Project',
    submissionId: '123'
  });

  notificationService.sendNotification('deadline', 'deadline_approaching', {
    title: 'Final Project Submission',
    daysLeft: 3,
    actionUrl: '/student/dashboard'
  });

  notificationService.sendNotification('system', 'new_feature', {
    message: 'New duplicate detection system is now available',
    actionUrl: '/features/duplicate-detection'
  });
}, 1000);

export default notificationService;