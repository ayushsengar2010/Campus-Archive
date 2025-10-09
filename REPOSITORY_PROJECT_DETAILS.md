# Repository Project Detail View Feature

## 📋 Overview
This document describes the **Project Detail Modal** feature in the Repository page that displays comprehensive project information when users click on any project card or the "View" button.

## 🎯 Purpose
To provide a detailed, organized view of all project information including:
- Project metadata (year, type, status, course, department)
- Complete description
- GitHub source code links
- All project files (reports, code, documentation)
- Academic information
- Student/submitter details
- Bookmark functionality

## 🔄 User Flow

### Accessing Project Details:

```
Repository Page
   ↓
Click on Project Card OR Click "View" button
   ↓
Project Detail Modal Opens (Full Screen Overlay)
   ↓
View all project information:
   - Header with year, type, status
   - Description
   - GitHub link (if available)
   - Project files with download
   - Tags
   - Academic information
   - Submitter details
   ↓
Download files, visit GitHub, or bookmark
   ↓
Close modal (X button or click outside)
```

## 🛠️ Technical Implementation

### 1. State Management

**New State Variable:**
```javascript
const [selectedProject, setSelectedProject] = useState(null);
```

This stores the currently selected project for the detail modal.

### 2. Modal Trigger

**Grid View - Card Click:**
```javascript
<button 
    onClick={(e) => {
        e.stopPropagation();
        setSelectedProject(item);
    }}
    className="flex items-center space-x-2..."
>
    <Eye className="w-4 h-4" />
    <span>View</span>
</button>
```

**List View - Eye Icon Click:**
```javascript
<button 
    onClick={(e) => {
        e.stopPropagation();
        setSelectedProject(item);
    }}
    className="p-2 text-gray-400 hover:text-indigo-600..."
    title="View details"
>
    <Eye className="w-4 h-4" />
</button>
```

### 3. Helper Functions

**File Icon Detection:**
```javascript
const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
        case 'pdf': return <FileText className="h-5 w-5 text-red-600" />;
        case 'zip': return <Folder className="h-5 w-5 text-yellow-600" />;
        case 'doc': return <FileText className="h-5 w-5 text-blue-600" />;
        case 'java': return <Code className="h-5 w-5 text-purple-600" />;
        // ... more types
    }
};
```

**File Size Formatting:**
```javascript
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
```

**Date Formatting:**
```javascript
const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
};
```

## 📊 Modal Structure

### Header Section (Gradient Background)
```
┌─────────────────────────────────────────────────────────┐
│ [Year] [Type] [Status]                           [X]    │
│                                                          │
│ Project Title Here                                       │
│ 👤 Student Name • Department • Course                   │
│                                                          │
│ [📅 Uploaded] [⏰ Updated] [✓ Status]                   │
└─────────────────────────────────────────────────────────┘
```

### Body Sections:

1. **Project Description**
   - Full text description

2. **Source Code** (if GitHub URL available)
   - Button linking to GitHub repository

