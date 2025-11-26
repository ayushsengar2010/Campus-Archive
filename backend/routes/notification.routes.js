import express from 'express';
import {
  getNotifications,
  getNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications,
  getUnreadCount,
  createNotification
} from '../controllers/notification.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import {
  idValidation,
  paginationValidation
} from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// User routes
router.get('/', paginationValidation, getNotifications);
router.get('/unread/count', getUnreadCount);
router.get('/:id', idValidation, getNotification);
router.put('/:id/read', idValidation, markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', idValidation, deleteNotification);
router.delete('/clear-read', clearReadNotifications);

// Admin only - create notification
router.post('/', authorize('admin'), createNotification);

export default router;
