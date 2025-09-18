// Email templates for scheduled reports and notifications

export class EmailTemplates {
  static getReportDeliveryTemplate(reportData) {
    const { reportName, reportType, generatedAt, downloadLink, recipientName } = reportData;
    
    return {
      subject: `Academic Repository Report: ${reportName}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Academic Repository Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e1e5e9; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e1e5e9; border-top: none; }
            .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .button:hover { background: #4338ca; }
            .info-box { background: #f8fafc; border-left: 4px solid #4f46e5; padding: 15px; margin: 20px 0; }
            .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
            .stat-item { background: #f8fafc; padding: 15px; border-radius: 6px; text-align: center; }
            .stat-value { font-size: 24px; font-weight: bold; color: #4f46e5; }
            .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">📊 Academic Repository Report</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your scheduled report is ready</p>
            </div>
            
            <div class="content">
              <p>Hello ${recipientName || 'Administrator'},</p>
              
              <p>Your scheduled report "<strong>${reportName}</strong>" has been generated and is ready for download.</p>
              
              <div class="info-box">
                <p style="margin: 0;"><strong>Report Details:</strong></p>
                <ul style="margin: 10px 0;">
                  <li><strong>Type:</strong> ${this.getReportTypeLabel(reportType)}</li>
                  <li><strong>Generated:</strong> ${generatedAt}</li>
                  <li><strong>Format:</strong> ${reportData.format?.toUpperCase() || 'PDF'}</li>
                </ul>
              </div>
              
              ${this.getReportSummary(reportType, reportData)}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${downloadLink}" class="button">📥 Download Report</a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px;">
                <strong>Note:</strong> This download link will expire in 7 days. Please save the report to your local system if you need to keep it for longer.
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                This is an automated message from the Academic Repository System.<br>
                If you have questions, please contact your system administrator.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Academic Repository Report: ${reportName}

Hello ${recipientName || 'Administrator'},

Your scheduled report "${reportName}" has been generated and is ready for download.

Report Details:
- Type: ${this.getReportTypeLabel(reportType)}
- Generated: ${generatedAt}
- Format: ${reportData.format?.toUpperCase() || 'PDF'}

Download Link: ${downloadLink}

Note: This download link will expire in 7 days.

This is an automated message from the Academic Repository System.
      `
    };
  }

  static getReportSummary(reportType, reportData) {
    switch (reportType) {
      case 'submissions':
        return `
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">${reportData.totalSubmissions || '156'}</div>
              <div class="stat-label">Total Submissions</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${reportData.approvedCount || '124'}</div>
              <div class="stat-label">Approved</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${reportData.pendingCount || '18'}</div>
              <div class="stat-label">Pending Review</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${reportData.approvalRate || '79.5%'}</div>
              <div class="stat-label">Approval Rate</div>
            </div>
          </div>
        `;
      
      case 'faculty':
        return `
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">${reportData.totalFaculty || '24'}</div>
              <div class="stat-label">Active Faculty</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${reportData.totalReviews || '342'}</div>
              <div class="stat-label">Reviews Completed</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${reportData.avgReviewTime || '2.3'}</div>
              <div class="stat-label">Avg Review Time (days)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${reportData.workloadBalance || '85%'}</div>
              <div class="stat-label">Workload Balance</div>
            </div>
          </div>
        `;
      
      case 'departments':
        return `
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">${reportData.totalDepartments || '8'}</div>
              <div class="stat-label">Departments</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${reportData.topPerformer || 'Computer Science'}</div>
              <div class="stat-label">Top Performer</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${reportData.avgSubmissions || '19.5'}</div>
              <div class="stat-label">Avg Submissions/Dept</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${reportData.overallApprovalRate || '82.1%'}</div>
              <div class="stat-label">Overall Approval Rate</div>
            </div>
          </div>
        `;
      
      case 'system':
        return `
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">${reportData.totalUsers || '1,247'}</div>
              <div class="stat-label">Total Users</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${reportData.systemUptime || '99.8%'}</div>
              <div class="stat-label">System Uptime</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${reportData.storageUsed || '2.4 TB'}</div>
              <div class="stat-label">Storage Used</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${reportData.activeUsers || '89'}</div>
              <div class="stat-label">Active Users (24h)</div>
            </div>
          </div>
        `;
      
      default:
        return '';
    }
  }

  static getScheduleReminderTemplate(scheduleData) {
    const { scheduleName, nextRun, reportType, recipientName } = scheduleData;
    
    return {
      subject: `Upcoming Report Generation: ${scheduleName}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Scheduled Report Reminder</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e1e5e9; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e1e5e9; border-top: none; }
            .info-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">⏰ Scheduled Report Reminder</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Upcoming report generation</p>
            </div>
            
            <div class="content">
              <p>Hello ${recipientName || 'Administrator'},</p>
              
              <p>This is a reminder that your scheduled report "<strong>${scheduleName}</strong>" will be generated soon.</p>
              
              <div class="info-box">
                <p style="margin: 0;"><strong>Schedule Details:</strong></p>
                <ul style="margin: 10px 0;">
                  <li><strong>Report Name:</strong> ${scheduleName}</li>
                  <li><strong>Type:</strong> ${this.getReportTypeLabel(reportType)}</li>
                  <li><strong>Next Generation:</strong> ${nextRun}</li>
                </ul>
              </div>
              
              <p>The report will be automatically generated and delivered to your email when ready. No action is required from you.</p>
              
              <p style="color: #6b7280; font-size: 14px;">
                If you need to modify this schedule or have any questions, please contact your system administrator.
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                This is an automated reminder from the Academic Repository System.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Scheduled Report Reminder: ${scheduleName}

Hello ${recipientName || 'Administrator'},

This is a reminder that your scheduled report "${scheduleName}" will be generated soon.

Schedule Details:
- Report Name: ${scheduleName}
- Type: ${this.getReportTypeLabel(reportType)}
- Next Generation: ${nextRun}

The report will be automatically generated and delivered to your email when ready.

This is an automated reminder from the Academic Repository System.
      `
    };
  }