3. **Tags**
   - Hashtag-style tags (e.g., #React, #NodeJS)

4. **Project Files**
   - Grid layout of downloadable files
   - Each file shows:
     - Icon (based on file type)
     - Filename
     - File size
     - Download icon on hover

5. **Academic Information**
   - Department
   - Course
   - Academic Year
   - Project Type
   - (4-column grid layout)

6. **Submitted By**
   - Student avatar
   - Student name
   - Student email

7. **Bookmark Button**
   - Toggle bookmark status
   - Visual feedback

## 🎨 Visual Design

### Color Scheme:

**Header:**
- Background: Gradient from indigo-600 to purple-700
- Text: White
- Badges: Semi-transparent white background

**Body:**
- Background: White
- Text: Gray-900 (headings), Gray-700 (body)
- Section Headers: Icon with colored accent
- Cards: Gray-50 background with border

**File Icons:**
- PDF: Red-600
- ZIP/Archive: Yellow-600
- Documents: Blue-600
- Presentations: Orange-600
- Spreadsheets: Green-600
- Code files: Purple-600
- Generic: Gray-600

### Spacing:
- Modal padding: 6 (1.5rem)
- Section spacing: 6 (1.5rem)
- Grid gap: 3-4 (0.75-1rem)

## 📁 File Type Support

| Extension | Icon | Color | Description |
|-----------|------|-------|-------------|
| .pdf | FileText | Red | PDF documents |
| .zip, .rar, .7z | Folder | Yellow | Compressed archives |
| .doc, .docx | FileText | Blue | Word documents |
| .ppt, .pptx | FileText | Orange | PowerPoint presentations |
| .xls, .xlsx, .csv | FileText | Green | Spreadsheets |
| .java, .py, .js, .cpp, .c | Code | Purple | Source code files |
| Others | FileText | Gray | Generic files |

## 🔧 Props/Data Structure

### Project Object Expected Structure:
```javascript
{
    id: "string",
    title: "string",
    description: "string",
    type: "project|research|assignment|proposal",
    status: "approved|pending|rejected|resubmit",
    githubUrl: "string (optional)",
    tags: ["string", "string"],
    files: [
        {
            name: "string",
            size: number (bytes),
            url: "string"
        }
    ],
    metadata: {
        department: "string",
        course: "string",
        year: number
    },
    submitter: {
        name: "string",
        email: "string"
    },
    createdAt: "date",
    updatedAt: "date"
}
```

## 🎯 User Interactions

### 1. View Details
- Click project card or "View" button
- Modal slides in with fade overlay

### 2. Close Modal
- Click X button in header
- Click outside modal area (on dark overlay)
- ESC key (future enhancement)

### 3. Download Files
- Click on any file card
- Triggers download of that specific file

### 4. Visit GitHub
- Click "View on GitHub" button
- Opens in new tab

### 5. Bookmark
- Click bookmark button
- Toggle between bookmarked/not bookmarked state
- Visual feedback with color change

## 📱 Responsive Design

### Desktop (lg and above):
- Modal: max-width 6xl (72rem)
- 2-column grid for files
- Full information display

### Tablet (md):
- Modal: max-width 4xl (56rem)
- 2-column grid for files
- Adjusted spacing

### Mobile:
- Modal: Full width with padding
- 1-column layout for files
- Scrollable content
- Sticky header

## ⚡ Performance Considerations

1. **Lazy Loading**: Modal only renders when selectedProject is not null
2. **Event Propagation**: stopPropagation() prevents card click when clicking buttons
3. **Optimized Icons**: Lucide React icons are tree-shakeable
4. **Conditional Rendering**: Only shows sections with data

## 🔍 Features

### Current Features:
✅ Detailed project information display
✅ File listing with type-based icons
✅ GitHub integration
✅ Bookmark functionality
✅ Responsive design
✅ Date formatting
✅ File size formatting
✅ Status badges
✅ Tag display

### Future Enhancements:
- [ ] File preview (PDF viewer)
- [ ] Image gallery for screenshots
- [ ] Comments/Reviews section
- [ ] Related projects
- [ ] Share functionality
- [ ] Print option
- [ ] Version history
- [ ] Download all files (zip)

## 🎨 Styling Classes

### Modal Container:
```css
fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto
```

### Modal Content:
```css
bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto
```

### Sticky Header:
```css
sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 z-10
```

## 🐛 Edge Cases Handled

1. **No Files**: Doesn't show files section if array is empty
2. **No GitHub URL**: Doesn't show GitHub button
3. **No Tags**: Doesn't show tags section
4. **Missing Metadata**: Shows "Not specified" or "N/A"
5. **Unknown File Size**: Shows "Unknown size"
6. **Missing Submitter**: Shows "Unknown Student"

## 📚 Related Files

**Modified:**
- `src/pages/Repository.jsx` - Added modal and helper functions

**Uses Components:**
- Lucide React Icons (Eye, Download, X, GitBranch, Code, Folder, Tag, etc.)
- AppLayout wrapper

**Integrates With:**
- useRepositoryData hook
- Bookmark system
- File download system (future)

## 💡 Usage Example

### Opening Modal:
```javascript
// From grid view
<button onClick={() => setSelectedProject(item)}>
    View Details
</button>

// From list view
<Eye onClick={() => setSelectedProject(item)} />
```

### Closing Modal:
```javascript
// X button
<button onClick={() => setSelectedProject(null)}>
    <X className="h-6 w-6" />
</button>

// Conditional render
{selectedProject && (
    <div className="modal">
        {/* Modal content */}
    </div>
)}
```

## 🎓 Benefits

### For Students:
- See their work showcased professionally
- Easy access to project files
- Portfolio building

### For Faculty:
- Quick review of project details
- Access to all submission files
- Academic information at a glance

### For Researchers:
- Discover relevant projects
- Download project files
- Find collaboration opportunities

### For Visitors:
- Explore student work
- See program quality
- Access open projects

---

**Version:** 1.0  
**Last Updated:** October 10, 2025  
**Status:** ✅ Implemented  
**Next Steps:** Add file preview and download functionality
