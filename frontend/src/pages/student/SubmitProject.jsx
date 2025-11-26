import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  Link as LinkIcon, 
  Calendar,
  User,
  BookOpen,
  Save,
  Send,
  ArrowLeft
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import FileUpload from '../../components/ui/FileUpload';
import { useAuth } from '../../hooks/useAuth';

/**
 * Student Project Submission Form - Google Classroom Style
 */
const SubmitProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'project',
    githubLink: '',
    tags: '',
    course: '',
    semester: '',
  });
  
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  /**
   * Handle form input changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle file changes
   */
  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
  };

  /**
   * Save as draft
   */
  const saveDraft = async () => {
    setIsDraft(true);
    setLoading(true);
    
    try {
      // TODO: Save to API
      const draftData = {
        ...formData,
        files,
        status: 'draft',
        studentId: user.id,
        createdAt: new Date(),
      };
      
      // Mock save
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Draft saved:', draftData);
      
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft. Please try again.');
    } finally {
      setLoading(false);
      setIsDraft(false);
    }
  };

  /**
   * Submit project
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        alert('Please enter a project title');
        return;
      }
      
      if (!formData.description.trim()) {
        alert('Please enter a project description');
        return;
      }
      
      if (files.length === 0) {
        alert('Please upload at least one file');
        return;
      }

      // TODO: Submit to API
      const submissionData = {
        ...formData,
        files,
        status: 'pending',
        studentId: user.id,
        studentName: user.name,
        department: user.department,
        submittedAt: new Date(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      // Mock submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Submission data:', submissionData);

      alert('Project submitted successfully!');
      navigate('/student');
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('Error submitting project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/student')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </button>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Submit New Project</h1>
                <p className="text-gray-600">Upload your project files and provide details</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Content Card */}
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Student Info Header */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email} • {user.department}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Project Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Title */}
                <div className="lg:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your project title"
                    required
                  />
                </div>

                {/* Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="inline h-4 w-4 mr-1" />
                    Project Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="project">Project</option>
                    <option value="assignment">Assignment</option>
                    <option value="research">Research Paper</option>
                    <option value="proposal">Proposal</option>
                  </select>
                </div>

                {/* Course */}
                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                    Course
                  </label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., CS 101"
                  />
                </div>

                {/* Semester */}
                <div>
                  <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Semester
                  </label>
                  <input
                    type="text"
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Fall 2024"
                  />
                </div>

                {/* GitHub Link */}
                <div>
                  <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700 mb-2">
                    <LinkIcon className="inline h-4 w-4 mr-1" />
                    GitHub Repository (Optional)
                  </label>
                  <input
                    type="url"
                    id="githubLink"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://github.com/username/repository"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline h-4 w-4 mr-1" />
                  Project Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Describe your project, methodology, objectives, and key findings..."
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Provide a detailed description of your project including objectives, methodology, and key outcomes.
                </p>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Optional)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="machine learning, web development, data analysis (comma separated)"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Add relevant tags to help categorize your project (separate with commas)
                </p>
              </div>
            </div>
          </div>

          {/* File Upload Card */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Project Files *
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Upload your project documents, code files, or research papers
              </p>
            </div>
            
            <div className="p-6">
              <FileUpload
                acceptedTypes={['.pdf', '.docx', '.doc', '.zip', '.rar', '.txt', '.md']}
                maxSize={50 * 1024 * 1024} // 50MB
                multiple={true}
                onFilesChange={handleFilesChange}
                className="border-2 border-dashed border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={saveDraft}
                disabled={loading}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                {isDraft ? 'Saving Draft...' : 'Save Draft'}
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Submitting...' : 'Submit Project'}
              </button>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              <p>* Required fields must be completed before submission</p>
              <p>By submitting, you confirm that this work is your own and complies with academic integrity policies.</p>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default SubmitProject;