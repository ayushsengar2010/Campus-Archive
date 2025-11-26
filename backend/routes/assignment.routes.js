import express from 'express';
import {
  createAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByClassroom
} from '../controllers/assignment.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import {
  createAssignmentValidation,
  idValidation,
  paginationValidation
} from '../middleware/validation.middleware.js';
import {
  uploadAssignmentFiles,
  handleMulterError
} from '../middleware/upload.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get assignments (filtered by role)
router.get('/', paginationValidation, getAssignments);
router.get('/classroom/:classroomId', idValidation, getAssignmentsByClassroom);
router.get('/:id', idValidation, getAssignment);

// Faculty only routes
router.post(
  '/',
  authorize('faculty', 'admin'),
  uploadAssignmentFiles,
  handleMulterError,
  createAssignmentValidation,
  createAssignment
);

router.put(
  '/:id',
  authorize('faculty', 'admin'),
  uploadAssignmentFiles,
  handleMulterError,
  idValidation,
  updateAssignment
);

router.delete(
  '/:id',
  authorize('faculty', 'admin'),
  idValidation,
  deleteAssignment
);

export default router;
