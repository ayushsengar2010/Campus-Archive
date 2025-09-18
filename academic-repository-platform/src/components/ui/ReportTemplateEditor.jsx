import { useState } from 'react';
import { Save, X, Plus, Trash2, Settings } from 'lucide-react';

const ReportTemplateEditor = ({ template, onSave, onCancel }) => {
  const [templateData, setTemplateData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    type: template?.type || 'submissions',
    parameters: template?.parameters || {
      dateRange: 'last30days',
      departments: [],
      format: 'csv',
      includeCharts: false,
      customFields: []
    },
    schedule: template?.schedule || {
      enabled: false,
      frequency: 'monthly',
      recipients: ['']
    }
  });

  const reportTypes = [
    { value: 'submissions', label: 'Submission Reports' },
    { value: 'faculty', label: 'Faculty Reports' },
    { value: 'departments', label: 'Department Reports' },
    { value: 'system', label: 'System Reports' },
    { value: 'custom', label: 'Custom Reports' }
  ];

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

  const customFieldTypes = [
    { value: 'text', label: 'Text Field' },
    { value: 'number', label: 'Number Field' },
    { value: 'date', label: 'Date Field' },
    { value: 'select', label: 'Dropdown Select' },
    { value: 'multiselect', label: 'Multi-Select' },
    { value: 'boolean', label: 'Yes/No Field' }
  ];

  const addCustomField = () => {
    setTemplateData({
      ...templateData,
      parameters: {
        ...templateData.parameters,
        customFields: [
          ...templateData.parameters.customFields,
          {
            id: Date.now(),
            name: '',
            label: '',
            type: 'text',
            required: false,
            options: []
          }
        ]
      }
    });
  };

  const updateCustomField = (index, field, value) => {
    const newFields = [...templateData.parameters.customFields];
    newFields[index] = { ...newFields[index], [field]: value };
    setTemplateData({
      ...templateData,
      parameters: {
        ...templateData.parameters,
        customFields: newFields
      }
    });
  };

  const removeCustomField = (index) => {
    setTemplateData({
      ...templateData,
      parameters: {
        ...templateData.parameters,
        customFields: templateData.parameters.customFields.filter((_, i) => i !== index)
      }
    });
  };

  const addRecipient = () => {
    setTemplateData({
      ...templateData,
      schedule: {
        ...templateData.schedule,
        recipients: [...templateData.schedule.recipients, '']
      }
    });
  };

  const updateRecipient = (index, value) => {
    const newRecipients = [...templateData.schedule.recipients];
    newRecipients[index] = value;
    setTemplateData({
      ...templateData,
      schedule: {
        ...templateData.schedule,
        recipients: newRecipients
      }
    });
  };

  const removeRecipient = (index) => {
    setTemplateData({
      ...templateData,
      schedule: {
        ...templateData.schedule,
        recipients: templateData.schedule.recipients.filter((_, i) => i !== index)
      }
    });
  };

  const handleSave = () => {
    if (!templateData.name.trim()) {
      alert('Please enter a template name');
      return;
    }
    onSave(templateData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {template ? 'Edit Template' : 'Create New Template'}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <X className="h-4 w-4 mr-2 inline" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Save className="h-4 w-4 mr-2 inline" />
            Save Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select
                  value={templateData.type}
                  onChange={(e) => setTemplateData({...templateData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {reportTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Report Parameters */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Parameters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Date Range</label>
                <select
                  value={templateData.parameters.dateRange}
                  onChange={(e) => setTemplateData({
                    ...templateData,
                    parameters: {...templateData.parameters, dateRange: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="lastQuarter">Last Quarter</option>
                  <option value="lastYear">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                  <label className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={templateData.parameters.departments.length === 0}
                      onChange={(e) => setTemplateData({
                        ...templateData,
                        parameters: {
                          ...templateData.parameters,
                          departments: e.target.checked ? [] : departments
                        }
                      })}
                      className="mr-2"
                    />
                    All Departments
                  </label>
                  {departments.map(dept => (
                    <label key={dept} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        checked={templateData.parameters.departments.includes(dept)}
                        onChange={(e) => {
                          const newDepts = e.target.checked
                            ? [...templateData.parameters.departments, dept]
                            : templateData.parameters.departments.filter(d => d !== dept);
                          setTemplateData({
                            ...templateData,
                            parameters: {
                              ...templateData.parameters,
                              departments: newDepts
                            }
                          });
                        }}
                        className="mr-2"
                      />
                      {dept}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Format</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="csv"
                      checked={templateData.parameters.format === 'csv'}
                      onChange={(e) => setTemplateData({
                        ...templateData,
                        parameters: {...templateData.parameters, format: e.target.value}
                      })}
                      className="mr-2"
                    />
                    CSV
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="pdf"
                      checked={templateData.parameters.format === 'pdf'}
                      onChange={(e) => setTemplateData({
                        ...templateData,
                        parameters: {...templateData.parameters, format: e.target.value}
                      })}
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
                    checked={templateData.parameters.includeCharts}
                    onChange={(e) => setTemplateData({
                      ...templateData,
                      parameters: {...templateData.parameters, includeCharts: e.target.checked}
                    })}
                    className="mr-2"
                  />
                  Include Charts and Visualizations
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Configuration */}
        <div className="space-y-6">
          {/* Custom Fields */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Custom Fields</h3>
              <button
                onClick={addCustomField}
                className="flex items-center px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Field
              </button>
            </div>

            <div className="space-y-3">
              {templateData.parameters.customFields.map((field, index) => (
                <div key={field.id} className="p-3 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Field Name"
                        value={field.name}
                        onChange={(e) => updateCustomField(index, 'name', e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Display Label"
                        value={field.label}
                        onChange={(e) => updateCustomField(index, 'label', e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                    </div>
                    <button
                      onClick={() => removeCustomField(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={field.type}
                      onChange={(e) => updateCustomField(index, 'type', e.target.value)}
                      className="px-2 py-1 text-sm border border-gray-300 rounded"
                    >
                      {customFieldTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateCustomField(index, 'required', e.target.checked)}
                        className="mr-1"
                      />
                      Required
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Configuration */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={templateData.schedule.enabled}
                    onChange={(e) => setTemplateData({
                      ...templateData,
                      schedule: {...templateData.schedule, enabled: e.target.checked}
                    })}
                    className="mr-2"
                  />
                  Enable Automatic Scheduling
                </label>
              </div>

              {templateData.schedule.enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Frequency</label>
                    <select
                      value={templateData.schedule.frequency}
                      onChange={(e) => setTemplateData({
                        ...templateData,
                        schedule: {...templateData.schedule, frequency: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Default Recipients</label>
                      <button
                        onClick={addRecipient}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        + Add Recipient
                      </button>
                    </div>
                    {templateData.schedule.recipients.map((recipient, index) => (
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
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportTemplateEditor;