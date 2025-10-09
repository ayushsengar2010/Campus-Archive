# Project Type Submission Feature - Student Classroom

## 📋 Overview
Enhanced the student submission flow to differentiate between **Project** type assignments and regular assignments, requiring structured file uploads for projects.

## 🎯 Purpose
When students submit work for a **Project** type assignment, they must upload:
1. **Project Report** (Required) - PDF/DOC format
2. **Presentation (PPT)** (Required) - PPT/PPTX format  
3. **Source Code** (Required) - ZIP/RAR archive
4. **GitHub Link** (Optional) - Repository URL

## 🔄 User Flow

### For Project Type Assignments:

```
Student Dashboard
   ↓
Navigate to Classroom
   ↓
Select Classroom
   ↓
View Project Assignment (type: "Project")
   ↓
Click "Submit Work"
   ↓
Structured Upload Form Opens:
   ↓
1. Upload Project Report (PDF/DOC) ⭐ Required
   ↓
2. Upload Presentation (PPT/PPTX) ⭐ Required
   ↓
3. Upload Source Code (ZIP) ⭐ Required
   ↓
4. Add GitHub Link (Optional)
   ↓
5. Add Description (Optional)
   ↓
Click "Submit Work"
   ↓
Validation: Check all required files present
   ↓
Success: Navigate back to classroom
```

### For Regular Assignments:

```
Student Dashboard
   ↓
Navigate to Classroom
   ↓
Select Classroom
   ↓
View Assignment (type: "Assignment" or "Research")
   ↓
Click "Submit Work"
   ↓
Flexible Upload Form:
   ↓
Drag & Drop or Browse Files
   ↓
Upload any files (PDF, DOC, ZIP, images)
   ↓
Add Description
   ↓
Submit
```

## 🛠️ Technical Implementation

### 1. Type Detection

```javascript
const isProjectType = subject?.type?.toLowerCase() === 'project';
```

This checks if the assignment type is "project" to render appropriate upload interface.

### 2. State Management

**For Project Type:**
```javascript
const [reportFile, setReportFile] = useState(null);
const [pptFile, setPptFile] = useState(null);
const [codeFile, setCodeFile] = useState(null);
const [githubLink, setGithubLink] = useState('');
```

**For Regular Assignments:**
```javascript
const [files, setFiles] = useState([]);  // Array of multiple files
```

### 3. File Upload Handlers

**Individual Upload Functions:**
```javascript
const handleReportUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
        setReportFile(e.target.files[0]);
    }
};

const handlePptUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
        setPptFile(e.target.files[0]);
    }
};

const handleCodeUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
        setCodeFile(e.target.files[0]);
    }
};
```

**Remove Functions:**
```javascript
const removeReportFile = () => setReportFile(null);
const removePptFile = () => setPptFile(null);
const removeCodeFile = () => setCodeFile(null);
```

### 4. Validation Logic

```javascript
const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for project type
    if (isProjectType) {
        if (!reportFile) {
            alert('Please upload a project report (PDF/DOC)');
            return;
        }
        if (!pptFile) {
            alert('Please upload a presentation (PPT/PPTX)');
            return;
        }
        if (!codeFile) {
            alert('Please upload your source code (ZIP file)');
            return;
        }
    } else {
        // Validation for regular assignments
        if (files.length === 0) {
            alert('Please select at least one file to submit.');
            return;
        }
    }
    
    // Proceed with submission...
};
```

## 📊 UI Components

### Project Report Upload Section

```jsx
<div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="flex items-center mb-4">
        <FileText className="h-5 w-5 text-red-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
            Project Report <span className="text-red-500">*</span>
        </h3>
    </div>
    <p className="text-sm text-gray-600 mb-4">
        Upload your project report (PDF or DOC format, max 50MB)
    </p>
    
    {/* File upload/display logic */}
</div>
```

**Color Coding:**
- **Report**: Red theme (text-red-600, bg-red-50, border-red-200)
- **Presentation**: Orange theme (text-orange-600, bg-orange-50)
- **Code**: Purple theme (text-purple-600, bg-purple-50)
- **GitHub**: Gray/Black theme (text-gray-900)

### Presentation Upload Section

```jsx
<div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="flex items-center mb-4">
        <Presentation className="h-5 w-5 text-orange-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
            Presentation (PPT) <span className="text-red-500">*</span>
        </h3>
    </div>
    {/* Upload interface */}
</div>
```

### Source Code Upload Section

```jsx
<div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="flex items-center mb-4">
        <FileSpreadsheet className="h-5 w-5 text-purple-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
            Source Code <span className="text-red-500">*</span>
        </h3>
    </div>
    {/* Upload interface */}
</div>
```

### GitHub Link Section (Optional)

```jsx
<div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="flex items-center mb-4">
        <Github className="h-5 w-5 text-gray-900 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
            GitHub Repository Link (Optional)
        </h3>
    </div>
    <div className="relative">
        <LinkIcon className="absolute left-3 top-1/2..." />
        <input
            type="url"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
            placeholder="https://github.com/username/repository"
        />
    </div>
</div>
```

## 🎨 Visual Design

### File Upload States

**Empty State (Click to Upload):**
```
┌─────────────────────────────────────────┐
│            [Icon]                        │
│     Click to upload [file type]        │
│     [Accepted formats] (max size)       │
└─────────────────────────────────────────┘
```

**Uploaded State:**
```
┌─────────────────────────────────────────┐
│ [Icon] filename.ext            [X]      │
│        2.5 MB                           │
└─────────────────────────────────────────┘
```

