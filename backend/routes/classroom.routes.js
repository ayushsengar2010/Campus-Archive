import express from 'express';
import {
  createClassroom,
  getClassrooms,
  getClassroom,
  updateClassroom,
  deleteClassroom,
  joinClassroom,
  leaveClassroom,
  removeStudent
} from '../controllers/classroom.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import {
  createClassroomValidation,
  idValidation
} from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public to authenticated users
router.get('/', getClassrooms);
router.get('/:id', idValidation, getClassroom);

// Faculty only routes
router.post('/', authorize('faculty', 'admin'), createClassroomValidation, createClassroom);
router.put('/:id', authorize('faculty', 'admin'), idValidation, updateClassroom);
router.delete('/:id', authorize('faculty', 'admin'), idValidation, deleteClassroom);
router.delete('/:id/students/:studentId', authorize('faculty', 'admin'), removeStudent);

// Student routes
router.post('/join', authorize('student'), joinClassroom);
router.post('/:id/leave', authorize('student'), idValidation, leaveClassroom);

export default router;
