import Classroom from '../models/Classroom.model.js';
import User from '../models/User.model.js';
import { asyncHandler, AppError } from '../middleware/error.middleware.js';
import Notification from '../models/Notification.model.js';

/**
 * @desc    Create new classroom
 * @route   POST /api/classrooms
 * @access  Private (Faculty only)
 */
export const createClassroom = asyncHandler(async (req, res, next) => {
  const { name, code, subject, section, description, semester, academicYear, settings } = req.body;

  // Check if classroom code already exists
  const existingClassroom = await Classroom.findOne({ code });
  if (existingClassroom) {
    throw new AppError('Classroom with this code already exists', 400);
  }

  const classroom = await Classroom.create({
    name,
    code: code.toUpperCase(),
    subject,
    section,
    description,
    faculty: req.user.id,
    semester,
    academicYear,
    settings
  });

  res.status(201).json({
    success: true,
    message: 'Classroom created successfully',
    data: classroom
  });
});

/**
 * @desc    Get all classrooms (based on user role)
 * @route   GET /api/classrooms
 * @access  Private
 */
export const getClassrooms = asyncHandler(async (req, res, next) => {
  let query = {};

  // Faculty sees their classrooms
  if (req.user.role === 'faculty') {
    query.faculty = req.user.id;
  }
  // Students see classrooms they're enrolled in
  else if (req.user.role === 'student') {
    query.students = req.user.id;
  }
  // Admin sees all classrooms
  else if (req.user.role === 'admin') {
    // No filter - show all
  }

  const classrooms = await Classroom.find(query)
    .populate('faculty', 'name email')
    .populate('students', 'name email studentId')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: classrooms.length,
    data: classrooms
  });
});

/**
 * @desc    Get single classroom by ID
 * @route   GET /api/classrooms/:id
 * @access  Private
 */
export const getClassroom = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.findById(req.params.id)
    .populate('faculty', 'name email department')
    .populate('students', 'name email studentId department semester');

  if (!classroom) {
    throw new AppError('Classroom not found', 404);
  }

  // Check if user has access to this classroom
  const hasAccess = 
    req.user.role === 'admin' ||
    classroom.faculty._id.toString() === req.user.id ||
    classroom.students.some(student => student._id.toString() === req.user.id);

  if (!hasAccess) {
    throw new AppError('You do not have access to this classroom', 403);
  }

  res.status(200).json({
    success: true,
    data: classroom
  });
});

/**
 * @desc    Update classroom
 * @route   PUT /api/classrooms/:id
 * @access  Private (Faculty/Admin)
 */
export const updateClassroom = asyncHandler(async (req, res, next) => {
  let classroom = await Classroom.findById(req.params.id);

  if (!classroom) {
    throw new AppError('Classroom not found', 404);
  }

  // Check if user is the faculty or admin
  if (classroom.faculty.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this classroom', 403);
  }

  classroom = await Classroom.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Classroom updated successfully',
    data: classroom
  });
});

/**
 * @desc    Delete classroom
 * @route   DELETE /api/classrooms/:id
 * @access  Private (Faculty/Admin)
 */
export const deleteClassroom = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.findById(req.params.id);

  if (!classroom) {
    throw new AppError('Classroom not found', 404);
  }

  // Check if user is the faculty or admin
  if (classroom.faculty.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this classroom', 403);
  }

  await classroom.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Classroom deleted successfully',
    data: {}
  });
});

/**
 * @desc    Join classroom with code
 * @route   POST /api/classrooms/join
 * @access  Private (Students)
 */
export const joinClassroom = asyncHandler(async (req, res, next) => {
  const { code } = req.body;

  if (!code) {
    throw new AppError('Please provide classroom code', 400);
  }

  const classroom = await Classroom.findOne({ code: code.toUpperCase() });

  if (!classroom) {
    throw new AppError('Classroom not found with this code', 404);
  }

  // Check if student is already enrolled
  if (classroom.students.includes(req.user.id)) {
    throw new AppError('You are already enrolled in this classroom', 400);
  }

  // Add student to classroom
  classroom.students.push(req.user.id);
  await classroom.save();

  // Create notification for faculty
  await Notification.create({
    user: classroom.faculty,
    title: 'New Student Joined',
    message: `${req.user.name} has joined your classroom ${classroom.name}`,
    type: 'info',
    relatedEntity: {
      entityType: 'classroom',
      entityId: classroom._id
    }
  });

  res.status(200).json({
    success: true,
    message: 'Successfully joined classroom',
    data: classroom
  });
});

/**
 * @desc    Leave classroom
 * @route   POST /api/classrooms/:id/leave
 * @access  Private (Students)
 */
export const leaveClassroom = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.findById(req.params.id);

  if (!classroom) {
    throw new AppError('Classroom not found', 404);
  }

  // Check if student is enrolled
  if (!classroom.students.includes(req.user.id)) {
    throw new AppError('You are not enrolled in this classroom', 400);
  }

  // Remove student from classroom
  classroom.students = classroom.students.filter(
    student => student.toString() !== req.user.id
  );
  await classroom.save();

  res.status(200).json({
    success: true,
    message: 'Successfully left classroom',
    data: {}
  });
});

/**
 * @desc    Remove student from classroom
 * @route   DELETE /api/classrooms/:id/students/:studentId
 * @access  Private (Faculty/Admin)
 */
export const removeStudent = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.findById(req.params.id);

  if (!classroom) {
    throw new AppError('Classroom not found', 404);
  }

  // Check if user is the faculty or admin
  if (classroom.faculty.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to remove students', 403);
  }

  // Remove student
  classroom.students = classroom.students.filter(
    student => student.toString() !== req.params.studentId
  );
  await classroom.save();

  res.status(200).json({
    success: true,
    message: 'Student removed successfully',
    data: classroom
  });
});
