import express from 'express';
import {
  createSubmission,
  getSubmissions,
  getSubmission,
  updateSubmission,
  reviewSubmission,
  deleteSubmission
} from '../controllers/submission.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import {
  createSubmissionValidation,
  feedbackValidation,
  idValidation,
  paginationValidation
} from '../middleware/validation.middleware.js';
import {
  uploadProjectFiles,
  uploadFeedbackFiles,
  handleMulterError
} from '../middleware/upload.middleware.js';
import { uploadRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get submissions (filtered by role)
router.get('/', paginationValidation, getSubmissions);
router.get('/:id', idValidation, getSubmission);

// Student routes
router.post(
  '/',
  authorize('student'),
  uploadRateLimiter,
  uploadProjectFiles,
  handleMulterError,
  createSubmissionValidation,
  createSubmission
);

router.put(
  '/:id',
  authorize('student'),
  idValidation,
  uploadProjectFiles,
  handleMulterError,
  updateSubmission
);

router.delete(
  '/:id',
  authorize('student', 'admin'),
  idValidation,
  deleteSubmission
);

// Faculty routes - review submission
router.put(
  '/:id/review',
  authorize('faculty', 'admin'),
  idValidation,
  uploadFeedbackFiles,
  handleMulterError,
  feedbackValidation,
  reviewSubmission
);

export default router;