  static getReportErrorTemplate(errorData) {
    const { scheduleName, errorMessage, reportType, recipientName, timestamp } = errorData;
    
    return {
      subject: `Report Generation Failed: ${scheduleName}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Report Generation Error</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e1e5e9; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e1e5e9; border-top: none; }
            .error-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">❌ Report Generation Failed</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Action required</p>
            </div>
            
            <div class="content">
              <p>Hello ${recipientName || 'Administrator'},</p>
              
              <p>We encountered an error while generating your scheduled report "<strong>${scheduleName}</strong>".</p>
              
              <div class="error-box">
                <p style="margin: 0;"><strong>Error Details:</strong></p>
                <ul style="margin: 10px 0;">
                  <li><strong>Report Name:</strong> ${scheduleName}</li>
                  <li><strong>Type:</strong> ${this.getReportTypeLabel(reportType)}</li>
                  <li><strong>Error Time:</strong> ${timestamp}</li>
                  <li><strong>Error Message:</strong> ${errorMessage}</li>
                </ul>
              </div>
              
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>The system will automatically retry generating this report in 1 hour</li>
                <li>If the error persists, please contact your system administrator</li>
                <li>Your schedule remains active and will continue with the next planned generation</li>
              </ul>
              
              <p style="color: #6b7280; font-size: 14px;">
                Common causes include temporary system maintenance, data processing delays, or configuration issues.
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                This is an automated error notification from the Academic Repository System.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Report Generation Failed: ${scheduleName}

Hello ${recipientName || 'Administrator'},

We encountered an error while generating your scheduled report "${scheduleName}".

Error Details:
- Report Name: ${scheduleName}
- Type: ${this.getReportTypeLabel(reportType)}
- Error Time: ${timestamp}
- Error Message: ${errorMessage}

What happens next:
- The system will automatically retry generating this report in 1 hour
- If the error persists, please contact your system administrator
- Your schedule remains active and will continue with the next planned generation

This is an automated error notification from the Academic Repository System.
      `
    };
  }

  static getReportTypeLabel(type) {
    const labels = {
      submissions: 'Submission Analytics Report',
      faculty: 'Faculty Performance Report',
      departments: 'Department Analytics Report',
      system: 'System Metrics Report',
      custom: 'Custom Report'
    };
    return labels[type] || 'Academic Report';
  }

  static getWelcomeTemplate(userData) {
    const { name, role, email } = userData;
    
    return {
      subject: 'Welcome to Academic Repository System - Report Access',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Academic Repository</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e1e5e9; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e1e5e9; border-top: none; }
            .feature-list { background: #f0fdf4; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to Academic Repository</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your reporting access is now active</p>
            </div>
            
            <div class="content">
              <p>Hello ${name},</p>
              
              <p>Welcome to the Academic Repository System! Your account has been set up with <strong>${role}</strong> access, including comprehensive reporting capabilities.</p>
              
              <div class="feature-list">
                <h3 style="margin-top: 0;">Available Report Features:</h3>
                <ul>
                  <li>📊 Generate custom reports with flexible parameters</li>
                  <li>📅 Schedule automated report delivery</li>
                  <li>📋 Use pre-built report templates</li>
                  <li>📈 Access real-time analytics and insights</li>
                  <li>📧 Receive reports directly in your email</li>
                  <li>💾 Export data in multiple formats (CSV, PDF)</li>
                </ul>
              </div>
              
              <p><strong>Getting Started:</strong></p>
              <ol>
                <li>Log in to your account using: <strong>${email}</strong></li>
                <li>Navigate to the Reports section in your dashboard</li>
                <li>Explore available report templates or create custom reports</li>
                <li>Set up scheduled reports for regular insights</li>
              </ol>
              
              <div style="text-align: center;">
                <a href="#" class="button">🚀 Access Your Dashboard</a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px;">
                If you have any questions about the reporting system, please don't hesitate to contact your system administrator.
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Academic Repository System - Empowering institutional insights
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Welcome to Academic Repository System

Hello ${name},

Welcome to the Academic Repository System! Your account has been set up with ${role} access, including comprehensive reporting capabilities.

Available Report Features:
- Generate custom reports with flexible parameters
- Schedule automated report delivery
- Use pre-built report templates
- Access real-time analytics and insights
- Receive reports directly in your email
- Export data in multiple formats (CSV, PDF)

Getting Started:
1. Log in to your account using: ${email}
2. Navigate to the Reports section in your dashboard
3. Explore available report templates or create custom reports
4. Set up scheduled reports for regular insights

If you have any questions about the reporting system, please contact your system administrator.

Academic Repository System - Empowering institutional insights
      `
    };
  }
}