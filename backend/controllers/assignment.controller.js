import Assignment from '../models/Assignment.model.js';
import Classroom from '../models/Classroom.model.js';
import Notification from '../models/Notification.model.js';
import { asyncHandler, AppError } from '../middleware/error.middleware.js';

/**
 * @desc    Create new assignment
 * @route   POST /api/assignments
 * @access  Private (Faculty)
 */
export const createAssignment = asyncHandler(async (req, res, next) => {
  console.log('=== CREATE ASSIGNMENT REQUEST ===');
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  console.log('Files count:', req.files?.length || 0);
  
  const {
    title,
    description,
    classroom,
    type,
    isStructured,
    dueDate,
    maxMarks,
    instructions,
    allowLateSubmission,
    lateSubmissionDeadline,
    requiredFields
  } = req.body;

  // Verify classroom exists and user is the faculty
  const classroomDoc = await Classroom.findById(classroom);
  if (!classroomDoc) {
    throw new AppError('Classroom not found', 404);
  }

  if (classroomDoc.faculty.toString() !== req.user.id) {
    throw new AppError('Only the classroom faculty can create assignments', 403);
  }

  // Handle file attachments if uploaded
  let attachments = [];
  if (req.files && req.files.length > 0) {
    console.log('Processing', req.files.length, 'file attachments');
    attachments = req.files.map(file => {
      const filePath = `/${file.path.replace(/\\/g, '/')}`;
      console.log('File processed:', { 
        originalName: file.originalname, 
        filename: file.filename,
        path: filePath,
        size: file.size 
      });
      return {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: filePath // Convert to URL path with forward slashes
      };
    });
  } else {
    console.log('No files received in request');
  }

  console.log('Final attachments array:', attachments);

  const assignment = await Assignment.create({
    title,
    description,
    classroom,
    faculty: req.user.id,
    type: type || 'assignment',
    isStructured: isStructured || false,
    dueDate,
    maxMarks,
    instructions,
    attachments,
    allowLateSubmission: allowLateSubmission || false,
    lateSubmissionDeadline,
    requiredFields: requiredFields || {}
  });

  // Notify all students in the classroom
  const students = classroomDoc.students;
  const notifications = students.map(studentId => ({
    user: studentId,
    title: 'New Assignment Posted',
    message: `New assignment "${title}" has been posted in ${classroomDoc.name}`,
    type: 'assignment',
    relatedEntity: {
      entityType: 'assignment',
      entityId: assignment._id
    },
    link: `/student/classroom/${classroom}`
  }));

  await Notification.insertMany(notifications);

  res.status(201).json({
    success: true,
    message: 'Assignment created successfully',
    data: assignment
  });
});

/**
 * @desc    Get all assignments (filtered by role)
 * @route   GET /api/assignments
 * @access  Private
 */
export const getAssignments = asyncHandler(async (req, res, next) => {
  const { classroom, type, status } = req.query;

  let query = { isPublished: true };

  // Filter by classroom if provided
  if (classroom) {
    query.classroom = classroom;
  }

  // Filter by type if provided
  if (type) {
    query.type = type;
  }

  // Faculty sees their assignments
  if (req.user.role === 'faculty') {
    query.faculty = req.user.id;
  }
  // Students see assignments from their enrolled classrooms
  else if (req.user.role === 'student') {
    const enrolledClassrooms = await Classroom.find({ students: req.user.id }).select('_id');
    const classroomIds = enrolledClassrooms.map(c => c._id);
    
    // If classroom filter is already set, ensure it's in their enrolled classrooms
    if (classroom) {
      // Verify the requested classroom is one they're enrolled in
      if (classroomIds.some(id => id.toString() === classroom)) {
        // Keep the specific classroom filter
        query.classroom = classroom;
      } else {
        // Not enrolled, return empty results
        query.classroom = null;
      }
    } else {
      // No specific classroom requested, show all from enrolled classrooms
      query.classroom = { $in: classroomIds };
    }
  }

  const assignments = await Assignment.find(query)
    .populate('classroom', 'name code subject')
    .populate('faculty', 'name email')
    .sort({ dueDate: 1 });

  res.status(200).json({
    success: true,
    count: assignments.length,
    data: assignments
  });
});

/**
 * @desc    Get single assignment
 * @route   GET /api/assignments/:id
 * @access  Private
 */
export const getAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id)
    .populate('classroom', 'name code subject students')
    .populate('faculty', 'name email department');

  if (!assignment) {
    throw new AppError('Assignment not found', 404);
  }

  // Check access
  const hasAccess =
    req.user.role === 'admin' ||
    assignment.faculty._id.toString() === req.user.id ||
    assignment.classroom.students.some(s => s.toString() === req.user.id);

  if (!hasAccess) {
    throw new AppError('You do not have access to this assignment', 403);
  }

  res.status(200).json({
    success: true,
    data: assignment
  });
});

/**
 * @desc    Update assignment
 * @route   PUT /api/assignments/:id
 * @access  Private (Faculty)
 */
export const updateAssignment = asyncHandler(async (req, res, next) => {
  console.log('=== UPDATE ASSIGNMENT REQUEST ===');
  console.log('Assignment ID:', req.params.id);
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  console.log('Files count:', req.files?.length || 0);
  
  let assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    throw new AppError('Assignment not found', 404);
  }

  // Check if user is the faculty
  if (assignment.faculty.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this assignment', 403);
  }

  // Handle new file attachments if uploaded
  if (req.files && req.files.length > 0) {
    console.log('Processing', req.files.length, 'new file attachments');
    const newAttachments = req.files.map(file => {
      const filePath = `/${file.path.replace(/\\/g, '/')}`;
      console.log('File processed:', { 
        originalName: file.originalname, 
        filename: file.filename,
        path: filePath,
        size: file.size 
      });
      return {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: filePath
      };
    });
    
    // Append new attachments to existing ones
    req.body.attachments = [...(assignment.attachments || []), ...newAttachments];
    console.log('Total attachments after update:', req.body.attachments.length);
  }

  assignment = await Assignment.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Assignment updated successfully',
    data: assignment
  });
});

/**
 * @desc    Delete assignment
 * @route   DELETE /api/assignments/:id
 * @access  Private (Faculty)
 */
export const deleteAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    throw new AppError('Assignment not found', 404);
  }

  // Check if user is the faculty
  if (assignment.faculty.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this assignment', 403);
  }

  await assignment.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Assignment deleted successfully',
    data: {}
  });
});

/**
 * @desc    Get assignments by classroom
 * @route   GET /api/assignments/classroom/:classroomId
 * @access  Private
 */
export const getAssignmentsByClassroom = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.findById(req.params.classroomId);

  if (!classroom) {
    throw new AppError('Classroom not found', 404);
  }

  // Check access
  const hasAccess =
    req.user.role === 'admin' ||
    classroom.faculty.toString() === req.user.id ||
    classroom.students.some(s => s.toString() === req.user.id);

  if (!hasAccess) {
    throw new AppError('You do not have access to this classroom', 403);
  }

  const assignments = await Assignment.find({ 
    classroom: req.params.classroomId,
    isPublished: true
  })
    .populate('faculty', 'name email')
    .sort({ dueDate: 1 });

  res.status(200).json({
    success: true,
    count: assignments.length,
    data: assignments
  });
});
