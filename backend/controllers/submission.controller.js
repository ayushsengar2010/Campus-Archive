import Submission from '../models/Submission.model.js';
import Assignment from '../models/Assignment.model.js';
import Classroom from '../models/Classroom.model.js';
import Notification from '../models/Notification.model.js';
import Repository from '../models/Repository.model.js';
import { asyncHandler, AppError } from '../middleware/error.middleware.js';

/**
 * @desc    Create new submission
 * @route   POST /api/submissions
 * @access  Private (Student)
 */
export const createSubmission = asyncHandler(async (req, res, next) => {
  const { assignment, classroom, description, githubLink } = req.body;

  // Debug logging
  console.log('=== CREATE SUBMISSION DEBUG ===');
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  console.log('User:', { id: req.user.id, name: req.user.name, role: req.user.role });
  console.log('===============================');

  // Verify assignment exists
  const assignmentDoc = await Assignment.findById(assignment);
  if (!assignmentDoc) {
    throw new AppError('Assignment not found', 404);
  }

  // Check if assignment is overdue
  if (new Date() > assignmentDoc.dueDate && !assignmentDoc.allowLateSubmission) {
    throw new AppError('Assignment submission deadline has passed', 400);
  }

  // Check if student already submitted
  const existingSubmission = await Submission.findOne({
    assignment,
    student: req.user.id
  });

  if (existingSubmission) {
    throw new AppError('You have already submitted this assignment', 400);
  }

  // Handle uploaded files
  let files = [];
  if (req.files) {
    // Handle multiple file fields (report, presentation, code)
    if (req.files.report) {
      files.push({
        ...mapFileInfo(req.files.report[0]),
        fileType: 'report'
      });
    }
    if (req.files.presentation) {
      files.push({
        ...mapFileInfo(req.files.presentation[0]),
        fileType: 'presentation'
      });
    }
    if (req.files.code) {
      files.push({
        ...mapFileInfo(req.files.code[0]),
        fileType: 'code'
      });
    }
    // Handle single field multiple files
    if (req.files.files) {
      const additionalFiles = req.files.files.map(file => ({
        ...mapFileInfo(file),
        fileType: 'document'
      }));
      files = [...files, ...additionalFiles];
    }
  }

  const submission = await Submission.create({
    assignment,
    student: req.user.id,
    classroom,
    description,
    files,
    githubLink,
    status: 'submitted',
    submittedAt: new Date()
  });

  // Update assignment submission count
  assignmentDoc.totalSubmissions += 1;
  await assignmentDoc.save();

  // Notify faculty
  await Notification.create({
    user: assignmentDoc.faculty,
    title: 'New Submission Received',
    message: `${req.user.name} submitted ${assignmentDoc.title}`,
    type: 'submission',
    relatedEntity: {
      entityType: 'submission',
      entityId: submission._id
    },
    link: `/faculty/classroom/${classroom}`
  });

  const populatedSubmission = await Submission.findById(submission._id)
    .populate('assignment', 'title dueDate maxMarks')
    .populate('student', 'name email studentId');

  res.status(201).json({
    success: true,
    message: 'Submission created successfully',
    data: populatedSubmission
  });
});

// Helper function to map file information
const mapFileInfo = (file) => ({
  filename: file.filename,
  originalName: file.originalname,
  mimetype: file.mimetype,
  size: file.size,
  path: file.path
});

/**
 * @desc    Get all submissions (filtered by role)
 * @route   GET /api/submissions
 * @access  Private
 */
export const getSubmissions = asyncHandler(async (req, res, next) => {
  const { assignment, classroom, status } = req.query;

  let query = {};

  // Filter parameters
  if (assignment) query.assignment = assignment;
  if (classroom) query.classroom = classroom;
  if (status) query.status = status;

  // Students see only their submissions
  if (req.user.role === 'student') {
    query.student = req.user.id;
  }
  // Faculty sees submissions from their classrooms
  else if (req.user.role === 'faculty') {
    const facultyClassrooms = await Classroom.find({ faculty: req.user.id }).select('_id');
    const classroomIds = facultyClassrooms.map(c => c._id);
    
    // If classroom filter is already set, verify it belongs to this faculty
    if (classroom) {
      // Verify the requested classroom is one they teach
      if (classroomIds.some(id => id.toString() === classroom)) {
        // Keep the specific classroom filter
        query.classroom = classroom;
      } else {
        // Not their classroom, return empty results
        query.classroom = null;
      }
    } else {
      // No specific classroom requested, show all from their classrooms
      query.classroom = { $in: classroomIds };
    }
  }

  const submissions = await Submission.find(query)
    .populate('assignment', 'title dueDate maxMarks type')
    .populate('student', 'name email studentId department')
    .populate('classroom', 'name code subject')
    .sort({ submittedAt: -1 });

  res.status(200).json({
    success: true,
    count: submissions.length,
    data: submissions
  });
});

/**
 * @desc    Get single submission
 * @route   GET /api/submissions/:id
 * @access  Private
 */
export const getSubmission = asyncHandler(async (req, res, next) => {
  const submission = await Submission.findById(req.params.id)
    .populate('assignment', 'title description dueDate maxMarks')
    .populate('student', 'name email studentId department')
    .populate('classroom', 'name code subject faculty')
    .populate('reviewedBy', 'name email');

  if (!submission) {
    throw new AppError('Submission not found', 404);
  }

  // Check access
  const hasAccess =
    req.user.role === 'admin' ||
    submission.student._id.toString() === req.user.id ||
    submission.classroom.faculty.toString() === req.user.id;

  if (!hasAccess) {
    throw new AppError('You do not have access to this submission', 403);
  }

  res.status(200).json({
    success: true,
    data: submission
  });
});

