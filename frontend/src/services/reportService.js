// Report generation and export service
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export class ReportService {
  static generateCSVReport(data, reportType, parameters) {
    let csvData = [];
    let headers = [];

    switch (reportType) {
      case 'submissions':
        headers = ['Date', 'Student Name', 'Title', 'Department', 'Status', 'Faculty', 'Submission Date'];
        csvData = [
          headers,
          ...data.map(item => [
            item.date || new Date().toLocaleDateString(),
            item.studentName || 'John Doe',
            item.title || 'Sample Project',
            item.department || 'Computer Science',
            item.status || 'Pending',
            item.faculty || 'Dr. Smith',
            item.submissionDate || new Date().toLocaleDateString()
          ])
        ];
        break;

      case 'faculty':
        headers = ['Faculty Name', 'Department', 'Total Reviews', 'Approved', 'Rejected', 'Pending', 'Avg Review Time'];
        csvData = [
          headers,
          ...data.map(item => [
            item.facultyName || 'Dr. Smith',
            item.department || 'Computer Science',
            item.totalReviews || '45',
            item.approved || '38',
            item.rejected || '5',
            item.pending || '2',
            item.avgReviewTime || '2.3 days'
          ])
        ];
        break;

      case 'departments':
        headers = ['Department', 'Total Submissions', 'Approved', 'Rejected', 'Pending', 'Approval Rate'];
        csvData = [
          headers,
          ...data.map(item => [
            item.department || 'Computer Science',
            item.totalSubmissions || '120',
            item.approved || '95',
            item.rejected || '15',
            item.pending || '10',
            item.approvalRate || '79.2%'
          ])
        ];
        break;

      case 'system':
        headers = ['Metric', 'Value', 'Period', 'Change'];
        csvData = [
          headers,
          ['Total Users', '1,247', 'Current', '+12%'],
          ['Active Submissions', '89', 'Current', '+5%'],
          ['Completed Reviews', '456', 'This Month', '+18%'],
          ['System Uptime', '99.8%', 'This Month', '+0.1%']
        ];
        break;

      default:
        headers = ['Data Point', 'Value'];
        csvData = [headers, ['No Data', 'Available']];
    }

    return this.arrayToCSV(csvData);
  }

  static generatePDFReport(data, reportType, parameters) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(20);
    doc.text('Academic Repository Report', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Report Type: ${this.getReportTypeLabel(reportType)}`, 20, 35);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 45);
    doc.text(`Period: ${this.getDateRangeLabel(parameters.dateRange)}`, 20, 55);

    let yPosition = 70;

    switch (reportType) {
      case 'submissions':
        this.addSubmissionsTable(doc, data, yPosition);
        break;
      case 'faculty':
        this.addFacultyTable(doc, data, yPosition);
        break;
      case 'departments':
        this.addDepartmentsTable(doc, data, yPosition);
        break;
      case 'system':
        this.addSystemMetricsTable(doc, data, yPosition);
        break;
    }

    if (parameters.includeCharts) {
      this.addChartsSection(doc, reportType, data);
    }

    return doc;
  }

  static addSubmissionsTable(doc, data, yPosition) {
    const tableData = [
      ['Student', 'Title', 'Department', 'Status', 'Date'],
      ['John Doe', 'Machine Learning Project', 'Computer Science', 'Approved', '2024-01-15'],
      ['Jane Smith', 'Database Design', 'Computer Science', 'Pending', '2024-01-20'],
      ['Bob Johnson', 'Web Application', 'Engineering', 'Rejected', '2024-01-18'],
      ['Alice Brown', 'Research Paper', 'Mathematics', 'Approved', '2024-01-22']
    ];

    doc.autoTable({
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: yPosition,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }
    });
  }

  static addFacultyTable(doc, data, yPosition) {
    const tableData = [
      ['Faculty', 'Department', 'Reviews', 'Approved', 'Rejected', 'Avg Time'],
      ['Dr. Smith', 'Computer Science', '45', '38', '7', '2.1 days'],
      ['Dr. Johnson', 'Mathematics', '32', '28', '4', '1.8 days'],
      ['Dr. Brown', 'Physics', '28', '24', '4', '2.5 days'],
      ['Dr. Davis', 'Chemistry', '35', '30', '5', '2.0 days']
    ];

    doc.autoTable({
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: yPosition,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }
    });
  }

  static addDepartmentsTable(doc, data, yPosition) {
    const tableData = [
      ['Department', 'Submissions', 'Approved', 'Rejected', 'Approval Rate'],
      ['Computer Science', '120', '95', '25', '79.2%'],
      ['Mathematics', '85', '72', '13', '84.7%'],
      ['Physics', '67', '58', '9', '86.6%'],
      ['Chemistry', '92', '78', '14', '84.8%']
    ];

    doc.autoTable({
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: yPosition,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }
    });
  }

  static addSystemMetricsTable(doc, data, yPosition) {
    const tableData = [
      ['Metric', 'Current Value', 'Previous Period', 'Change'],
      ['Total Users', '1,247', '1,115', '+11.8%'],
      ['Active Submissions', '89', '85', '+4.7%'],
      ['Completed Reviews', '456', '387', '+17.8%'],
      ['System Uptime', '99.8%', '99.7%', '+0.1%']
    ];

    doc.autoTable({
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: yPosition,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }
    });
  }

  static addChartsSection(doc, reportType, data) {
    const finalY = doc.lastAutoTable.finalY || 100;
    
    doc.setFontSize(14);
    doc.text('Charts and Visualizations', 20, finalY + 20);
    
    doc.setFontSize(10);
    doc.text('Note: Chart generation would be implemented with a charting library', 20, finalY + 35);
    doc.text('such as Chart.js or D3.js for production use.', 20, finalY + 45);
    
    // Placeholder for chart area
    doc.rect(20, finalY + 55, 170, 80);
    doc.text('Chart Placeholder', 100, finalY + 95, { align: 'center' });
  }

  static arrayToCSV(data) {
    return data.map(row => 
      row.map(field => {
        // Escape fields that contain commas, quotes, or newlines
        if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      }).join(',')
    ).join('\n');
  }

  static downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  static downloadPDF(doc, filename) {
    doc.save(filename);
  }

  static getReportTypeLabel(type) {
    const labels = {
      submissions: 'Submission Reports',
      faculty: 'Faculty Performance Reports',
      departments: 'Department Analytics',
      system: 'System Metrics',
      custom: 'Custom Report'
    };
    return labels[type] || 'Unknown Report Type';
  }

  static getDateRangeLabel(range) {
    const labels = {
      last7days: 'Last 7 Days',
      last30days: 'Last 30 Days',
      lastQuarter: 'Last Quarter',
      lastYear: 'Last Year',
      custom: 'Custom Date Range'
    };
    return labels[range] || 'Unknown Range';
  }

  // Mock data generators for different report types
  static generateMockData(reportType, parameters) {
    switch (reportType) {
      case 'submissions':
        return this.generateSubmissionData(parameters);
      case 'faculty':
        return this.generateFacultyData(parameters);
      case 'departments':
        return this.generateDepartmentData(parameters);
      case 'system':
        return this.generateSystemData(parameters);
      default:
        return [];
    }
  }

  static generateSubmissionData(parameters) {
    const students = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'];
    const titles = ['Machine Learning Project', 'Database Design', 'Web Application', 'Research Paper', 'Mobile App'];
    const departments = parameters.departments.length > 0 ? parameters.departments : ['Computer Science', 'Mathematics', 'Physics'];
    const statuses = ['Approved', 'Pending', 'Rejected'];

    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      studentName: students[Math.floor(Math.random() * students.length)],
      title: titles[Math.floor(Math.random() * titles.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      submissionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }));
  }

  static generateFacultyData(parameters) {
    const faculty = ['Dr. Smith', 'Dr. Johnson', 'Dr. Brown', 'Dr. Davis', 'Dr. Wilson'];
    const departments = parameters.departments.length > 0 ? parameters.departments : ['Computer Science', 'Mathematics', 'Physics'];

    return faculty.map((name, i) => ({
      id: i + 1,
      facultyName: name,
      department: departments[i % departments.length],
      totalReviews: Math.floor(Math.random() * 50) + 20,
      approved: Math.floor(Math.random() * 40) + 15,
      rejected: Math.floor(Math.random() * 10) + 2,
      pending: Math.floor(Math.random() * 5) + 1,
      avgReviewTime: (Math.random() * 3 + 1).toFixed(1) + ' days'
    }));
  }

  static generateDepartmentData(parameters) {
    const departments = parameters.departments.length > 0 ? parameters.departments : 
      ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];

    return departments.map((dept, i) => ({
      id: i + 1,
      department: dept,
      totalSubmissions: Math.floor(Math.random() * 100) + 50,
      approved: Math.floor(Math.random() * 80) + 40,
      rejected: Math.floor(Math.random() * 20) + 5,
      pending: Math.floor(Math.random() * 15) + 2,
      approvalRate: (Math.random() * 20 + 75).toFixed(1) + '%'
    }));
  }

  static generateSystemData(parameters) {
    return [
      { metric: 'Total Users', value: '1,247', change: '+12%' },
      { metric: 'Active Submissions', value: '89', change: '+5%' },
      { metric: 'Completed Reviews', value: '456', change: '+18%' },
      { metric: 'System Uptime', value: '99.8%', change: '+0.1%' }
    ];
  }
}

// Email service for scheduled reports
export class EmailService {
  static async sendScheduledReport(reportData, recipients, reportName) {
    // Mock email sending - in production, this would integrate with an email service
    console.log('Sending scheduled report:', {
      reportName,
      recipients,
      timestamp: new Date().toISOString()
    });

    // Simulate API call to email service
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          messageId: `msg_${Date.now()}`,
          recipients: recipients.length
        });
      }, 1000);
    });
  }

  static async sendReportDelivery(reportData, recipients) {
    // In production, this would use a service like SendGrid, AWS SES, or similar
    const emailPromises = recipients.map(async (recipient) => {
      try {
        // Mock email sending with realistic delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
        
        console.log(`Report delivered to: ${recipient}`, {
          reportName: reportData.reportName,
          reportType: reportData.reportType,
          timestamp: new Date().toISOString()
        });
        
        return { recipient, status: 'delivered', messageId: `msg_${Date.now()}_${Math.random()}` };
      } catch (error) {
        console.error(`Failed to send report to ${recipient}:`, error);
        return { recipient, status: 'failed', error: error.message };
      }
    });

    const results = await Promise.all(emailPromises);
    
    return {
      success: results.every(r => r.status === 'delivered'),
      delivered: results.filter(r => r.status === 'delivered').length,
      failed: results.filter(r => r.status === 'failed').length,
      results
    };
  }

  static async sendScheduleReminder(scheduleData, recipients) {
    // Send reminder emails before scheduled report generation
    const emailPromises = recipients.map(async (recipient) => {
      try {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`Reminder sent to: ${recipient}`, scheduleData);
        return { recipient, status: 'sent' };
      } catch (error) {
        return { recipient, status: 'failed', error: error.message };
      }
    });

    return Promise.all(emailPromises);
  }

  static async sendErrorNotification(errorData, recipients) {
    // Send error notifications when report generation fails
    const emailPromises = recipients.map(async (recipient) => {
      try {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`Error notification sent to: ${recipient}`, errorData);
        return { recipient, status: 'sent' };
      } catch (error) {
        return { recipient, status: 'failed', error: error.message };
      }
    });

    return Promise.all(emailPromises);
  }

  // Legacy method for backward compatibility
  static generateEmailTemplate(reportName, reportType, downloadLink) {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4f46e5;">Academic Repository Report</h2>
            <p>Your scheduled report "<strong>${reportName}</strong>" has been generated and is ready for download.</p>
            
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Report Type:</strong> ${reportType}</p>
              <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p>
              <a href="${downloadLink}" 
                 style="background-color: #4f46e5; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Download Report
              </a>
            </p>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              This is an automated message from the Academic Repository System.
            </p>
          </div>
        </body>
      </html>
    `;
  }
}

