import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an assignment title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: [true, 'Classroom is required']
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Faculty is required']
  },
  type: {
    type: String,
    enum: ['assignment', 'project', 'quiz', 'lab', 'presentation'],
    default: 'assignment',
    required: true
  },
  isStructured: {
    type: Boolean,
    default: false // true for project submissions with report/ppt/code
  },
  dueDate: {
    type: Date,
    required: [true, 'Please provide a due date']
  },
  maxMarks: {
    type: Number,
    required: [true, 'Please provide maximum marks'],
    min: [0, 'Marks cannot be negative']
  },
  instructions: {
    type: String,
    maxlength: [5000, 'Instructions cannot be more than 5000 characters']
  },
  attachments: [{
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
  allowLateSubmission: {
    type: Boolean,
    default: false
  },
  lateSubmissionDeadline: {
    type: Date
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  requiredFields: {
    report: { type: Boolean, default: false },
    presentation: { type: Boolean, default: false },
    code: { type: Boolean, default: false },
    githubLink: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Index for faster queries
assignmentSchema.index({ classroom: 1, dueDate: 1 });
assignmentSchema.index({ faculty: 1, isPublished: 1 });

// Virtual for checking if assignment is overdue
assignmentSchema.virtual('isOverdue').get(function() {
  return new Date() > this.dueDate;
});

export default mongoose.model('Assignment', assignmentSchema);
