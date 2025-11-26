import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../uploads');
const createUploadDirs = () => {
  const dirs = [
    uploadDir,
    path.join(uploadDir, 'assignments'),
    path.join(uploadDir, 'submissions'),
    path.join(uploadDir, 'feedback'),
    path.join(uploadDir, 'avatars'),
    path.join(uploadDir, 'repository')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/';
    
    // Determine folder based on route or file field
    if (req.baseUrl.includes('submission')) {
      folder = 'uploads/submissions/';
    } else if (req.baseUrl.includes('assignment')) {
      folder = 'uploads/assignments/';
    } else if (req.baseUrl.includes('feedback')) {
      folder = 'uploads/feedback/';
    } else if (req.baseUrl.includes('repository')) {
      folder = 'uploads/repository/';
    } else if (file.fieldname === 'avatar') {
      folder = 'uploads/avatars/';
    }
    
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '_');
    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file extensions
  const allowedExtensions = [
    '.pdf', '.doc', '.docx',           // Documents
    '.ppt', '.pptx',                   // Presentations
    '.zip', '.rar', '.7z',             // Archives
    '.jpg', '.jpeg', '.png', '.gif',   // Images
    '.txt', '.md',                     // Text files
    '.csv', '.xlsx', '.xls'            // Spreadsheets
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${ext} is not supported. Allowed types: ${allowedExtensions.join(', ')}`), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
  fileFilter: fileFilter
});

/**
 * Middleware for single file upload
 */
export const uploadSingle = (fieldName) => upload.single(fieldName);

/**
 * Middleware for multiple files upload (same field)
 */
export const uploadMultiple = (fieldName, maxCount = 10) => upload.array(fieldName, maxCount);

/**
 * Middleware for multiple fields with different names
 */
export const uploadFields = (fields) => upload.fields(fields);

/**
 * Middleware for structured project uploads (report, presentation, code) and regular assignment files
 */
export const uploadProjectFiles = upload.fields([
  { name: 'report', maxCount: 1 },
  { name: 'presentation', maxCount: 1 },
  { name: 'code', maxCount: 1 },
  { name: 'files', maxCount: 10 } // For regular assignments
]);

/**
 * Middleware for assignment attachments
 */
export const uploadAssignmentFiles = upload.array('attachments', 5);

/**
 * Middleware for feedback attachments
 */
export const uploadFeedbackFiles = upload.array('feedbackFiles', 3);

/**
 * Error handling for multer
 */
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds the maximum limit of 10MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field'
      });
    }
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error'
    });
  }
  
  next();
};

/**
 * Helper function to delete file
 */
export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

export default upload;