### Conditional Rendering Logic

```jsx
{isProjectType ? (
    /* Structured upload sections */
    <div className="space-y-6">
        {/* Report */}
        {/* PPT */}
        {/* Code */}
        {/* GitHub */}
    </div>
) : (
    /* Flexible drag & drop upload */
    <div>
        {/* Multi-file upload area */}
    </div>
)}
```

## 📁 File Type Restrictions

### Project Type:

| Component | Accepted Formats | Max Size |
|-----------|------------------|----------|
| Report | .pdf, .doc, .docx | 50 MB |
| Presentation | .ppt, .pptx | 50 MB |
| Source Code | .zip, .rar, .7z | 100 MB |
| GitHub Link | URL | N/A |

### Regular Assignment:

| Component | Accepted Formats | Max Size |
|-----------|------------------|----------|
| Files | .pdf, .doc, .docx, .zip, .jpg, .jpeg, .png, .gif | 50 MB per file |

## ✅ Validation Rules

### Project Type Validation:
1. ✓ Report file must be uploaded
2. ✓ Presentation file must be uploaded
3. ✓ Source code file must be uploaded
4. ✓ GitHub link is optional (validated if provided)
5. ✓ Description is optional

### Regular Assignment Validation:
1. ✓ At least one file must be uploaded
2. ✓ Description is optional

### Submit Button State:

**Project Type:**
```javascript
disabled={isSubmitting || (!reportFile || !pptFile || !codeFile)}
```

**Regular Assignment:**
```javascript
disabled={isSubmitting || files.length === 0}
```

## 🎯 Submission Guidelines

### For Projects:

```
✓ Report: Must include introduction, methodology, results, and conclusion
✓ Presentation: Should have 10-15 slides covering key project aspects
✓ Code: Include README file with setup instructions
✓ GitHub (Optional): Public repository preferred for open-source projects
✓ Maximum file sizes: Report/PPT (50MB), Code (100MB)
✓ Late submissions may result in grade penalties
```

### For Regular Assignments:

```
✓ Make sure all files are properly named and organized
✓ Include a README file if submitting code projects
✓ Maximum file size: 50MB per file
✓ Late submissions may result in grade penalties
```

## 🔧 Icons Used

| Component | Icon | Import |
|-----------|------|--------|
| Report | FileText | lucide-react |
| Presentation | Presentation | lucide-react |
| Source Code | FileSpreadsheet | lucide-react |
| GitHub | Github | lucide-react |
| Link | LinkIcon | lucide-react |

## 📱 Responsive Design

- **Mobile**: Full width cards, stacked vertically
- **Tablet**: Full width cards with better spacing
- **Desktop**: Optimized layout with max-width container

## 🎨 Color Themes

### Project Components:
- **Report Section**: Red accents (#DC2626)
- **Presentation Section**: Orange accents (#EA580C)
- **Code Section**: Purple accents (#9333EA)
- **GitHub Section**: Gray/Black accents (#111827)

### States:
- **Empty**: Gray border, hover effect
- **Uploaded**: Colored background (50 shade)
- **Hover**: Colored border (400 shade)

## 🚀 User Experience Enhancements

1. **Clear Visual Hierarchy**: Each file type has its own section
2. **Color Coding**: Different colors for different file types
3. **Required Indicators**: Red asterisk (*) for required fields
4. **File Size Display**: Shows uploaded file size
5. **Easy Removal**: X button to remove uploaded files
6. **Validation Messages**: Clear error messages for missing files
7. **Submit Button State**: Disabled until all requirements met
8. **Loading State**: Shows "Submitting..." during submission

## 📝 Data Structure

### Submission Payload for Projects:

```javascript
{
    classId: "CLASS001",
    subjectId: "SUBJ002",
    type: "project",
    reportFile: File,        // PDF/DOC
    presentationFile: File,  // PPT/PPTX
    codeFile: File,         // ZIP
    githubLink: "https://github.com/...",  // Optional
    description: "...",      // Optional
    submittedAt: Date,
    studentId: "STU001"
}
```

### Submission Payload for Regular:

```javascript
{
    classId: "CLASS001",
    subjectId: "SUBJ001",
    type: "assignment",
    files: [File, File, ...],  // Multiple files
    description: "...",         // Optional
    submittedAt: Date,
    studentId: "STU001"
}
```

## 🔍 Testing Checklist

### Project Type:
- [ ] Can upload PDF report
- [ ] Can upload DOC report
- [ ] Can upload PPT presentation
- [ ] Can upload PPTX presentation
- [ ] Can upload ZIP code file
- [ ] Can add GitHub link
- [ ] Can remove each file individually
- [ ] Validation blocks submission without required files
- [ ] Success message shows after submission
- [ ] Redirects to classroom after success

### Regular Assignment:
- [ ] Can drag and drop files
- [ ] Can browse and select multiple files
- [ ] Can remove individual files
- [ ] File list displays correctly
- [ ] Validation works for empty submission
- [ ] Success flow works

## 💡 Future Enhancements

- [ ] File preview before submission
- [ ] Progress bar for large file uploads
- [ ] Multiple GitHub links support
- [ ] Live demo URL field for web projects
- [ ] Video demonstration upload
- [ ] Automatic zip compression for code folders
- [ ] Version history for resubmissions
- [ ] Auto-save draft functionality

---

**Version:** 1.0  
**Last Updated:** October 10, 2025  
**Status:** ✅ Implemented  
**Related Files:**
- `src/pages/student/SubmitWork.jsx`
- `src/pages/student/ClassroomDetail.jsx`
