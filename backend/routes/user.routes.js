import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  toggleUserStatus,
  getStudentsByDepartment
} from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { idValidation, paginationValidation } from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/', authorize('admin'), paginationValidation, getAllUsers);
router.get('/stats/overview', authorize('admin'), getUserStats);
router.put('/:id', authorize('admin'), idValidation, updateUser);
router.delete('/:id', authorize('admin'), idValidation, deleteUser);
router.patch('/:id/status', authorize('admin'), idValidation, toggleUserStatus);

// Faculty and Admin can access
router.get('/students/by-department', authorize('faculty', 'admin'), getStudentsByDepartment);

// Any authenticated user can view user profiles
router.get('/:id', idValidation, getUserById);

export default router;
