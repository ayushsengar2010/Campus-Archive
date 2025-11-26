import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Upload,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Github,
  Link as LinkIcon,
  FileSpreadsheet,
  Presentation
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import apiService from '../../services/apiService';

/**
 * Submit Work Page - For submitting assignments/projects
 */
const SubmitWork = () => {
  const { classId, subjectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data passed from ClassroomDetail
  const { classData, subject, className, subjectName } = location.state || {};
  
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Separate states for project type submissions
  const [reportFile, setReportFile] = useState(null);
  const [pptFile, setPptFile] = useState(null);
  const [codeFile, setCodeFile] = useState(null);
  const [githubLink, setGithubLink] = useState('');
  
  const isProjectType = subject?.type?.toLowerCase() === 'project';

  useEffect(() => {
    // If no state data, redirect back
    if (!classData || !subject) {
      navigate(`/student/classroom/${classId}`);
    }
  }, [classData, subject, classId, navigate]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Handle individual file uploads for project type
  const handleReportUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReportFile(e.target.files[0]);
    }
  };
  
  const handlePptUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPptFile(e.target.files[0]);
    }
  };
  
  const handleCodeUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCodeFile(e.target.files[0]);
    }
  };
  
  const removeReportFile = () => setReportFile(null);
  const removePptFile = () => setPptFile(null);
  const removeCodeFile = () => setCodeFile(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for project type
    if (isProjectType) {
      if (!reportFile) {
        alert('Please upload a project report (PDF/DOC)');
        return;
      }
      if (!pptFile) {
        alert('Please upload a presentation (PPT/PPTX)');
        return;
      }
      if (!codeFile) {
        alert('Please upload your source code (ZIP file)');
        return;
      }
    } else {
      // Validation for regular assignments
      if (files.length === 0) {
        alert('Please select at least one file to submit.');
        return;
      }
    }

    if (!description.trim()) {
      alert('Please provide a description of your submission');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      const assignmentId = subjectId || subject?._id || subject?.id;
      
      // Debug logging
      console.log('Submission data:', {
        assignmentId,
        classId,
        hasDescription: !!description,
        isProjectType,
        files: isProjectType ? { reportFile: !!reportFile, pptFile: !!pptFile, codeFile: !!codeFile } : files.length
      });
      
      if (!assignmentId) {
        throw new Error('Assignment ID is missing');
      }
      
      if (!classId) {
        throw new Error('Classroom ID is missing');
      }
      
      formData.append('assignment', assignmentId);
      formData.append('classroom', classId);
      formData.append('description', description);
      
      if (githubLink) {
        formData.append('githubLink', githubLink);
      }

      // Add files based on submission type
      if (isProjectType) {
        if (reportFile) formData.append('report', reportFile);
        if (pptFile) formData.append('presentation', pptFile);
        if (codeFile) formData.append('code', codeFile);
      } else {
        // Add all files for regular assignments
        files.forEach((fileObj) => {
          formData.append('files', fileObj.file);
        });
      }

      // Submit to backend
      const response = await apiService.createSubmission(formData);
      console.log('Submission successful:', response);
      
      // Show success message
      alert('Work submitted successfully! Your submission has been recorded.');
      
      // Navigate back to classroom detail
      navigate(`/student/classroom/${classId}`);
    } catch (error) {
      console.error('Submission error:', error);
      console.error('Error response:', error.response?.data);
      
      // Show detailed error message
      let errorMessage = 'Failed to submit work. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Validation errors
        const validationErrors = error.response.data.errors
          .map(err => `${err.field}: ${err.message}`)
          .join('\n');
        errorMessage = `Validation failed:\n${validationErrors}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDaysUntilDeadline = (date) => {
    const now = new Date();
    const diffInDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Due today';
    if (diffInDays === 1) return 'Due tomorrow';
    if (diffInDays > 0) return `Due in ${diffInDays} days`;
    return `Overdue`;
  };

  if (!classData || !subject) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Invalid submission</h2>
          <p className="text-gray-600 mt-2">Unable to load submission details.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate(`/student/classroom/${classId}`)}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to {className}
            </button>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit Work</h1>
            <h2 className="text-xl text-gray-700 mb-2">{subjectName}</h2>
            <p className="text-gray-600 mb-4">{subject.description}</p>
            
            <div className="flex items-center space-x-6 text-sm">
              <span className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                {getDaysUntilDeadline(subject.dueDate)}
              </span>
              <span className="flex items-center text-gray-600">
                <FileText className="h-4 w-4 mr-1" />
                Max Marks: {subject.maxMarks}
              </span>
              <span className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                Type: {subject.type}
              </span>
            </div>
          </div>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Conditional File Upload based on Type */}
          {isProjectType ? (
            /* Project Type - Structured Upload */
            <div className="space-y-6">
              {/* Project Report */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center mb-4">
                  <FileText className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Project Report <span className="text-red-500">*</span>
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Upload your project report (PDF or DOC format, max 50MB)
                </p>
                
                {reportFile ? (
                  <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-red-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{reportFile.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(reportFile.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeReportFile}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      id="report-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleReportUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="report-upload"
                      className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 cursor-pointer transition-colors"
                    >
                      <div className="text-center">
                        <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">Click to upload report</p>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX (max 50MB)</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Presentation (PPT) */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center mb-4">
                  <Presentation className="h-5 w-5 text-orange-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Presentation (PPT) <span className="text-red-500">*</span>
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Upload your project presentation (PPT or PPTX format, max 50MB)
                </p>
                
                {pptFile ? (
                  <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Presentation className="h-6 w-6 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{pptFile.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(pptFile.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removePptFile}
                      className="text-orange-500 hover:text-orange-700 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      id="ppt-upload"
                      accept=".ppt,.pptx"
                      onChange={handlePptUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="ppt-upload"
                      className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 cursor-pointer transition-colors"
                    >
                      <div className="text-center">
                        <Presentation className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">Click to upload presentation</p>
                        <p className="text-xs text-gray-500">PPT, PPTX (max 50MB)</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Source Code */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center mb-4">
                  <FileSpreadsheet className="h-5 w-5 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Source Code <span className="text-red-500">*</span>
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Upload your source code as a ZIP file (max 100MB)
                </p>
                
                {codeFile ? (
                  <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileSpreadsheet className="h-6 w-6 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{codeFile.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(codeFile.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCodeFile}
                      className="text-purple-500 hover:text-purple-700 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      id="code-upload"
                      accept=".zip,.rar,.7z"
                      onChange={handleCodeUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="code-upload"
                      className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 cursor-pointer transition-colors"
                    >
                      <div className="text-center">
                        <FileSpreadsheet className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">Click to upload source code</p>
                        <p className="text-xs text-gray-500">ZIP, RAR, 7Z (max 100MB)</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* GitHub Link (Optional) */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center mb-4">
                  <Github className="h-5 w-5 text-gray-900 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    GitHub Repository Link (Optional)
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  If your code is hosted on GitHub, provide the repository URL
                </p>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Regular Assignment - Flexible Upload */
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h3>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Drop files here or click to browse
                </h4>
                <p className="text-gray-600 mb-4">
                  Support for PDF, DOC, DOCX, ZIP, and image files
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.zip,.jpg,.jpeg,.png,.gif"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Choose Files
                </label>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Selected Files</h4>
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any notes or description about your submission..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Submission Guidelines */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 mb-2">Submission Guidelines</h4>
                {isProjectType ? (
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• <strong>Report:</strong> Must include introduction, methodology, results, and conclusion</li>
                    <li>• <strong>Presentation:</strong> Should have 10-15 slides covering key project aspects</li>
                    <li>• <strong>Code:</strong> Include README file with setup instructions</li>
                    <li>• <strong>GitHub (Optional):</strong> Public repository preferred for open-source projects</li>
                    <li>• Maximum file sizes: Report/PPT (50MB), Code (100MB)</li>
                    <li>• Late submissions may result in grade penalties</li>
                  </ul>
                ) : (
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Make sure all files are properly named and organized</li>
                    <li>• Include a README file if submitting code projects</li>
                    <li>• Maximum file size: 50MB per file</li>
                    <li>• Late submissions may result in grade penalties</li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 inline mr-1" />
                {isProjectType 
                  ? 'Ready to submit? Make sure all required files are uploaded.'
                  : 'Ready to submit? Make sure you\'ve reviewed all files.'
                }
              </div>
              <button
                type="submit"
                disabled={isSubmitting || (isProjectType ? (!reportFile || !pptFile || !codeFile) : files.length === 0)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isSubmitting || (isProjectType ? (!reportFile || !pptFile || !codeFile) : files.length === 0)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Work'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default SubmitWork;