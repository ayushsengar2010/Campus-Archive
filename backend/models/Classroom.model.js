import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a classroom name'],
    trim: true,
    maxlength: [100, 'Classroom name cannot be more than 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Please provide a classroom code'],
    uppercase: true,
    trim: true
  },
  section: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Faculty is required']
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  semester: {
    type: String,
    required: true
  },
  enrollmentType: {
    type: String,
    enum: ['manual', 'auto'],
    default: 'manual'
  },
  maxStudents: {
    type: Number,
    default: 50
  },
  color: {
    type: String,
    default: 'blue'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    allowLateSubmissions: {
      type: Boolean,
      default: false
    },
    maxFileSize: {
      type: Number,
      default: 10485760 // 10MB in bytes
    },
    allowedFileTypes: {
      type: [String],
      default: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip', 'rar']
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
classroomSchema.index({ faculty: 1, isActive: 1 });
classroomSchema.index({ students: 1 });
classroomSchema.index({ code: 1 });

export default mongoose.model('Classroom', classroomSchema);
