import express from 'express';
import {
  getRepositoryProjects,
  getRepositoryProject,
  createRepositoryProject,
  updateRepositoryProject,
  deleteRepositoryProject,
  toggleBookmark,
  getMyBookmarks,
  incrementDownload,
  getFeaturedProjects
} from '../controllers/repository.controller.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.middleware.js';
import {
  idValidation,
  paginationValidation
} from '../middleware/validation.middleware.js';
import {
  uploadProjectFiles,
  handleMulterError
} from '../middleware/upload.middleware.js';

const router = express.Router();

// Public routes with optional authentication
router.get('/', optionalAuth, paginationValidation, getRepositoryProjects);
router.get('/featured', optionalAuth, getFeaturedProjects);
router.get('/:id', optionalAuth, idValidation, getRepositoryProject);
router.post('/:id/download', optionalAuth, idValidation, incrementDownload);

// Protected routes
router.use(authenticate);

// Bookmarks
router.post('/:id/bookmark', idValidation, toggleBookmark);
router.get('/bookmarks/my', getMyBookmarks);

// Create project (Researcher/Admin)
router.post(
  '/',
  authorize('researcher', 'faculty', 'admin'),
  uploadProjectFiles,
  handleMulterError,
  createRepositoryProject
);

// Update/Delete (Faculty/Admin/Owner)
router.put('/:id', idValidation, updateRepositoryProject);
router.delete(
  '/:id',
  authorize('faculty', 'admin'),
  idValidation,
  deleteRepositoryProject
);

export default router;
