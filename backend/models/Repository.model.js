import mongoose from 'mongoose';

const repositorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a project title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission',
    required: true
  },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom'
  },
  category: {
    type: String,
    enum: ['Web Development', 'Mobile App', 'Machine Learning', 'Data Science', 'IoT', 'Blockchain', 'Game Development', 'Research', 'Other'],
    required: true
  },
  type: {
    type: String,
    enum: ['Project', 'Research Paper', 'Thesis', 'Capstone', 'Lab Work'],
    default: 'Project',
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  files: {
    report: {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      path: String
    },
    presentation: {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      path: String
    },
    code: {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      path: String
    }
  },
  githubLink: {
    type: String,
    trim: true,
    match: [
      /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/,
      'Please provide a valid GitHub repository URL'
    ]
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
repositorySchema.index({ category: 1, isPublic: 1 });
repositorySchema.index({ academicYear: 1, semester: 1 });
repositorySchema.index({ student: 1 });
repositorySchema.index({ tags: 1 });
repositorySchema.index({ isFeatured: 1, publishedAt: -1 });

export default mongoose.model('Repository', repositorySchema);
