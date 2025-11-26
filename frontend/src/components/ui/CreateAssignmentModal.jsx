import { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Calendar,
  Clock,
  Tag,
  Upload,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import apiService from '../../services/apiService';

/**
 * Create/Edit Assignment Modal
 * Allows faculty to create new assignments or edit existing ones
 */
const CreateAssignmentModal = ({ isOpen, onClose, onCreateAssignment, classroomId, editingAssignment = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'assignment', // assignment, project, quiz
    dueDate: '',
    dueTime: '23:59',
    maxMarks: 100,
    tags: '',
    instructions: '',
    allowLateSubmission: true,
    maxFileSize: 10, // MB
    allowedFileTypes: '.pdf,.doc,.docx,.zip,.rar'
  });

  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing an assignment
  useEffect(() => {
    if (editingAssignment && isOpen) {
      const dueDate = new Date(editingAssignment.dueDate);
      const dateStr = dueDate.toISOString().split('T')[0];
      const timeStr = dueDate.toTimeString().substring(0, 5);

      setFormData({
        title: editingAssignment.title || '',
        description: editingAssignment.description || '',
        type: editingAssignment.type || 'assignment',
        dueDate: dateStr,
        dueTime: timeStr,
        maxMarks: editingAssignment.maxMarks || 100,
        tags: Array.isArray(editingAssignment.tags) ? editingAssignment.tags.join(', ') : '',
        instructions: editingAssignment.instructions || '',
        allowLateSubmission: editingAssignment.allowLateSubmission !== false,
        maxFileSize: editingAssignment.maxFileSize || 10,
        allowedFileTypes: editingAssignment.allowedFileTypes || '.pdf,.doc,.docx,.zip,.rar'
      });
      setAttachments([]);
    } else if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        title: '',
        description: '',
        type: 'assignment',
        dueDate: '',
        dueTime: '23:59',
        maxMarks: 100,
        tags: '',
        instructions: '',
        allowLateSubmission: true,
        maxFileSize: 10,
        allowedFileTypes: '.pdf,.doc,.docx,.zip,.rar'
      });
      setAttachments([]);
      setErrors({});
    }
  }, [editingAssignment, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate + ' ' + formData.dueTime);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.dueDate = 'Due date must be in the future';
      }
    }

    if (!formData.maxMarks || formData.maxMarks <= 0) {
      newErrors.maxMarks = 'Maximum marks must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Combine date and time into ISO string
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);

      const assignmentData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        classroom: classroomId,
        dueDate: dueDateTime.toISOString(),
        maxMarks: parseInt(formData.maxMarks),
        tags: tagsArray,
        instructions: formData.instructions,
        allowLateSubmission: formData.allowLateSubmission,
        maxFileSize: parseInt(formData.maxFileSize),
        allowedFileTypes: formData.allowedFileTypes
      };

      let resultAssignment;
      if (editingAssignment) {
        // Update existing assignment with or without files
        console.log('Updating assignment:', editingAssignment._id || editingAssignment.id, 'with attachments:', attachments.length);
        if (attachments.length > 0) {
          console.log('Files to upload:', attachments.map(f => ({ name: f.name, size: f.size, type: f.type })));
          resultAssignment = await apiService.updateAssignmentWithFiles(editingAssignment._id || editingAssignment.id, assignmentData, attachments);
        } else {
          resultAssignment = await apiService.updateAssignment(editingAssignment._id || editingAssignment.id, assignmentData);
        }
      } else {
        // Create new assignment with files
        console.log('Creating assignment with attachments:', attachments.length);
        if (attachments.length > 0) {
          console.log('Files to upload:', attachments.map(f => ({ name: f.name, size: f.size, type: f.type })));
          resultAssignment = await apiService.createAssignmentWithFiles(assignmentData, attachments);
        } else {
          console.log('No attachments, creating without files');
          resultAssignment = await apiService.createAssignment(assignmentData);
        }
      }
      
      console.log('Assignment result:', resultAssignment);
      
      // Call the callback with the assignment from backend
      await onCreateAssignment(resultAssignment);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'assignment',
        dueDate: '',
        dueTime: '23:59',
        maxMarks: 100,
        tags: '',
        instructions: '',
        allowLateSubmission: true,
        maxFileSize: 10,
        allowedFileTypes: '.pdf,.doc,.docx,.zip,.rar'
      });
      setAttachments([]);
      setErrors({});

      onClose();
    } catch (error) {
      console.error(`Error ${editingAssignment ? 'updating' : 'creating'} assignment:`, error);
      setErrors({ submit: `Failed to ${editingAssignment ? 'update' : 'create'} assignment. Please try again.` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'project':
        return <BookOpen className="h-5 w-5" />;
      case 'quiz':
        return <Clock className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white text-black bg-opacity-20 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}</h2>
                <p className="text-sm text-green-100">{editingAssignment ? 'Update assignment details' : 'Fill in the details to create an assignment'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{errors.submit}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Database Design Assignment"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="relative flex cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="assignment"
                        checked={formData.type === 'assignment'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                          formData.type === 'assignment'
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <FileText className={`h-6 w-6 mb-2 ${formData.type === 'assignment' ? 'text-green-600' : 'text-gray-400'}`} />
                          <p className="font-semibold text-gray-900">Assignment</p>
                        </div>
                      </div>
                    </label>

                    <label className="relative flex cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="project"
                        checked={formData.type === 'project'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                          formData.type === 'project'
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <BookOpen className={`h-6 w-6 mb-2 ${formData.type === 'project' ? 'text-green-600' : 'text-gray-400'}`} />
                          <p className="font-semibold text-gray-900">Project</p>
                        </div>
                      </div>
                    </label>

                    <label className="relative flex cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="quiz"
                        checked={formData.type === 'quiz'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                          formData.type === 'quiz'
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <Clock className={`h-6 w-6 mb-2 ${formData.type === 'quiz' ? 'text-green-600' : 'text-gray-400'}`} />
                          <p className="font-semibold text-gray-900">Quiz</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide a brief description of the assignment..."
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Schedule & Points */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule & Points</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      min={getMinDate()}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.dueDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.dueDate && (
                    <p className="text-sm text-red-600 mt-1">{errors.dueDate}</p>
                  )}
                </div>

                {/* Due Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="time"
                      name="dueTime"
                      value={formData.dueTime}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Maximum Marks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Marks <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="maxMarks"
                    value={formData.maxMarks}
                    onChange={handleChange}
                    min="1"
                    placeholder="100"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.maxMarks ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.maxMarks && (
                    <p className="text-sm text-red-600 mt-1">{errors.maxMarks}</p>
                  )}
                </div>

                {/* Max File Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max File Size (MB)
                  </label>
                  <input
                    type="number"
                    name="maxFileSize"
                    value={formData.maxFileSize}
                    onChange={handleChange}
                    min="1"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
              
              <div className="space-y-4">
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="e.g., Database, SQL, Design Patterns"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Detailed Instructions
                  </label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    placeholder="Provide detailed instructions, requirements, and guidelines..."
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Allowed File Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allowed File Types
                  </label>
                  <input
                    type="text"
                    name="allowedFileTypes"
                    value={formData.allowedFileTypes}
                    onChange={handleChange}
                    placeholder=".pdf,.doc,.docx,.zip"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">File extensions separated by commas</p>
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-sm text-blue-600 hover:text-blue-800">
                        Click to upload files
                      </span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,.7z,.jpg,.jpeg,.png,.gif,.txt,.md,.csv,.xlsx,.xls"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload reference materials, templates, or guidelines
                    </p>
                  </div>

                  {/* Attachment List */}
                  {attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Allow Late Submission */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="allowLateSubmission"
                    id="allowLateSubmission"
                    checked={formData.allowLateSubmission}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="allowLateSubmission" className="ml-2 text-sm text-gray-700">
                    Allow late submissions
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignmentModal;
