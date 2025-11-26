import User from '../models/User.model.js';
import { asyncHandler, AppError } from '../middleware/error.middleware.js';

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private (Admin)
 */
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const { role, isActive, search, page = 1, limit = 20 } = req.query;

  let query = {};

  // Apply filters
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  // Search by name or email
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const skip = (page - 1) * limit;

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: users
  });
});

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Update user (Admin only)
 * @route   PUT /api/users/:id
 * @access  Private (Admin)
 */
export const updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, role, isActive, department, semester, phone } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Update fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (department) user.department = department;
  if (semester) user.semester = semester;
  if (phone) user.phone = phone;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

/**
 * @desc    Delete user (Admin only)
 * @route   DELETE /api/users/:id
 * @access  Private (Admin)
 */
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Prevent deleting self
  if (user._id.toString() === req.user.id) {
    throw new AppError('You cannot delete your own account', 400);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data: {}
  });
});

/**
 * @desc    Get user statistics (Admin only)
 * @route   GET /api/users/stats/overview
 * @access  Private (Admin)
 */
export const getUserStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  
  const usersByRole = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);

  const recentUsers = await User.find()
    .select('name email role createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      usersByRole: usersByRole.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      recentUsers
    }
  });
});

/**
 * @desc    Deactivate/Activate user (Admin only)
 * @route   PATCH /api/users/:id/status
 * @access  Private (Admin)
 */
export const toggleUserStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Prevent deactivating self
  if (user._id.toString() === req.user.id) {
    throw new AppError('You cannot deactivate your own account', 400);
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    data: user
  });
});

/**
 * @desc    Get students by department
 * @route   GET /api/users/students/by-department
 * @access  Private (Faculty/Admin)
 */
export const getStudentsByDepartment = asyncHandler(async (req, res, next) => {
  const { department } = req.query;

  const query = { role: 'student', isActive: true };
  if (department) {
    query.department = department;
  }

  const students = await User.find(query)
    .select('name email studentId department semester')
    .sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});
