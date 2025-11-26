import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  verifyToken
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  registerValidation,
  loginValidation
} from '../middleware/validation.middleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', authRateLimiter, registerValidation, register);
router.post('/login', authRateLimiter, loginValidation, login);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.get('/verify', authenticate, verifyToken);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

export default router;
