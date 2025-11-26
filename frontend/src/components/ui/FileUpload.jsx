import { useState, useRef, useCallback } from 'react';
import { Upload, X, File, FileText, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * File Upload Component with Drag & Drop
 * @param {Object} props - Component props
 * @param {string[]} props.acceptedTypes - Accepted file types (e.g., ['.pdf', '.docx'])
 * @param {number} props.maxSize - Maximum file size in bytes (default: 10MB)
 * @param {boolean} props.multiple - Allow multiple files (default: false)
 * @param {Function} props.onFilesChange - Callback when files change
 * @param {Function} props.onUpload - Callback when upload is triggered
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Disable the component
 */
const FileUpload = ({
  acceptedTypes = ['.pdf', '.docx', '.doc'],
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  onFilesChange,
  onUpload,
  className = '',
  disabled = false,
}) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState([]);
  
  const fileInputRef = useRef(null);

  /**
   * Validate file type and size
   */
  const validateFile = (file) => {
    const errors = [];
    
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      errors.push(`File type ${fileExtension} is not supported. Accepted types: ${acceptedTypes.join(', ')}`);
    }
    
    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      errors.push(`File size exceeds ${maxSizeMB}MB limit`);
    }
    
    return errors;
  };

  /**
   * Process selected files
   */
  const processFiles = useCallback((fileList) => {
    const newFiles = [];
    const newErrors = [];
    
    Array.from(fileList).forEach((file) => {
      const fileErrors = validateFile(file);
      
      if (fileErrors.length === 0) {
        const fileWithId = {
          id: Date.now() + Math.random(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'ready', // ready, uploading, success, error
          progress: 0,
        };
        newFiles.push(fileWithId);
      } else {
        newErrors.push(...fileErrors);
      }
    });
    
    if (!multiple) {
      setFiles(newFiles.slice(0, 1));
    } else {
      setFiles(prev => [...prev, ...newFiles]);
    }
    
    setErrors(newErrors);
    
    if (onFilesChange) {
      onFilesChange(multiple ? [...files, ...newFiles] : newFiles.slice(0, 1));
    }
  }, [acceptedTypes, maxSize, multiple, files, onFilesChange]);

  /**
   * Handle drag events
   */
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  /**
   * Handle drop event
   */
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  }, [disabled, processFiles]);

  /**
   * Handle file input change
   */
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  /**
   * Remove file from list
   */
  const removeFile = (fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  };

  /**
   * Trigger file input click
   */
  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * Handle upload
   */
  const handleUpload = async () => {
    if (!onUpload || files.length === 0) return;
    
    setUploading(true);
    
    try {
      // Update file status to uploading
      setFiles(prev => prev.map(f => ({ ...f, status: 'uploading', progress: 0 })));
      
      // Simulate upload progress (replace with actual upload logic)
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, progress } : f
          ));
        }
        
        // Mark as success
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'success', progress: 100 } : f
        ));
      }
      
      await onUpload(files);
    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(f => ({ ...f, status: 'error' })));
    } finally {
      setUploading(false);
    }
  };

  /**
   * Format file size
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Get file icon
   */
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (extension === 'pdf') {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    return <File className="w-8 h-8 text-blue-500" />;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            {dragActive ? 'Drop files here' : 'Upload files'}
          </p>
          <p className="text-sm text-gray-500">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-xs text-gray-400">
            Supported formats: {acceptedTypes.join(', ')} • Max size: {(maxSize / (1024 * 1024)).toFixed(1)}MB
          </p>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-900">
            Selected Files ({files.length})
          </h4>
          
          <div className="space-y-2">
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md border"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getFileIcon(fileItem.name)}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileItem.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(fileItem.size)}
                    </p>
                    
                    {/* Progress Bar */}
                    {fileItem.status === 'uploading' && (
                      <div className="mt-2">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${fileItem.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Uploading... {fileItem.progress}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Status Icon */}
                  {fileItem.status === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {fileItem.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  
                  {/* Remove Button */}
                  {fileItem.status !== 'uploading' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(fileItem.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          {onUpload && files.some(f => f.status === 'ready') && (
            <button
              onClick={handleUpload}
              disabled={uploading || disabled}
              className="w-full mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? 'Uploading...' : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;