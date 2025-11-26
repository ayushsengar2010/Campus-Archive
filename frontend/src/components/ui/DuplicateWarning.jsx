import React, { useState } from 'react';
import { AlertTriangle, Info, X, Eye, ExternalLink } from 'lucide-react';

const DuplicateWarning = ({ duplicateResult, onDismiss, onOverride, showDetails = true }) => {
  const [showDetailedView, setShowDetailedView] = useState(false);
  
  if (!duplicateResult?.hasDuplicates) return null;
  
  const { duplicates, highRiskCount, mediumRiskCount, lowRiskCount } = duplicateResult;
  
  const getAlertStyle = () => {
    if (highRiskCount > 0) {
      return {
        container: 'bg-red-50 border-red-200',
        icon: 'text-red-600',
        title: 'text-red-800',
        text: 'text-red-700',
        button: 'bg-red-600 hover:bg-red-700 text-white'
      };
    }
    if (mediumRiskCount > 0) {
      return {
        container: 'bg-yellow-50 border-yellow-200',
        icon: 'text-yellow-600',
        title: 'text-yellow-800',
        text: 'text-yellow-700',
        button: 'bg-yellow-600 hover:bg-yellow-700 text-white'
      };
    }
    return {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-800',
      text: 'text-blue-700',
      button: 'bg-blue-600 hover:bg-blue-700 text-white'
    };
  };
  
  const styles = getAlertStyle();
  const IconComponent = highRiskCount > 0 ? AlertTriangle : Info;
  
  const getSeverityText = (level) => {
    switch (level) {
      case 'high': return 'High Risk';
      case 'medium': return 'Medium Risk';
      case 'low': return 'Low Risk';
      default: return 'Unknown';
    }
  };
  
  const getSeverityColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${styles.container}`}>
      <div className="flex items-start">
        <IconComponent className={`w-5 h-5 mt-0.5 mr-3 ${styles.icon}`} />
        <div className="flex-1">
          <h3 className={`font-medium ${styles.title}`}>
            Potential Duplicate Content Detected
          </h3>
          <div className={`mt-1 text-sm ${styles.text}`}>
            <p>
              Found {duplicates.length} similar submission{duplicates.length > 1 ? 's' : ''}:
              {highRiskCount > 0 && ` ${highRiskCount} high risk`}
              {mediumRiskCount > 0 && ` ${mediumRiskCount} medium risk`}
              {lowRiskCount > 0 && ` ${lowRiskCount} low risk`}
            </p>
            
            {showDetails && (
              <div className="mt-3">
                <button
                  onClick={() => setShowDetailedView(!showDetailedView)}
                  className="text-sm font-medium underline hover:no-underline"
                >
                  {showDetailedView ? 'Hide Details' : 'View Details'}
                </button>
              </div>
            )}
          </div>
          
          {showDetailedView && (
            <div className="mt-4 space-y-3">
              {duplicates.slice(0, 5).map((duplicate, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(duplicate.level)}`}>
                          {getSeverityText(duplicate.level)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {(duplicate.confidence * 100).toFixed(1)}% similarity
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {duplicate.submission.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {duplicate.submission.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        <div>Department: {duplicate.submission.metadata?.department}</div>
                        <div>Submitted: {new Date(duplicate.submission.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="mt-2">
                        <div className="text-xs font-medium text-gray-700 mb-1">Similarity reasons:</div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {duplicate.reasons.map((reason, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-3">
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="View submission"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {duplicate.submission.githubUrl && (
                        <a
                          href={duplicate.submission.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="View GitHub"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {duplicates.length > 5 && (
                <div className="text-center">
                  <span className="text-xs text-gray-500">
                    ... and {duplicates.length - 5} more similar submission{duplicates.length - 5 > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-4 flex items-center space-x-3">
            {highRiskCount > 0 ? (
              <>
                <button
                  onClick={onDismiss}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Review & Edit
                </button>
                <button
                  onClick={onOverride}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${styles.button}`}
                >
                  Submit Anyway
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOverride}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${styles.button}`}
                >
                  Continue Submission
                </button>
                <button
                  onClick={onDismiss}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Review First
                </button>
              </>
            )}
          </div>
        </div>
        
        <button
          onClick={onDismiss}
          className={`ml-3 p-1 rounded-md hover:bg-white hover:bg-opacity-20 ${styles.icon}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DuplicateWarning;