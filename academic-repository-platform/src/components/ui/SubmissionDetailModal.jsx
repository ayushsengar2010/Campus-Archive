import { useState } from 'react';
import {
  X,
  User,
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  History,
  MessageSquare,
  File,
  ChevronDown,
  ChevronUp,
  Upload
} from 'lucide-react';

/**
 * Detailed Submission View Modal with Version Tracking
 * Flow: Assignment -> All Submissions -> Click Student -> Show Full Details
 */
const SubmissionDetailModal = ({ isOpen, onClose, submission, onSubmitDecision }) => {
  const [activeTab, setActiveTab] = useState('current'); // current, versions, history
  const [showVersions, setShowVersions] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [decision, setDecision] = useState('');
  const [revisionType, setRevisionType] = useState(''); // minor or major
  const [uploadToRepository, setUploadToRepository] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !submission) return null;

  // Mock version history
  const versions = submission.versions || [
    {
      version: 3,
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'pending',
      files: [
        { id: '1', name: 'report_v3.pdf', size: '2.5 MB', type: 'pdf' },
        { id: '2', name: 'code_v3.zip', size: '5.1 MB', type: 'zip' },
        { id: '3', name: 'documentation_v3.docx', size: '1.2 MB', type: 'docx' }
      ],
      changes: 'Fixed all major issues. Updated documentation. Improved code structure.',
      feedback: null
    },
    {
      version: 2,
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'resubmit',
      revisionType: 'major',
      files: [
        { id: '1', name: 'report_v2.pdf', size: '2.3 MB', type: 'pdf' },
        { id: '2', name: 'code_v2.zip', size: '4.8 MB', type: 'zip' }
      ],
      changes: 'Addressed critical bugs. Added missing features.',
      feedback: {
        reviewer: 'Dr. John Smith',
        comment: 'Major issues found in implementation. Please fix the bugs mentioned in the inline comments and add proper error handling.',
        reviewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        grade: null,
        score: null
      }
    },
    {
      version: 1,
      submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: 'resubmit',
      revisionType: 'minor',
      files: [
        { id: '1', name: 'report_v1.pdf', size: '2.1 MB', type: 'pdf' },
        { id: '2', name: 'code_v1.zip', size: '4.5 MB', type: 'zip' }
      ],
      changes: 'Initial submission',
      feedback: {
        reviewer: 'Dr. John Smith',
        comment: 'Good start but needs minor improvements in documentation and code comments.',
        reviewedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        grade: null,
        score: null
      }
    }
  ];

  const currentVersion = versions[0];

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'docx':
      case 'doc':
        return '📝';
      case 'zip':
        return '📦';
      case 'xlsx':
        return '📊';
      case 'pptx':
        return '📊';
      default:
        return '📁';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      resubmit: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[status] || colors.pending;
  };

  const getRevisionTypeColor = (type) => {
    return type === 'major'
      ? 'bg-red-100 text-red-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  const formatTimeAgo = (date) => {
    const hours = Math.floor((new Date() - date) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleSubmitDecision = async () => {
    if (!decision) {
      alert('Please select a decision');
      return;
    }

    if (decision === 'resubmit' && !revisionType) {
      alert('Please select revision type (Minor/Major)');
      return;
    }

    if (!feedback.trim()) {
      alert('Please provide feedback');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmitDecision({
        submissionId: submission.id,
        decision,
        revisionType: decision === 'resubmit' ? revisionType : null,
        feedback,
        uploadToRepository: decision === 'approved' && submission.type === 'project' ? uploadToRepository : false,
        reviewedAt: new Date()
      });

      onClose();
    } catch (error) {
      console.error('Error submitting decision:', error);
      alert('Failed to submit decision. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{submission.studentName}</h2>
                <p className="text-blue-100">Student ID: {submission.studentId}</p>
                <p className="text-sm text-blue-100 mt-1">{submission.assignmentTitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:text-black hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <span className={`px-3 py-1 rounded-full font-medium border ${getStatusColor(currentVersion.status)}`}>
              Status: {currentVersion.status}
            </span>
            <span className="px-3 py-1 bg-white text-black bg-opacity-20 rounded-full">
              Version: v{currentVersion.version}
            </span>
            <span className="px-3 py-1 bg-white text-black bg-opacity-20 rounded-full flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatTimeAgo(currentVersion.submittedAt)}
            </span>
            {submission.lateSubmission && (
              <span className="px-3 py-1 bg-red-500 bg-opacity-90 rounded-full font-medium">
                Late Submission
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex space-x-1 px-6">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'current'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Current Submission
            </button>
            <button
              onClick={() => setActiveTab('versions')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'versions'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <History className="h-4 w-4 inline mr-2" />
              Version History ({versions.length})
            </button>
            <button
              onClick={() => setActiveTab('decision')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'decision'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Review & Feedback
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Current Submission Tab */}
          {activeTab === 'current' && (
            <div className="space-y-6">
              {/* Files Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <File className="h-5 w-5 mr-2 text-blue-600" />
                  Submitted Files ({currentVersion.files.length})
                </h3>
                <div className="space-y-3">
                  {currentVersion.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors group"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="text-3xl flex-shrink-0">{getFileIcon(file.type)}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{file.name}</h4>
                          <p className="text-xs text-gray-500">
                            {file.size} • {file.type.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Changes Description */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                  Changes & Notes
                </h3>
                <p className="text-gray-700 leading-relaxed">{currentVersion.changes}</p>
              </div>

              {/* Assignment Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Type</div>
                  <div className="font-semibold text-gray-900 capitalize">{submission.type}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Submitted</div>
                  <div className="font-semibold text-gray-900">
                    {currentVersion.submittedAt.toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Version</div>
                  <div className="font-semibold text-gray-900">v{currentVersion.version}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Files</div>
                  <div className="font-semibold text-gray-900">{currentVersion.files.length}</div>
                </div>
              </div>

              {/* Tags Section */}
              {submission.tags && submission.tags.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {submission.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Version History Tab */}
          {activeTab === 'versions' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <History className="h-4 w-4 inline mr-1" />
                  Showing all {versions.length} versions of this submission
                </p>
              </div>

              {versions.map((version) => (
                <div
                  key={version.version}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-600">v{version.version}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Version {version.version}</h4>
                        <p className="text-sm text-gray-500">
                          Submitted {version.submittedAt.toLocaleDateString()} •{' '}
                          {formatTimeAgo(version.submittedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(version.status)}`}>
                        {version.status}
                      </span>
                      {version.revisionType && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRevisionTypeColor(version.revisionType)}`}>
                          {version.revisionType} revision
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Changes */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{version.changes}</p>
                    </div>

                    {/* Files */}
                    <div>
                      <button
                        onClick={() =>
                          setShowVersions(
                            showVersions === version.version ? null : version.version
                          )
                        }
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        {showVersions === version.version ? (
                          <ChevronUp className="h-4 w-4 mr-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 mr-1" />
                        )}
                        {version.files.length} files
                      </button>

                      {showVersions === version.version && (
                        <div className="mt-2 space-y-2">
                          {version.files.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{getFileIcon(file.type)}</span>
                                <span className="text-sm text-gray-900">{file.name}</span>
                                <span className="text-xs text-gray-500">({file.size})</span>
                              </div>
                              <button className="text-blue-600 hover:text-blue-800">
                                <Download className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Feedback */}
                    {version.feedback && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <MessageSquare className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-gray-900">
                                {version.feedback.reviewer}
                              </p>
                              <p className="text-xs text-gray-500">
                                {version.feedback.reviewedAt.toLocaleDateString()}
                              </p>
                            </div>
                            <p className="text-sm text-gray-700">{version.feedback.comment}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Decision Tab */}
          {activeTab === 'decision' && (
            <div className="space-y-6">
              {/* Decision Selection */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Decision</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="relative flex cursor-pointer">
                    <input
                      type="radio"
                      name="decision"
                      value="approved"
                      checked={decision === 'approved'}
                      onChange={(e) => setDecision(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                        decision === 'approved'
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <CheckCircle
                        className={`h-6 w-6 mb-2 ${decision === 'approved' ? 'text-green-600' : 'text-gray-400'}`}
                      />
                      <p className="font-semibold text-gray-900">Accept</p>
                      <p className="text-sm text-gray-600">Approve this submission</p>
                    </div>
                  </label>

                  <label className="relative flex cursor-pointer">
                    <input
                      type="radio"
                      name="decision"
                      value="resubmit"
                      checked={decision === 'resubmit'}
                      onChange={(e) => setDecision(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                        decision === 'resubmit'
                          ? 'border-orange-600 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <AlertCircle
                        className={`h-6 w-6 mb-2 ${decision === 'resubmit' ? 'text-orange-600' : 'text-gray-400'}`}
                      />
                      <p className="font-semibold text-gray-900">Request Revision</p>
                      <p className="text-sm text-gray-600">Ask for resubmission</p>
                    </div>
                  </label>

                  <label className="relative flex cursor-pointer">
                    <input
                      type="radio"
                      name="decision"
                      value="rejected"
                      checked={decision === 'rejected'}
                      onChange={(e) => setDecision(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                        decision === 'rejected'
                          ? 'border-red-600 bg-red-50'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <XCircle
                        className={`h-6 w-6 mb-2 ${decision === 'rejected' ? 'text-red-600' : 'text-gray-400'}`}
                      />
                      <p className="font-semibold text-gray-900">Reject</p>
                      <p className="text-sm text-gray-600">Decline this submission</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Revision Type (shown only when resubmit is selected) */}
              {decision === 'resubmit' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revision Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="relative flex cursor-pointer">
                      <input
                        type="radio"
                        name="revisionType"
                        value="minor"
                        checked={revisionType === 'minor'}
                        onChange={(e) => setRevisionType(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                          revisionType === 'minor'
                            ? 'border-yellow-600 bg-yellow-50'
                            : 'border-gray-200 hover:border-yellow-300'
                        }`}
                      >
                        <p className="font-semibold text-gray-900">Minor Revision</p>
                        <p className="text-sm text-gray-600">
                          Small fixes needed (typos, formatting, minor improvements)
                        </p>
                      </div>
                    </label>

                    <label className="relative flex cursor-pointer">
                      <input
                        type="radio"
                        name="revisionType"
                        value="major"
                        checked={revisionType === 'major'}
                        onChange={(e) => setRevisionType(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                          revisionType === 'major'
                            ? 'border-red-600 bg-red-50'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                      >
                        <p className="font-semibold text-gray-900">Major Revision</p>
                        <p className="text-sm text-gray-600">
                          Significant changes required (bugs, missing features, major issues)
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Upload to Repository (shown only when approved and assignment type is project) */}
              {decision === 'approved' && submission.type === 'project' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Upload className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={uploadToRepository}
                          onChange={(e) => setUploadToRepository(e.target.checked)}
                          className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                        />
                        <div className="ml-3">
                          <p className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                            Upload to Repository
                          </p>
                          <p className="text-sm text-gray-600">
                            Showcase this exceptional project work in the public repository for all users to see
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback</h3>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide detailed feedback to the student..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {feedback.length} characters • Be specific and constructive
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isSubmitting}
          >
            Close
          </button>

          {activeTab === 'decision' && (
            <button
              onClick={handleSubmitDecision}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Decision
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailModal;
