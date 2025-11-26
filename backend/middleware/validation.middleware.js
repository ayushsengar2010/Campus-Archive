import { body, param, query, validationResult } from 'express-validator';

/**
 * Middleware to handle validation results
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('=== VALIDATION FAILED ===');
    console.log('Request body:', req.body);
    console.log('Errors:', errors.array());
    console.log('========================');
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Validation rules for user registration
 */
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['student', 'faculty', 'admin', 'researcher']).withMessage('Invalid role'),
  body('studentId')
    .optional()
    .trim(),
  body('department')
    .optional()
    .trim(),
  validate
];

/**
 * Validation rules for user login
 */
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];

/**
 * Validation rules for creating classroom
 */
export const createClassroomValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Classroom name is required')
    .isLength({ max: 100 }).withMessage('Classroom name cannot exceed 100 characters'),
  body('code')
    .trim()
    .notEmpty().withMessage('Classroom code is required')
    .matches(/^[A-Z0-9]{6,10}$/).withMessage('Code must be 6-10 uppercase alphanumeric characters'),
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required'),
  body('semester')
    .trim()
    .notEmpty().withMessage('Semester is required'),
  body('academicYear')
    .trim()
    .notEmpty().withMessage('Academic year is required'),
  validate
];

/**
 * Validation rules for creating assignment
 */
export const createAssignmentValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Assignment title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('classroom')
    .notEmpty().withMessage('Classroom ID is required')
    .isMongoId().withMessage('Invalid classroom ID'),
  body('type')
    .optional()
    .isIn(['assignment', 'project', 'quiz', 'lab', 'presentation']).withMessage('Invalid assignment type'),
  body('dueDate')
    .notEmpty().withMessage('Due date is required')
    .isISO8601().withMessage('Invalid date format'),
  body('maxMarks')
    .notEmpty().withMessage('Maximum marks is required')
    .isInt({ min: 0 }).withMessage('Marks must be a positive number'),
  validate
];

/**
 * Validation rules for submission
 */
export const createSubmissionValidation = [
  body('assignment')
    .notEmpty().withMessage('Assignment ID is required')
    .isMongoId().withMessage('Invalid assignment ID format'),
  body('classroom')
    .notEmpty().withMessage('Classroom ID is required')
    .isMongoId().withMessage('Invalid classroom ID format'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('githubLink')
    .optional()
    .trim()
    .isURL().withMessage('Please provide a valid URL'),
  validate
];

/**
 * Validation rules for feedback
 */
export const feedbackValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'submitted', 'reviewed', 'accepted', 'rejected', 'resubmit'])
    .withMessage('Invalid status'),
  body('marks')
    .optional()
    .isInt({ min: 0 }).withMessage('Marks must be a positive number'),
  body('feedback')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Feedback cannot exceed 2000 characters'),
  validate
];

/**
 * Validation rules for MongoDB ObjectId params
 */
export const idValidation = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  validate
];

/**
 * Validation rules for pagination
 */
export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validate
];
