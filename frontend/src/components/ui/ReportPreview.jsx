import { useState, useEffect } from 'react';
import { Eye, Download, RefreshCw, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { ReportService } from '../../services/reportService';

const ReportPreview = ({ reportType, parameters, onClose }) => {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    generatePreview();
  }, [reportType, parameters]);

  const generatePreview = async () => {
    setLoading(true);
    try {
      // Generate mock data for preview
      const mockData = ReportService.generateMockData(reportType, parameters);
      setPreviewData(mockData);
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSubmissionsPreview = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {previewData?.slice(0, 10).map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.studentName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.department}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  item.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.submissionDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderFacultyPreview = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviews</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Time</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {previewData?.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.facultyName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.department}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.totalReviews}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.approved}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.avgReviewTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderDepartmentsPreview = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rejected</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Rate</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {previewData?.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.department}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.totalSubmissions}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.approved}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.rejected}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.approvalRate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSystemPreview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {previewData?.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{item.metric}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
            <div className={`flex items-center text-sm ${
              item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              {item.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderChartPreview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <BarChart3 className="h-5 w-5 text-indigo-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Submissions by Status</h3>
        </div>
        <div className="h-48 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">Chart visualization would appear here</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <PieChart className="h-5 w-5 text-indigo-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Department Distribution</h3>
        </div>
        <div className="h-48 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">Pie chart would appear here</p>
        </div>
      </div>
    </div>
  );

  const renderPreviewContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="ml-2 text-gray-600">Generating preview...</span>
        </div>
      );
    }

    if (viewMode === 'charts' && parameters.includeCharts) {
      return renderChartPreview();
    }

    switch (reportType) {
      case 'submissions':
        return renderSubmissionsPreview();
      case 'faculty':
        return renderFacultyPreview();
      case 'departments':
        return renderDepartmentsPreview();
      case 'system':
        return renderSystemPreview();
      default:
        return <div className="text-center text-gray-500">No preview available for this report type</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Report Preview</h2>
            <p className="text-sm text-gray-600">
              {ReportService.getReportTypeLabel(reportType)} - {ReportService.getDateRangeLabel(parameters.dateRange)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {parameters.includeCharts && (
              <div className="flex bg-gray-100 rounded-md p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 text-sm rounded ${
                    viewMode === 'table' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('charts')}
                  className={`px-3 py-1 text-sm rounded ${
                    viewMode === 'charts' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
                  }`}
                >
                  Charts
                </button>
              </div>
            )}
            <button
              onClick={generatePreview}
              className="p-2 text-gray-600 hover:text-gray-900"
              title="Refresh Preview"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {renderPreviewContent()}
        </div>

        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Preview shows sample data. Actual report will contain real institutional data.
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => {
                // This would trigger the actual report generation
                onClose();
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Download className="h-4 w-4 mr-2 inline" />
              Generate Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;