/**
 * @desc    Update submission (resubmit)
 * @route   PUT /api/submissions/:id
 * @access  Private (Student)
 */
export const updateSubmission = asyncHandler(async (req, res, next) => {
  let submission = await Submission.findById(req.params.id);

  if (!submission) {
    throw new AppError('Submission not found', 404);
  }

  // Check if user is the student
  if (submission.student.toString() !== req.user.id) {
    throw new AppError('Not authorized to update this submission', 403);
  }

  // Check if resubmission is allowed
  if (submission.status !== 'resubmit') {
    throw new AppError('Resubmission is not allowed for this submission', 400);
  }

  // Save previous version
  submission.previousVersions.push({
    version: submission.version,
    files: submission.files,
    submittedAt: submission.submittedAt
  });

  // Update submission
  submission.version += 1;
  submission.status = 'submitted';
  submission.submittedAt = new Date();
  
  if (req.body.description) {
    submission.description = req.body.description;
  }

  if (req.body.githubLink) {
    submission.githubLink = req.body.githubLink;
  }

  // Update files if new ones uploaded
  if (req.files && Object.keys(req.files).length > 0) {
    let newFiles = [];
    if (req.files.report) {
      newFiles.push({ ...mapFileInfo(req.files.report[0]), fileType: 'report' });
    }
    if (req.files.presentation) {
      newFiles.push({ ...mapFileInfo(req.files.presentation[0]), fileType: 'presentation' });
    }
    if (req.files.code) {
      newFiles.push({ ...mapFileInfo(req.files.code[0]), fileType: 'code' });
    }
    submission.files = newFiles;
  }

  await submission.save();

  res.status(200).json({
    success: true,
    message: 'Submission resubmitted successfully',
    data: submission
  });
});

/**
 * @desc    Review submission (Faculty)
 * @route   PUT /api/submissions/:id/review
 * @access  Private (Faculty)
 */
export const reviewSubmission = asyncHandler(async (req, res, next) => {
  const { status, marks, feedback, uploadToRepository } = req.body;

  const submission = await Submission.findById(req.params.id)
    .populate('assignment')
    .populate('student', 'name email')
    .populate('classroom');

  if (!submission) {
    throw new AppError('Submission not found', 404);
  }

  // Check if user is the faculty
  if (submission.classroom.faculty.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to review this submission', 403);
  }

  // Update submission
  submission.status = status;
  submission.marks = marks;
  submission.feedback = feedback;
  submission.reviewedBy = req.user.id;
  submission.reviewedAt = new Date();

  // Handle feedback files
  if (req.files && req.files.length > 0) {
    submission.feedbackFiles = req.files.map(file => mapFileInfo(file));
  }

  // If accepted and should be uploaded to repository (only when uploadToRepository is explicitly true)
  if (status === 'accepted' && uploadToRepository === true && submission.assignment.type === 'project') {
    const repositoryData = await createRepositoryEntry(submission, req.body);
    submission.uploadedToRepository = true;
    submission.repositoryProject = repositoryData._id;
  }

  await submission.save();

  // Notify student
  await Notification.create({
    user: submission.student._id,
    title: 'Submission Reviewed',
    message: `Your submission for ${submission.assignment.title} has been reviewed`,
    type: 'feedback',
    relatedEntity: {
      entityType: 'submission',
      entityId: submission._id
    },
    link: `/student/submissions`
  });

  res.status(200).json({
    success: true,
    message: 'Submission reviewed successfully',
    data: submission
  });
});

/**
 * Helper function to create repository entry
 */
const createRepositoryEntry = async (submission, reviewData) => {
  const { category, tags, type } = reviewData;

  // Get current academic year if not in classroom
  const currentYear = new Date().getFullYear();
  const academicYear = submission.classroom.academicYear || `${currentYear}-${currentYear + 1}`;

  const repository = await Repository.create({
    title: submission.assignment.title,
    description: submission.description || submission.assignment.description,
    student: submission.student._id,
    faculty: submission.classroom.faculty,
    submission: submission._id,
    classroom: submission.classroom._id,
    category: category || 'Other',
    type: type || 'Project',
    academicYear: academicYear,
    semester: submission.classroom.semester || 'Fall',
    files: {
      report: submission.files.find(f => f.fileType === 'report'),
      presentation: submission.files.find(f => f.fileType === 'presentation'),
      code: submission.files.find(f => f.fileType === 'code')
    },
    githubLink: submission.githubLink,
    tags: tags || [],
    isPublic: true
  });

  return repository;
};

/**
 * @desc    Delete submission
 * @route   DELETE /api/submissions/:id
 * @access  Private (Student/Admin)
 */
export const deleteSubmission = asyncHandler(async (req, res, next) => {
  const submission = await Submission.findById(req.params.id);

  if (!submission) {
    throw new AppError('Submission not found', 404);
  }

  // Check authorization
  if (submission.student.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this submission', 403);
  }

  // Can only delete if not yet reviewed
  if (submission.status !== 'submitted' && submission.status !== 'pending') {
    throw new AppError('Cannot delete a reviewed submission', 400);
  }

  await submission.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Submission deleted successfully',
    data: {}
  });
});
