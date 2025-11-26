import { useState } from 'react';
import { X, BookOpen, Users, Calendar, FileText, Save } from 'lucide-react';
import apiService from '../../services/apiService';

/**
 * Modal for creating a new classroom
 */
const CreateClassroomModal = ({ isOpen, onClose, onCreateClassroom }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    subject: '',
    section: '',
    semester: '',
    academicYear: '',
    description: '',
    color: 'bg-blue-600',
    maxStudents: 50,
    enrollmentType: 'manual' // manual or auto
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorOptions = [
    { value: 'bg-blue-600', label: 'Blue', preview: 'bg-blue-600' },
    { value: 'bg-green-600', label: 'Green', preview: 'bg-green-600' },
    { value: 'bg-purple-600', label: 'Purple', preview: 'bg-purple-600' },
    { value: 'bg-orange-600', label: 'Orange', preview: 'bg-orange-600' },
    { value: 'bg-red-600', label: 'Red', preview: 'bg-red-600' },
    { value: 'bg-teal-600', label: 'Teal', preview: 'bg-teal-600' },
    { value: 'bg-indigo-600', label: 'Indigo', preview: 'bg-indigo-600' },
    { value: 'bg-pink-600', label: 'Pink', preview: 'bg-pink-600' }
  ];

  const semesterOptions = [
    'Fall 2024',
    'Spring 2025',
    'Summer 2025',
    'Fall 2025',
    'Spring 2026'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Classroom name is required';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Course code is required';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.section.trim()) {
      newErrors.section = 'Section is required';
    }
    if (!formData.semester) {
      newErrors.semester = 'Semester is required';
    }
    if (!formData.academicYear.trim()) {
      newErrors.academicYear = 'Academic year is required';
    }
    if (formData.maxStudents < 1) {
      newErrors.maxStudents = 'Max students must be at least 1';
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
      // Create classroom via API
      const classroomData = {
        name: formData.name,
        code: formData.code,
        subject: formData.subject,
        section: formData.section,
        semester: formData.semester,
        academicYear: formData.academicYear,
        description: formData.description,
        color: formData.color.replace('bg-', '').replace('-600', ''), // Extract color name
        maxStudents: parseInt(formData.maxStudents),
        enrollmentType: formData.enrollmentType
      };

      const newClassroom = await apiService.createClassroom(classroomData);

      // Call parent callback with new classroom
      await onCreateClassroom(newClassroom);

      // Reset form
      setFormData({
        name: '',
        code: '',
        subject: '',
        section: '',
        semester: '',
        academicYear: '',
        description: '',
        color: 'bg-blue-600',
        maxStudents: 50,
        enrollmentType: 'manual'
      });

      onClose();
    } catch (error) {
      console.error('Error creating classroom:', error);
      alert(error.message || 'Failed to create classroom. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Classroom</h2>
              <p className="text-sm text-gray-600">Set up a new class for the semester</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Classroom Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Classroom Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Advanced Computer Science"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Course Code */}
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g., CS 401"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.code ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Computer Science"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.subject ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
              </div>

              {/* Section */}
              <div>
                <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
                  Section <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="e.g., A, B, C"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.section ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.section && <p className="text-red-500 text-xs mt-1">{errors.section}</p>}
              </div>

              {/* Semester */}
              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.semester ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select Semester</option>
                  {semesterOptions.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
                {errors.semester && <p className="text-red-500 text-xs mt-1">{errors.semester}</p>}
              </div>

              {/* Academic Year */}
              <div>
                <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="academicYear"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  placeholder="e.g., 2024-2025"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.academicYear ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.academicYear && <p className="text-red-500 text-xs mt-1">{errors.academicYear}</p>}
              </div>

              {/* Max Students */}
              <div>
                <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Students
                </label>
                <input
                  type="number"
                  id="maxStudents"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.maxStudents ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.maxStudents && <p className="text-red-500 text-xs mt-1">{errors.maxStudents}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the course..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Appearance
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classroom Color
              </label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={`h-12 rounded-lg ${color.preview} hover:opacity-80 transition-opacity ${
                      formData.color === color.value ? 'ring-4 ring-green-500 ring-offset-2' : ''
                    }`}
                    title={color.label}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Enrollment Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-600" />
              Enrollment Settings
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enrollment Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="enrollmentType"
                    value="manual"
                    checked={formData.enrollmentType === 'manual'}
                    onChange={handleChange}
                    className="text-green-600 focus:ring-green-500"
                    disabled={isSubmitting}
                  />
                  <div>
                    <p className="font-medium text-gray-900">Manual Enrollment</p>
                    <p className="text-sm text-gray-600">You manually add students to the class</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="enrollmentType"
                    value="auto"
                    checked={formData.enrollmentType === 'auto'}
                    onChange={handleChange}
                    className="text-green-600 focus:ring-green-500"
                    disabled={isSubmitting}
                  />
                  <div>
                    <p className="font-medium text-gray-900">Auto Enrollment</p>
                    <p className="text-sm text-gray-600">Students can enroll themselves with a code</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3 bg-gray-50">
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
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Classroom
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateClassroomModal;