// Scheduler service for managing scheduled reports
export class SchedulerService {
  static schedules = new Map();

  static scheduleReport(scheduleConfig) {
    const { id, frequency, nextRun, template, recipients } = scheduleConfig;
    
    // Calculate next execution time
    const nextExecution = new Date(nextRun);
    const now = new Date();
    
    if (nextExecution <= now) {
      // If the scheduled time has passed, calculate next occurrence
      this.calculateNextRun(scheduleConfig);
    }

    // Store schedule configuration
    this.schedules.set(id, {
      ...scheduleConfig,
      status: 'active',
      lastRun: null
    });

    // In production, this would integrate with a job scheduler like node-cron
    console.log(`Report scheduled: ${scheduleConfig.name} - Next run: ${nextExecution}`);
    
    return {
      success: true,
      scheduleId: id,
      nextRun: nextExecution
    };
  }

  static calculateNextRun(scheduleConfig) {
    const { frequency, nextRun } = scheduleConfig;
    const current = new Date(nextRun);
    
    switch (frequency) {
      case 'daily':
        current.setDate(current.getDate() + 1);
        break;
      case 'weekly':
        current.setDate(current.getDate() + 7);
        break;
      case 'monthly':
        current.setMonth(current.getMonth() + 1);
        break;
      case 'quarterly':
        current.setMonth(current.getMonth() + 3);
        break;
    }
    
    return current.toISOString();
  }

  static pauseSchedule(scheduleId) {
    const schedule = this.schedules.get(scheduleId);
    if (schedule) {
      schedule.status = 'paused';
      this.schedules.set(scheduleId, schedule);
    }
  }

  static resumeSchedule(scheduleId) {
    const schedule = this.schedules.get(scheduleId);
    if (schedule) {
      schedule.status = 'active';
      this.schedules.set(scheduleId, schedule);
    }
  }

  static deleteSchedule(scheduleId) {
    return this.schedules.delete(scheduleId);
  }

  static getActiveSchedules() {
    return Array.from(this.schedules.values()).filter(s => s.status === 'active');
  }
}