/**
 * Form Validation Utilities
 * Provides validation rules and helper functions for form inputs
 */

/**
 * Validation rules
 */
export const validationRules = {
  required: (value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined && value !== '';
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  minLength: (min) => (value) => {
    return value && value.length >= min;
  },

  maxLength: (max) => (value) => {
    return value && value.length <= max;
  },

  password: (value) => {
    // At least 6 characters, contains at least one letter and one number
    return value && value.length >= 6;
  },

  strongPassword: (value) => {
    // At least 8 characters, contains uppercase, lowercase, number, and special char
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongRegex.test(value);
  },

  match: (otherValue) => (value) => {
    return value === otherValue;
  },

  phone: (value) => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(value);
  },

  url: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  number: (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },

  positiveNumber: (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value) && parseFloat(value) > 0;
  },

  integer: (value) => {
    return Number.isInteger(Number(value));
  },

  date: (value) => {
    return !isNaN(Date.parse(value));
  },

  futureDate: (value) => {
    const date = new Date(value);
    return date > new Date();
  },

  pastDate: (value) => {
    const date = new Date(value);
    return date < new Date();
  },

  fileSize: (maxSizeMB) => (file) => {
    if (!file) return true;
    const maxBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxBytes;
  },

  fileType: (allowedTypes) => (file) => {
    if (!file) return true;
    return allowedTypes.includes(file.type);
  },

  fileExtension: (allowedExtensions) => (file) => {
    if (!file) return true;
    const ext = file.name.split('.').pop().toLowerCase();
    return allowedExtensions.includes(ext);
  },
};

/**
 * Error messages for validation rules
 */
export const errorMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: (min) => `Must be at least ${min} characters`,
  maxLength: (max) => `Must be no more than ${max} characters`,
  password: 'Password must be at least 6 characters',
  strongPassword: 'Password must contain uppercase, lowercase, number, and special character',
  match: 'Values do not match',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  number: 'Please enter a valid number',
  positiveNumber: 'Please enter a positive number',
  integer: 'Please enter a whole number',
  date: 'Please enter a valid date',
  futureDate: 'Date must be in the future',
  pastDate: 'Date must be in the past',
  fileSize: (maxSizeMB) => `File size must be less than ${maxSizeMB}MB`,
  fileType: 'File type not allowed',
  fileExtension: 'File extension not allowed',
};

/**
 * Validate a single field
 * @param {any} value - Field value
 * @param {Array} rules - Array of validation rule objects
 * @returns {string|null} Error message or null if valid
 */
export const validateField = (value, rules = []) => {
  for (const rule of rules) {
    const { validate, message } = rule;
    
    if (!validate(value)) {
      return message;
    }
  }
  
  return null;
};

/**
 * Validate entire form
 * @param {Object} formData - Form data object
 * @param {Object} validationSchema - Validation schema
 * @returns {Object} Errors object
 */
export const validateForm = (formData, validationSchema) => {
  const errors = {};
  
  Object.keys(validationSchema).forEach((fieldName) => {
    const rules = validationSchema[fieldName];
    const value = formData[fieldName];
    const error = validateField(value, rules);
    
    if (error) {
      errors[fieldName] = error;
    }
  });
  
  return errors;
};

/**
 * Check if form has any errors
 * @param {Object} errors - Errors object
 * @returns {boolean} True if form has errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Create validation rule
 * @param {Function} validate - Validation function
 * @param {string} message - Error message
 * @returns {Object} Validation rule object
 */
export const createRule = (validate, message) => {
  return { validate, message };
};

/**
 * Common validation schemas
 */
export const schemas = {
  login: {
    email: [
      createRule(validationRules.required, errorMessages.required),
      createRule(validationRules.email, errorMessages.email),
    ],
    password: [
      createRule(validationRules.required, errorMessages.required),
    ],
  },

  register: {
    name: [
      createRule(validationRules.required, errorMessages.required),
      createRule(validationRules.minLength(2), errorMessages.minLength(2)),
    ],
    email: [
      createRule(validationRules.required, errorMessages.required),
      createRule(validationRules.email, errorMessages.email),
    ],
    password: [
      createRule(validationRules.required, errorMessages.required),
      createRule(validationRules.password, errorMessages.password),
    ],
    confirmPassword: [
      createRule(validationRules.required, errorMessages.required),
    ],
    department: [
      createRule(validationRules.required, errorMessages.required),
    ],
  },

  profile: {
    name: [
      createRule(validationRules.required, errorMessages.required),
      createRule(validationRules.minLength(2), errorMessages.minLength(2)),
    ],
    email: [
      createRule(validationRules.required, errorMessages.required),
      createRule(validationRules.email, errorMessages.email),
    ],
  },

  changePassword: {
    currentPassword: [
      createRule(validationRules.required, errorMessages.required),
    ],
    newPassword: [
      createRule(validationRules.required, errorMessages.required),
      createRule(validationRules.password, errorMessages.password),
    ],
    confirmPassword: [
      createRule(validationRules.required, errorMessages.required),
    ],
  },

  classroom: {
    name: [
      createRule(validationRules.required, errorMessages.required),
      createRule(validationRules.minLength(3), errorMessages.minLength(3)),
    ],
    code: [
      createRule(validationRules.required, errorMessages.required),
      createRule(validationRules.minLength(4), errorMessages.minLength(4)),
    ],
    subject: [
      createRule(validationRules.required, errorMessages.required),
    ],
    semester: [
      createRule(validationRules.required, errorMessages.required),
    ],
  },

  assignment: {
    title: [
      createRule(validationRules.required, errorMessages.required),
      createRule(validationRules.minLength(5), errorMessages.minLength(5)),
    ],
    description: [
      createRule(validationRules.required, errorMessages.required),
      createRule(validationRules.minLength(10), errorMessages.minLength(10)),
    ],
    dueDate: [
      createRule(validationRules.required, errorMessages.required),
      createRule(validationRules.date, errorMessages.date),
      createRule(validationRules.futureDate, errorMessages.futureDate),
    ],
    maxMarks: [
      createRule(validationRules.required, errorMessages.required),
      createRule(validationRules.positiveNumber, errorMessages.positiveNumber),
    ],
  },

  submission: {
    title: [
      createRule(validationRules.required, errorMessages.required),
      createRule(validationRules.minLength(5), errorMessages.minLength(5)),
    ],
    description: [
      createRule(validationRules.required, errorMessages.required),
      createRule(validationRules.minLength(20), errorMessages.minLength(20)),
    ],
  },
};

/**
 * Sanitize input to prevent XSS
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Trim all string values in an object
 * @param {Object} obj - Object to trim
 * @returns {Object} Trimmed object
 */
export const trimObjectStrings = (obj) => {
  const trimmed = {};
  
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    trimmed[key] = typeof value === 'string' ? value.trim() : value;
  });
  
  return trimmed;
};
