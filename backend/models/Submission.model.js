import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: [true, 'Assignment is required']
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: [true, 'Classroom is required']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  files: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String,
    fileType: {
      type: String,
      enum: ['report', 'presentation', 'code', 'document', 'other']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  githubLink: {
    type: String,
    trim: true,
    match: [
      /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/,
      'Please provide a valid GitHub repository URL'
    ]
  },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'reviewed', 'accepted', 'rejected', 'resubmit'],
    default: 'submitted'
  },
  marks: {
    type: Number,
    min: 0,
    default: null
  },
  feedback: {
    type: String,
    maxlength: [2000, 'Feedback cannot be more than 2000 characters']
  },
  feedbackFiles: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  isLate: {
    type: Boolean,
    default: false
  },
  version: {
    type: Number,
    default: 1
  },
  previousVersions: [{
    version: Number,
    files: [{
      filename: String,
      originalName: String,
      path: String,
      uploadedAt: Date
    }],
    submittedAt: Date
  }],
  uploadedToRepository: {
    type: Boolean,
    default: false
  },
  repositoryProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository'
  }
}, {
  timestamps: true
});

// Index for faster queries
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });
submissionSchema.index({ classroom: 1, status: 1 });
submissionSchema.index({ student: 1, status: 1 });

// Pre-save middleware to check if submission is late
submissionSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Assignment = mongoose.model('Assignment');
    const assignment = await Assignment.findById(this.assignment);
    
    if (assignment && new Date() > assignment.dueDate) {
      this.isLate = true;
    }
  }
  next();
});

export default mongoose.model('Submission', submissionSchema);
