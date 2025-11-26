import Repository from '../models/Repository.model.js';
import { asyncHandler, AppError } from '../middleware/error.middleware.js';

/**
 * @desc    Get all public repository projects
 * @route   GET /api/repository
 * @access  Public/Private
 */
export const getRepositoryProjects = asyncHandler(async (req, res, next) => {
  const {
    category,
    type,
    academicYear,
    semester,
    search,
    sort = '-publishedAt',
    page = 1,
    limit = 12
  } = req.query;

  let query = { isPublic: true };

  // Apply filters
  if (category) query.category = category;
  if (type) query.type = type;
  if (academicYear) query.academicYear = academicYear;
  if (semester) query.semester = semester;

  // Search in title, description, tags
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const skip = (page - 1) * limit;

  const projects = await Repository.find(query)
    .populate('student', 'name email studentId')
    .populate('faculty', 'name email')
    .populate('classroom', 'name subject')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Repository.countDocuments(query);

  res.status(200).json({
    success: true,
    count: projects.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: projects
  });
});

/**
 * @desc    Get single repository project
 * @route   GET /api/repository/:id
 * @access  Public/Private
 */
export const getRepositoryProject = asyncHandler(async (req, res, next) => {
  const project = await Repository.findById(req.params.id)
    .populate('student', 'name email studentId department')
    .populate('faculty', 'name email department')
    .populate('classroom', 'name subject section')
    .populate('submission');

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Increment view count
  project.views += 1;
  await project.save();

  res.status(200).json({
    success: true,
    data: project
  });
});

/**
 * @desc    Create repository project (manual upload by researcher/admin)
 * @route   POST /api/repository
 * @access  Private (Researcher/Admin)
 */
export const createRepositoryProject = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    category,
    type,
    academicYear,
    semester,
    githubLink,
    tags
  } = req.body;

  // Handle uploaded files
  let files = {};
  if (req.files) {
    if (req.files.report) {
      files.report = {
        filename: req.files.report[0].filename,
        originalName: req.files.report[0].originalname,
        mimetype: req.files.report[0].mimetype,
        size: req.files.report[0].size,
        path: req.files.report[0].path
      };
    }
    if (req.files.presentation) {
      files.presentation = {
        filename: req.files.presentation[0].filename,
        originalName: req.files.presentation[0].originalname,
        mimetype: req.files.presentation[0].mimetype,
        size: req.files.presentation[0].size,
        path: req.files.presentation[0].path
      };
    }
    if (req.files.code) {
      files.code = {
        filename: req.files.code[0].filename,
        originalName: req.files.code[0].originalname,
        mimetype: req.files.code[0].mimetype,
        size: req.files.code[0].size,
        path: req.files.code[0].path
      };
    }
  }

  const project = await Repository.create({
    title,
    description,
    student: req.body.student || req.user.id,
    faculty: req.user.id,
    submission: req.body.submission, // Optional
    classroom: req.body.classroom, // Optional
    category,
    type,
    academicYear,
    semester,
    files,
    githubLink,
    tags: tags || [],
    isPublic: true
  });

  res.status(201).json({
    success: true,
    message: 'Project added to repository successfully',
    data: project
  });
});

/**
 * @desc    Update repository project
 * @route   PUT /api/repository/:id
 * @access  Private (Faculty/Admin/Owner)
 */
export const updateRepositoryProject = asyncHandler(async (req, res, next) => {
  let project = await Repository.findById(req.params.id);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Check authorization
  const isAuthorized =
    req.user.role === 'admin' ||
    project.faculty.toString() === req.user.id ||
    project.student.toString() === req.user.id;

  if (!isAuthorized) {
    throw new AppError('Not authorized to update this project', 403);
  }

  project = await Repository.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    data: project
  });
});

/**
 * @desc    Delete repository project
 * @route   DELETE /api/repository/:id
 * @access  Private (Admin/Faculty)
 */
export const deleteRepositoryProject = asyncHandler(async (req, res, next) => {
  const project = await Repository.findById(req.params.id);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Check authorization
  const isAuthorized =
    req.user.role === 'admin' ||
    project.faculty.toString() === req.user.id;

  if (!isAuthorized) {
    throw new AppError('Not authorized to delete this project', 403);
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully',
    data: {}
  });
});

/**
 * @desc    Toggle bookmark for project
 * @route   POST /api/repository/:id/bookmark
 * @access  Private
 */
export const toggleBookmark = asyncHandler(async (req, res, next) => {
  const project = await Repository.findById(req.params.id);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  const bookmarkIndex = project.bookmarks.indexOf(req.user.id);

  if (bookmarkIndex > -1) {
    // Remove bookmark
    project.bookmarks.splice(bookmarkIndex, 1);
  } else {
    // Add bookmark
    project.bookmarks.push(req.user.id);
  }

  await project.save();

  res.status(200).json({
    success: true,
    message: bookmarkIndex > -1 ? 'Bookmark removed' : 'Bookmark added',
    data: { isBookmarked: bookmarkIndex === -1 }
  });
});

/**
 * @desc    Get user's bookmarked projects
 * @route   GET /api/repository/bookmarks/my
 * @access  Private
 */
export const getMyBookmarks = asyncHandler(async (req, res, next) => {
  const projects = await Repository.find({
    bookmarks: req.user.id,
    isPublic: true
  })
    .populate('student', 'name email')
    .populate('faculty', 'name email')
    .sort({ publishedAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

/**
 * @desc    Increment download count
 * @route   POST /api/repository/:id/download
 * @access  Public/Private
 */
export const incrementDownload = asyncHandler(async (req, res, next) => {
  const project = await Repository.findById(req.params.id);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  project.downloads += 1;
  await project.save();

  res.status(200).json({
    success: true,
    message: 'Download recorded',
    data: { downloads: project.downloads }
  });
});

/**
 * @desc    Get featured projects
 * @route   GET /api/repository/featured
 * @access  Public
 */
export const getFeaturedProjects = asyncHandler(async (req, res, next) => {
  const projects = await Repository.find({
    isFeatured: true,
    isPublic: true
  })
    .populate('student', 'name email')
    .populate('faculty', 'name email')
    .sort({ publishedAt: -1 })
    .limit(6);

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});
