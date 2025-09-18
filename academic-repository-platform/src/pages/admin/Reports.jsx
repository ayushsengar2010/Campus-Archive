import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Filter, 
  FileText, 
  Mail, 
  Clock, 
  Users, 
  TrendingUp,
  PieChart,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Settings,
  Eye,
  CheckCircle,
  AlertTriangle,
  Save,
  X
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import DataTable from '../../components/ui/DataTable';
import DashboardCard from '../../components/ui/DashboardCard';
import Modal from '../../components/ui/Modal';
import ReportPreview from '../../components/ui/ReportPreview';
import ReportTemplateEditor from '../../components/ui/ReportTemplateEditor';
import { ReportService, EmailService, SchedulerService } from '../../services/reportService';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [reportParameters, setReportParameters] = useState({
    type: 'submissions',
    dateRange: 'last30days',
    startDate: '',
    endDate: '',
    departments: [],
    format: 'csv',
    includeCharts: false
  });

  // Mock data for demonstration
  const [reportTemplates, setReportTemplates] = useState([
    {
      id: 1,
      name: 'Monthly Submission Report',
      description: 'Comprehensive monthly overview of all submissions',
      type: 'submissions',
      parameters: { dateRange: 'lastMonth', departments: 'all', format: 'pdf' },
      createdBy: 'Admin',
      createdAt: '2024-01-15',
      lastUsed: '2024-02-01'
    },
    {
      id: 2,
      name: 'Faculty Performance Report',
      description: 'Review statistics and performance metrics by faculty',
      type: 'faculty',
      parameters: { dateRange: 'lastQuarter', format: 'csv' },
      createdBy: 'Admin',
      createdAt: '2024-01-10',
      lastUsed: '2024-01-28'
    },
    {
      id: 3,
      name: 'Department Analytics',
      description: 'Department-wise submission and approval statistics',
      type: 'departments',
      parameters: { dateRange: 'lastYear', format: 'pdf', includeCharts: true },
      createdBy: 'Admin',
      createdAt: '2024-01-05',
      lastUsed: '2024-01-25'
    }
  ]);

  const [scheduledReports, setScheduledReports] = useState([
    {
      id: 1,
      name: 'Weekly Summary',
      template: 'Monthly Submission Report',
      frequency: 'weekly',
      nextRun: '2024-02-05',
      recipients: ['dean@university.edu', 'admin@university.edu'],
      status: 'active',
      lastRun: '2024-01-29'
    },
    {
      id: 2,
      name: 'Monthly Faculty Report',
      template: 'Faculty Performance Report',
      frequency: 'monthly',
      nextRun: '2024-03-01',
      recipients: ['hr@university.edu'],
      status: 'active',
      lastRun: '2024-02-01'
    }
  ]);

  const [generatedReports, setGeneratedReports] = useState([
    {
      id: 1,
      name: 'January 2024 Submissions',
      type: 'submissions',
      format: 'pdf',
      size: '2.4 MB',
      generatedAt: '2024-02-01 10:30',
      generatedBy: 'Admin',
      downloadUrl: '#'
    },
    {
      id: 2,
      name: 'Q4 2023 Faculty Analytics',
      type: 'faculty',
      format: 'csv',
      size: '856 KB',
      generatedAt: '2024-01-15 14:22',
      generatedBy: 'Admin',
      downloadUrl: '#'
    }
  ]);

  const departments = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
    'Literature',
    'History'
  ];

  const reportTypes = [
    { value: 'submissions', label: 'Submission Reports', description: 'Student submissions and status analytics' },
    { value: 'faculty', label: 'Faculty Reports', description: 'Faculty performance and review statistics' },
    { value: 'departments', label: 'Department Reports', description: 'Department-wise analytics and comparisons' },
    { value: 'system', label: 'System Reports', description: 'Platform usage and system metrics' },
    { value: 'custom', label: 'Custom Reports', description: 'Build custom reports with specific parameters' }
  ];

  const handleGenerateReport = async () => {
    try {
      // Generate mock data based on report type and parameters
      const mockData = ReportService.generateMockData(reportParameters.type, reportParameters);
      
      const reportName = `${reportTypes.find(t => t.value === reportParameters.type)?.label} - ${new Date().toLocaleDateString()}`;
      const filename = `${reportName.replace(/[^a-zA-Z0-9]/g, '_')}.${reportParameters.format}`;
      
      let fileSize;
      
      if (reportParameters.format === 'csv') {
        const csvContent = ReportService.generateCSVReport(mockData, reportParameters.type, reportParameters);
        ReportService.downloadCSV(csvContent, filename);
        fileSize = `${Math.floor(csvContent.length / 1024)} KB`;
      } else {
        const pdfDoc = ReportService.generatePDFReport(mockData, reportParameters.type, reportParameters);
        ReportService.downloadPDF(pdfDoc, filename);
        fileSize = `${(Math.random() * 2 + 1).toFixed(1)} MB`;
      }

      // Add to report history
      const newReport = {
        id: generatedReports.length + 1,
        name: reportName,
        type: reportParameters.type,
        format: reportParameters.format,
        size: fileSize,
        generatedAt: new Date().toLocaleString(),
        generatedBy: 'Admin',
        downloadUrl: '#'
      };
      
      setGeneratedReports([newReport, ...generatedReports]);
      setShowReportModal(false);
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    }
  };

  const downloadCSV = (report) => {
    const mockData = ReportService.generateMockData(report.type, reportParameters);
    const csvContent = ReportService.generateCSVReport(mockData, report.type, reportParameters);
    const filename = `${report.name.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
    ReportService.downloadCSV(csvContent, filename);
  };

  const downloadPDF = (report) => {
    const mockData = ReportService.generateMockData(report.type, reportParameters);
    const pdfDoc = ReportService.generatePDFReport(mockData, report.type, reportParameters);
    const filename = `${report.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    ReportService.downloadPDF(pdfDoc, filename);
  };

  const handleSaveTemplate = (templateData) => {
    const newTemplate = {
      id: reportTemplates.length + 1,
      ...templateData,
      createdBy: 'Admin',
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: null
    };
    setReportTemplates([...reportTemplates, newTemplate]);
    setShowTemplateModal(false);
  };

  const handleScheduleReport = async (scheduleData) => {
    try {
      const newSchedule = {
        id: scheduledReports.length + 1,
        ...scheduleData,
        status: 'active',
        lastRun: null
      };

      // Schedule the report using the scheduler service
      const result = SchedulerService.scheduleReport(newSchedule);
      
      if (result.success) {
        setScheduledReports([...scheduledReports, newSchedule]);
        setShowScheduleModal(false);
        
        // Show success message
        alert(`Report scheduled successfully! Next run: ${new Date(scheduleData.nextRun).toLocaleString()}`);
      }
    } catch (error) {
      console.error('Error scheduling report:', error);
      alert('Error scheduling report. Please try again.');
    }
  };

  const toggleScheduleStatus = (id) => {
    const report = scheduledReports.find(r => r.id === id);
    if (report) {
      if (report.status === 'active') {
        SchedulerService.pauseSchedule(id);
      } else {
        SchedulerService.resumeSchedule(id);
      }
      
      setScheduledReports(scheduledReports.map(report => 
        report.id === id 
          ? { ...report, status: report.status === 'active' ? 'paused' : 'active' }
          : report
      ));
    }
  };

  const deleteScheduledReport = (id) => {
    if (confirm('Are you sure you want to delete this scheduled report?')) {
      SchedulerService.deleteSchedule(id);
      setScheduledReports(scheduledReports.filter(report => report.id !== id));
    }
  };

  const ReportGenerationForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
        <select
          value={reportParameters.type}
          onChange={(e) => setReportParameters({...reportParameters, type: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {reportTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
        <select
          value={reportParameters.dateRange}
          onChange={(e) => setReportParameters({...reportParameters, dateRange: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="lastQuarter">Last Quarter</option>
          <option value="lastYear">Last Year</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {reportParameters.dateRange === 'custom' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={reportParameters.startDate}
              onChange={(e) => setReportParameters({...reportParameters, startDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={reportParameters.endDate}
              onChange={(e) => setReportParameters({...reportParameters, endDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
        <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={reportParameters.departments.length === 0}
              onChange={(e) => setReportParameters({
                ...reportParameters, 
                departments: e.target.checked ? [] : departments
              })}
              className="mr-2"
            />
            All Departments
          </label>
          {departments.map(dept => (
            <label key={dept} className="flex items-center mb-1">
              <input
                type="checkbox"
                checked={reportParameters.departments.includes(dept)}
                onChange={(e) => {
                  const newDepts = e.target.checked
                    ? [...reportParameters.departments, dept]
                    : reportParameters.departments.filter(d => d !== dept);
                  setReportParameters({...reportParameters, departments: newDepts});
                }}
                className="mr-2"
              />
              {dept}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="csv"
              checked={reportParameters.format === 'csv'}
              onChange={(e) => setReportParameters({...reportParameters, format: e.target.value})}
              className="mr-2"
            />
            CSV
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="pdf"
              checked={reportParameters.format === 'pdf'}
              onChange={(e) => setReportParameters({...reportParameters, format: e.target.value})}
              className="mr-2"
            />
            PDF
          </label>
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={reportParameters.includeCharts}
            onChange={(e) => setReportParameters({...reportParameters, includeCharts: e.target.checked})}
            className="mr-2"
          />
          Include Charts and Visualizations
        </label>
      </div>
    </div>
  );

  const TemplateForm = () => {
    const [templateData, setTemplateData] = useState({
      name: '',
      description: '',
      type: 'submissions',
      parameters: reportParameters
    });

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
          <input
            type="text"
            value={templateData.name}
            onChange={(e) => setTemplateData({...templateData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter template name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={templateData.description}
            onChange={(e) => setTemplateData({...templateData, description: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="3"
            placeholder="Describe this template"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowTemplateModal(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSaveTemplate(templateData)}
            disabled={!templateData.name}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            Save Template
          </button>
        </div>
      </div>
    );
  };

  const ScheduleForm = () => {
    const [scheduleData, setScheduleData] = useState({
      name: '',
      template: reportTemplates[0]?.name || '',
      frequency: 'weekly',
      nextRun: '',
      recipients: ['']
    });

    const addRecipient = () => {
      setScheduleData({
        ...scheduleData,
        recipients: [...scheduleData.recipients, '']
      });
    };

    const updateRecipient = (index, value) => {
      const newRecipients = [...scheduleData.recipients];
      newRecipients[index] = value;
      setScheduleData({...scheduleData, recipients: newRecipients});
    };

    const removeRecipient = (index) => {
      setScheduleData({
        ...scheduleData,
        recipients: scheduleData.recipients.filter((_, i) => i !== index)
      });
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Name</label>
          <input
            type="text"
            value={scheduleData.name}
            onChange={(e) => setScheduleData({...scheduleData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter schedule name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Report Template</label>
          <select
            value={scheduleData.template}
            onChange={(e) => setScheduleData({...scheduleData, template: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {reportTemplates.map(template => (
              <option key={template.id} value={template.name}>{template.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
          <select
            value={scheduleData.frequency}
            onChange={(e) => setScheduleData({...scheduleData, frequency: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Next Run Date</label>
          <input
            type="datetime-local"
            value={scheduleData.nextRun}
            onChange={(e) => setScheduleData({...scheduleData, nextRun: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Recipients</label>
          {scheduleData.recipients.map((recipient, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="email"
                value={recipient}
                onChange={(e) => updateRecipient(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter email address"
              />
              <button
                onClick={() => removeRecipient(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-r-md hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addRecipient}
            className="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            + Add Recipient
          </button>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowScheduleModal(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleScheduleReport(scheduleData)}
            disabled={!scheduleData.name || !scheduleData.recipients.some(r => r)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            Schedule Report
          </button>
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate, schedule, and manage institutional reports</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <DashboardCard
            title="Generated Reports"
            value={generatedReports.length}
            icon={<FileText className="h-6 w-6" />}
            color="primary"
          />
          <DashboardCard
            title="Report Templates"
            value={reportTemplates.length}
            icon={<Settings className="h-6 w-6" />}
            color="success"
          />
          <DashboardCard
            title="Scheduled Reports"
            value={scheduledReports.filter(r => r.status === 'active').length}
            icon={<Clock className="h-6 w-6" />}
            color="warning"
          />
          <DashboardCard
            title="Total Downloads"
            value="1,247"
            icon={<Download className="h-6 w-6" />}
            color="primary"
          />
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'generate', label: 'Generate Reports', icon: BarChart3 },
              { id: 'templates', label: 'Templates', icon: FileText },
              { id: 'scheduled', label: 'Scheduled Reports', icon: Clock },
              { id: 'history', label: 'Report History', icon: RefreshCw }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'generate' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Generate New Report</h2>
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportTypes.map(type => (
                <div key={type.value} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <BarChart3 className="h-8 w-8 text-indigo-600 mr-3" />
                    <h3 className="text-lg font-medium text-gray-900">{type.label}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <button
                    onClick={() => {
                      setReportParameters({...reportParameters, type: type.value});
                      setShowReportModal(true);
                    }}
                    className="w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
                  >
                    Generate Report
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Report Templates</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingTemplate(null);
                    setShowTemplateEditor(true);
                  }}
                  className="flex items-center px-4 py-2 text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Editor
                </button>
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Template
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <DataTable
                data={reportTemplates}
                columns={[
                  {
                    header: 'Template Name',
                    accessorKey: 'name',
                    cell: ({ row }) => (
                      <div>
                        <div className="font-medium text-gray-900">{row.original.name}</div>
                        <div className="text-sm text-gray-500">{row.original.description}</div>
                      </div>
                    )
                  },
                  {
                    header: 'Type',
                    accessorKey: 'type',
                    cell: ({ row }) => (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {row.original.type}
                      </span>
                    )
                  },
                  {
                    header: 'Created',
                    accessorKey: 'createdAt'
                  },
                  {
                    header: 'Last Used',
                    accessorKey: 'lastUsed',
                    cell: ({ row }) => row.original.lastUsed || 'Never'
                  },
                  {
                    header: 'Actions',
                    cell: ({ row }) => (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setReportParameters(row.original.parameters);
                            setShowReportModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingTemplate(row.original);
                            setShowTemplateEditor(true);
                          }}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  }
                ]}
              />
            </div>
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Scheduled Reports</h2>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule Report
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <DataTable
                data={scheduledReports}
                columns={[
                  {
                    header: 'Schedule Name',
                    accessorKey: 'name',
                    cell: ({ row }) => (
                      <div>
                        <div className="font-medium text-gray-900">{row.original.name}</div>
                        <div className="text-sm text-gray-500">Template: {row.original.template}</div>
                      </div>
                    )
                  },
                  {
                    header: 'Frequency',
                    accessorKey: 'frequency',
                    cell: ({ row }) => (
                      <span className="capitalize">{row.original.frequency}</span>
                    )
                  },
                  {
                    header: 'Next Run',
                    accessorKey: 'nextRun'
                  },
                  {
                    header: 'Recipients',
                    cell: ({ row }) => (
                      <div className="text-sm">
                        {row.original.recipients.length} recipient{row.original.recipients.length !== 1 ? 's' : ''}
                      </div>
                    )
                  },
                  {
                    header: 'Status',
                    accessorKey: 'status',
                    cell: ({ row }) => (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.original.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {row.original.status === 'active' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Pause className="h-3 w-3 mr-1" />
                        )}
                        {row.original.status}
                      </span>
                    )
                  },
                  {
                    header: 'Actions',
                    cell: ({ row }) => (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleScheduleStatus(row.original.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {row.original.status === 'active' ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteScheduledReport(row.original.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  }
                ]}
              />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Report History</h2>
              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
                <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <DataTable
                data={generatedReports}
                columns={[
                  {
                    header: 'Report Name',
                    accessorKey: 'name',
                    cell: ({ row }) => (
                      <div>
                        <div className="font-medium text-gray-900">{row.original.name}</div>
                        <div className="text-sm text-gray-500">Type: {row.original.type}</div>
                      </div>
                    )
                  },
                  {
                    header: 'Format',
                    accessorKey: 'format',
                    cell: ({ row }) => (
                      <span className="uppercase text-xs font-medium text-gray-600">
                        {row.original.format}
                      </span>
                    )
                  },
                  {
                    header: 'Size',
                    accessorKey: 'size'
                  },
                  {
                    header: 'Generated',
                    accessorKey: 'generatedAt',
                    cell: ({ row }) => (
                      <div>
                        <div className="text-sm text-gray-900">{row.original.generatedAt}</div>
                        <div className="text-xs text-gray-500">by {row.original.generatedBy}</div>
                      </div>
                    )
                  },
                  {
                    header: 'Actions',
                    cell: ({ row }) => (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            if (row.original.format === 'csv') {
                              downloadCSV(row.original);
                            } else {
                              downloadPDF(row.original);
                            }
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  }
                ]}
              />
            </div>
          </div>
        )}

        {/* Report Generation Modal */}
        <Modal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          title="Generate Report"
        >
          <ReportGenerationForm />
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowReportModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowPreviewModal(true)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-2 inline" />
              Preview
            </button>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="px-4 py-2 text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50"
            >
              <Save className="h-4 w-4 mr-2 inline" />
              Save as Template
            </button>
            <button
              onClick={handleGenerateReport}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Download className="h-4 w-4 mr-2 inline" />
              Generate & Download
            </button>
          </div>
        </Modal>

        {/* Template Modal */}
        <Modal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          title="Save Report Template"
        >
          <TemplateForm />
        </Modal>

        {/* Schedule Modal */}
        <Modal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          title="Schedule Report"
        >
          <ScheduleForm />
        </Modal>

        {/* Report Preview Modal */}
        {showPreviewModal && (
          <ReportPreview
            reportType={reportParameters.type}
            parameters={reportParameters}
            onClose={() => setShowPreviewModal(false)}
          />
        )}

        {/* Template Editor Modal */}
        {showTemplateEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <ReportTemplateEditor
                template={editingTemplate}
                onSave={(templateData) => {
                  if (editingTemplate) {
                    // Update existing template
                    setReportTemplates(reportTemplates.map(t => 
                      t.id === editingTemplate.id ? { ...t, ...templateData } : t
                    ));
                  } else {
                    // Create new template
                    handleSaveTemplate(templateData);
                  }
                  setShowTemplateEditor(false);
                  setEditingTemplate(null);
                }}
                onCancel={() => {
                  setShowTemplateEditor(false);
                  setEditingTemplate(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Reports;