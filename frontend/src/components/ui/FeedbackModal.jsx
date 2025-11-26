import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Modal from './Modal';

const FeedbackModal = ({
  isOpen,
  onClose,
  submission,
  onSubmitFeedback,
}) => {
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('accepted');
  const [marks, setMarks] = useState('');
  const [uploadToRepository, setUploadToRepository] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      alert('Please provide feedback before submitting.');
      return;
    }

    if (!marks || marks < 0) {
      alert('Please provide valid marks.');
      return;
    }

    const feedbackData = {
      submissionId: submission.id || submission._id,
      status: status, // 'accepted', 'rejected', or 'resubmit'
      score: parseInt(marks),
      comments: feedback.trim(),
      uploadToRepository: uploadToRepository,
      createdAt: new Date(),
    };

    await onSubmitFeedback(feedbackData);
    setFeedback('');
    setStatus('accepted');
    setMarks('');
    setUploadToRepository(false);
    onClose();
  };

  const statusOptions = [
    { value: 'accepted', label: 'Approve', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    { value: 'rejected', label: 'Reject', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    { value: 'resubmit', label: 'Request Resubmission', icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  ];

  if (!submission) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Provide Feedback - ${submission.title}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-900 mb-2">Submission Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Student:</span>
              <span className="ml-2 font-medium">{submission.studentName}</span>
            </div>
            <div>
              <span className="text-gray-500">Type:</span>
              <span className="ml-2 capitalize">{submission.type}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Decision</label>
          <div className="grid grid-cols-3 gap-3">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              return (
                <label
                  key={option.value}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${
                    status === option.value 
                      ? `${option.border} ${option.bg}` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={status === option.value}
                    onChange={(e) => setStatus(e.target.value)}
                    className="sr-only"
                  />
                  <Icon className={`h-5 w-5 mr-3 ${option.color}`} />
                  <span className={`font-medium ${status === option.value ? option.color : 'text-gray-700'}`}>
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="marks" className="block text-sm font-medium text-gray-700 mb-2">
            Marks / Grade *
          </label>
          <input
            id="marks"
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            min="0"
            max={submission.maxMarks || 100}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Enter marks (Max: ${submission.maxMarks || 100})`}
            required
          />
          <p className="mt-1 text-sm text-gray-500">Maximum marks: {submission.maxMarks || 100}</p>
        </div>

        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
            Feedback Comments *
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Provide detailed feedback for the student..."
            required
          />
        </div>

        {status === 'accepted' && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={uploadToRepository}
                onChange={(e) => setUploadToRepository(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Add this submission to the public repository (showcase excellent work)
              </span>
            </label>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!feedback.trim() || !marks}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FeedbackModal;