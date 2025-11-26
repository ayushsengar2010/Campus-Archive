import { useState, useEffect } from 'react';
import notificationService from '../services/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load
    const { notifications: initialNotifications, unreadCount: initialUnreadCount } = 
      notificationService.getNotifications();
    
    setNotifications(initialNotifications);
    setUnreadCount(initialUnreadCount);
    setLoading(false);

    // Subscribe to updates
    const unsubscribe = notificationService.subscribe((updatedNotifications, updatedUnreadCount) => {
      setNotifications([...updatedNotifications]);
      setUnreadCount(updatedUnreadCount);
    });

    return unsubscribe;
  }, []);

  const markAsRead = (notificationId) => {
    notificationService.markAsRead(notificationId);
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const removeNotification = (notificationId) => {
    notificationService.removeNotification(notificationId);
  };

  const clearAll = () => {
    notificationService.clearAll();
  };

  const sendNotification = (category, type, data) => {
    return notificationService.sendNotification(category, type, data);
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    sendNotification
  };
};