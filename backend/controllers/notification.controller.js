import Notification from '../models/Notification.model.js';
import { asyncHandler, AppError } from '../middleware/error.middleware.js';

/**
 * @desc    Get all notifications for current user
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = asyncHandler(async (req, res, next) => {
  const { isRead, type, page = 1, limit = 20 } = req.query;

  let query = { user: req.user.id };

  // Apply filters
  if (isRead !== undefined) query.isRead = isRead === 'true';
  if (type) query.type = type;

  // Pagination
  const skip = (page - 1) * limit;

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ 
    user: req.user.id, 
    isRead: false 
  });

  res.status(200).json({
    success: true,
    count: notifications.length,
    total,
    unreadCount,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: notifications
  });
});

/**
 * @desc    Get single notification
 * @route   GET /api/notifications/:id
 * @access  Private
 */
export const getNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  // Check if notification belongs to user
  if (notification.user.toString() !== req.user.id) {
    throw new AppError('Not authorized to access this notification', 403);
  }

  res.status(200).json({
    success: true,
    data: notification
  });
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  // Check if notification belongs to user
  if (notification.user.toString() !== req.user.id) {
    throw new AppError('Not authorized to modify this notification', 403);
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: notification
  });
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { user: req.user.id, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
export const deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  // Check if notification belongs to user
  if (notification.user.toString() !== req.user.id) {
    throw new AppError('Not authorized to delete this notification', 403);
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully',
    data: {}
  });
});

/**
 * @desc    Delete all read notifications
 * @route   DELETE /api/notifications/clear-read
 * @access  Private
 */
export const clearReadNotifications = asyncHandler(async (req, res, next) => {
  const result = await Notification.deleteMany({
    user: req.user.id,
    isRead: true
  });

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} notifications cleared`,
    deletedCount: result.deletedCount
  });
});

/**
 * @desc    Get unread notification count
 * @route   GET /api/notifications/unread/count
 * @access  Private
 */
export const getUnreadCount = asyncHandler(async (req, res, next) => {
  const count = await Notification.countDocuments({
    user: req.user.id,
    isRead: false
  });

  res.status(200).json({
    success: true,
    data: { unreadCount: count }
  });
});

/**
 * @desc    Create notification (internal use)
 * @route   POST /api/notifications
 * @access  Private (Admin)
 */
export const createNotification = asyncHandler(async (req, res, next) => {
  const { user, title, message, type, relatedEntity, link } = req.body;

  const notification = await Notification.create({
    user,
    title,
    message,
    type: type || 'info',
    relatedEntity,
    link
  });

  res.status(201).json({
    success: true,
    message: 'Notification created successfully',
    data: notification
  });
});
