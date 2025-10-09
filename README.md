# 🎓 Campus Archive

A comprehensive academic repository and collaboration platform designed for modern educational institutions. Built with React 18 and Tailwind CSS, featuring role-based dashboards for students, faculty, researchers, and administrators.

## ✨ Key Features

### 🔐 Authentication & Security
- ✅ **JWT-based Authentication** - Secure login/register with role-based access control
- ✅ **Protected Routes** - Role-specific route protection and navigation
- ✅ **Session Management** - Persistent authentication with localStorage

### 👨‍🎓 Student Features
- ✅ **Google Classroom-Style Dashboard** - Modern interface with stats and recent activity
- ✅ **Smart Project Submissions** - Structured uploads for projects (Report + PPT + Code + GitHub)
- ✅ **Flexible Assignment Submissions** - Drag-and-drop multi-file uploads for regular assignments
- ✅ **Submission Tracking** - Real-time status updates and feedback viewing
- ✅ **Classroom Management** - Join and manage multiple classrooms
- ✅ **Submission History** - Detailed view of all past submissions with feedback

### 👨‍🏫 Faculty Features
- ✅ **Comprehensive Dashboard** - Version tracking, pending reviews, and quick actions
- ✅ **Classroom Management** - Create and manage multiple classrooms
- ✅ **Submission Review System** - Accept/reject with detailed feedback
- ✅ **Repository Upload** - Upload approved projects to public repository
- ✅ **Analytics & Reporting** - Track student performance and submission trends
- ✅ **Quick Review Interface** - Prioritized review queue with version control

### 📚 Repository System
- ✅ **Public Project Repository** - Showcase of approved academic projects
- ✅ **Project Detail Views** - Complete project information with files and GitHub links
- ✅ **Advanced Filtering** - Search by year, category, type, and keywords
- ✅ **Grid/List Views** - Flexible display options for browsing
- ✅ **Bookmark System** - Save favorite projects with localStorage persistence
- ✅ **File Type Indicators** - Visual icons for different document types

### 🎨 UI/UX Excellence
- ✅ **Responsive Design** - Seamless experience across desktop, tablet, and mobile
- ✅ **Theme Support** - Light/Dark mode with role-based color schemes
- ✅ **Modern Components** - Beautiful UI with Tailwind CSS and Lucide icons
- ✅ **Real-time Notifications** - Dropdown notifications with unread indicators
- ✅ **Advanced Data Tables** - Search, sort, filter, and pagination
- ✅ **Loading States** - Smooth loading spinners and skeleton screens

### 📊 Advanced Features
- ✅ **File Upload System** - Drag-and-drop with progress tracking and validation
- ✅ **Feedback Modals** - Rich text editing with file attachments
- ✅ **Duplicate Detection** - Smart detection of similar submissions
- ✅ **Report Generation** - Customizable report templates
- ✅ **Audit Logs** - Complete activity tracking for administrators
- ✅ **Email Notifications** - Automated email templates for key events

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Lightning-fast build tool and dev server
- **React Router v6** - Client-side routing with protected routes
- **Tailwind CSS** - Utility-first CSS framework with custom theme
- **Lucide React** - Beautiful, consistent icon library

### State Management & Data
- **React Context API** - Theme and authentication state
- **Custom Hooks** - Reusable logic for auth, notifications, repository data
- **localStorage** - Persistent bookmarks and user preferences

### UI Components & Tools
- **Drag & Drop** - Native file upload with visual feedback
- **Modal System** - Accessible modals with keyboard navigation
- **Form Validation** - Client-side validation for all forms
- **Responsive Design** - Mobile-first approach with Tailwind breakpoints

### Development Tools
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing and optimization
- **Git** - Version control with master branch

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayushsengar2010/Campus-Archive.git
   cd Campus-Archive/academic-repository-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:5173](http://localhost:5173)

### 🎭 Demo Accounts

Test the platform with these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| **Student** | student@university.edu | password123 |
| **Faculty** | faculty@university.edu | password123 |
| **Admin** | admin@university.edu | password123 |
| **Researcher** | researcher@university.edu | password123 |

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Automatically fix ESLint issues |

## 🎯 Key User Workflows

### For Students

1. **Submit Regular Assignment**
   - Navigate to Classroom → Select Assignment
   - Drag & drop files or browse to upload
   - Add description and submit

2. **Submit Project (Structured)**
   - Navigate to Classroom → Select Project
   - Upload Report (PDF/DOC) - Required ⭐
   - Upload Presentation (PPT/PPTX) - Required ⭐
   - Upload Source Code (ZIP) - Required ⭐
   - Add GitHub link (Optional)
   - Add description and submit

3. **View Feedback**
   - Go to Submissions page
   - Click on any submission to view detailed feedback
   - Download feedback attachments if available

### For Faculty

1. **Review Submissions**
   - Dashboard shows pending reviews
   - Click "Quick Review" to prioritize urgent items
   - View submission details, files, and student info
   - Provide feedback with rich text and attachments

2. **Accept & Upload to Repository**
   - Review project submissions
   - Select "Accept" with feedback
   - Check "Upload to Repository" for approved projects
   - Project appears in public Repository page

3. **Manage Classrooms**
   - Create new classrooms
   - Add assignments/projects with deadlines
   - Track submission statistics
   - Generate analytics reports

### For Repository Visitors

1. **Browse Projects**
   - Visit Repository page (public access)
   - Filter by year, category, or type
   - Switch between grid and list views
   - Search by keywords

2. **View Project Details**
   - Click on any project card
   - View complete project information
   - Access files (Report, PPT, Code)
   - Visit GitHub repository link
   - Bookmark favorite projects

## 🎨 Design Features

### Color Themes
- **Student**: Blue accents (#3B82F6)
- **Faculty**: Green accents (#10B981)
- **Admin**: Purple accents (#8B5CF6)
- **Researcher**: Orange accents (#F59E0B)

### File Type Colors
- **Report**: Red (#DC2626)
- **Presentation**: Orange (#EA580C)
- **Code**: Purple (#9333EA)
- **Documents**: Gray (#6B7280)

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 📁 Project Structure

```
academic-repository-platform/
├── public/                    # Static assets
│   ├── logo.svg              # Application logo
│   └── vite.svg              # Vite logo
├── src/
│   ├── components/           # Reusable components
│   │   ├── common/          # Shared components
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── forms/           # Form components (future)
│   │   ├── layout/          # Layout components
│   │   │   ├── AppLayout.jsx      # Main layout wrapper
│   │   │   ├── Breadcrumb.jsx     # Navigation breadcrumbs
│   │   │   ├── Header.jsx         # Top header with search
│   │   │   └── Sidebar.jsx        # Role-based sidebar
│   │   └── ui/              # UI components
│   │       ├── DashboardCard.jsx
│   │       ├── DataTable.jsx
│   │       ├── DuplicateWarning.jsx
│   │       ├── FeedbackModal.jsx
│   │       ├── FileUpload.jsx
│   │       ├── Modal.jsx
│   │       ├── ReportPreview.jsx
│   │       ├── ReportTemplateEditor.jsx
│   │       ├── SubmissionDetailModal.jsx  # Faculty review modal
│   │       └── ThemeToggle.jsx
│   ├── constants/           # Application constants
│   │   └── index.js        # Routes, roles, status constants
│   ├── contexts/           # React contexts
│   │   └── ThemeContext.jsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.jsx           # Authentication hook
│   │   ├── useNotifications.js   # Notifications hook
│   │   └── useRepositoryData.js  # Repository data hook
│   ├── pages/              # Route pages
│   │   ├── Repository.jsx        # Public repository page
│   │   ├── admin/          # Admin dashboard pages
│   │   │   ├── AuditLogs.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DeadlineManagement.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── UserManagement.jsx
│   │   ├── auth/           # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── faculty/        # Faculty dashboard pages
│   │   │   ├── Analytics.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ClassroomDetail.jsx
│   │   ├── researcher/     # Researcher pages
│   │   │   ├── Collaborations.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── UploadPaper.jsx
│   │   └── student/        # Student pages
│   │       ├── Classroom.jsx
│   │       ├── ClassroomDetail.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Submissions.jsx
│   │       ├── SubmitProject.jsx
│   │       └── SubmitWork.jsx    # Enhanced with project uploads
│   ├── services/           # Service layer
│   │   ├── apiService.js
│   │   ├── emailTemplates.js
│   │   ├── notificationService.js
│   │   └── reportService.js
│   ├── types/              # Type definitions
│   │   └── index.js
│   ├── utils/              # Utility functions
│   │   ├── auth.js
│   │   ├── cn.js
│   │   └── duplicateDetection.js
│   ├── App.jsx             # Main app component with routing
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
├── .gitignore
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML entry point
├── package.json            # Dependencies
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.js          # Vite configuration
├── README.md               # This file
├── SIMPLIFICATION_SUMMARY.md
├── REPOSITORY_UPLOAD_FEATURE.md
└── PROJECT_SUBMISSION_FEATURE.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory (optional for development):

```env
# API Configuration (Future)
VITE_API_BASE_URL=http://localhost:3000/api

# Application Info
VITE_APP_NAME=Campus Archive
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
```

### Tailwind Configuration

The project uses a custom Tailwind configuration with role-based themes:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      student: { /* blue shades */ },
      faculty: { /* green shades */ },
      admin: { /* purple shades */ },
      researcher: { /* orange shades */ }
    }
  }
}
```

## 📚 Documentation

- **[Repository Upload Feature](./REPOSITORY_UPLOAD_FEATURE.md)** - How faculty upload approved projects to repository
- **[Project Submission Feature](./PROJECT_SUBMISSION_FEATURE.md)** - Structured project submissions for students
- **[Simplification Summary](./SIMPLIFICATION_SUMMARY.md)** - Code simplification and optimization history

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Follow code style**
   - Use meaningful variable/function names
   - Add comments for complex logic
   - Keep components small and focused
4. **Write commit messages**
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug in component"
   git commit -m "docs: update README"
   ```
5. **Test your changes**
   - Test on multiple screen sizes
   - Test all user roles
   - Verify console has no errors
6. **Submit a pull request**

### Code Style Guidelines

- Use **functional components** with hooks
- Follow **React best practices**
- Use **Tailwind CSS** for styling (avoid inline styles)
- Keep **components reusable** and modular
- Add **PropTypes** or comments for component props
- Use **meaningful names** for files and variables

## 📈 Development Roadmap

### ✅ Phase 1: Core Infrastructure (Completed)
- [x] Project setup with React 18 + Vite
- [x] Tailwind CSS configuration with custom themes
- [x] ESLint and code quality setup
- [x] Routing with React Router v6
- [x] Authentication system with JWT
- [x] Protected routes and role-based access

### ✅ Phase 2: Layout & Navigation (Completed)
- [x] Responsive sidebar with role-based menus
- [x] Header with search and notifications
- [x] Breadcrumb navigation
- [x] Theme toggle (Light/Dark mode)
- [x] Mobile-responsive design

### ✅ Phase 3: Student Features (Completed)
- [x] Student dashboard with stats
- [x] Classroom listing and details
- [x] Regular assignment submissions (drag & drop)
- [x] **Project submissions with structured uploads** 🆕
- [x] Submission tracking and history
- [x] Feedback viewing system

### ✅ Phase 4: Faculty Features (Completed)
- [x] Faculty dashboard with version tracking
- [x] Classroom management
- [x] **Submission review with repository upload** 🆕
- [x] Feedback system with file attachments
- [x] Quick review interface
- [x] Analytics and reports

### ✅ Phase 5: Repository System (Completed)
- [x] **Public repository page** 🆕
- [x] **Project detail modal with files** 🆕
- [x] **Grid and list views** 🆕
- [x] **Advanced filtering and search** 🆕
- [x] **Bookmark system** 🆕
- [x] **GitHub integration links** 🆕

### 🔄 Phase 6: Advanced Features (In Progress)
- [ ] Backend API integration
- [ ] Real database integration
- [ ] File storage system (AWS S3 / Azure Blob)
- [ ] Email notification system
- [ ] Advanced analytics dashboard
- [ ] PDF report generation
- [ ] Version control for submissions
- [ ] Plagiarism detection

### 📋 Phase 7: Future Enhancements
- [ ] Real-time collaboration features
- [ ] Video submission support
- [ ] Live code editor for coding assignments
- [ ] Peer review system
- [ ] Discussion forums
- [ ] Calendar integration
- [ ] Mobile app (React Native)
- [ ] AI-powered feedback suggestions
- [ ] Blockchain-based certificates
- [ ] Multi-language support

## 🐛 Known Issues

- Mock data used for development (backend integration pending)
- File uploads are client-side only (no actual server storage)
- Authentication tokens are stored in localStorage (implement httpOnly cookies for production)
- No real-time updates (implement WebSocket for live features)

## 📊 Project Statistics

- **Total Components**: 25+
- **Pages**: 20+
- **Custom Hooks**: 3
- **Mock Projects**: 8
- **Demo Users**: 4 (Student, Faculty, Admin, Researcher)
- **Supported File Types**: PDF, DOC, DOCX, PPT, PPTX, ZIP, RAR, JPG, PNG, GIF
- **Lines of Code**: ~5,000+

## 🎓 Educational Value

This project demonstrates:
- Modern React development patterns
- Component-based architecture
- State management with hooks and context
- Responsive design with Tailwind CSS
- Form handling and validation
- File upload functionality
- Role-based access control
- Routing and navigation
- UI/UX best practices
- Code organization and project structure

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Ayush Sengar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Author

**Ayush Sengar**
- GitHub: [@ayushsengar2010](https://github.com/ayushsengar2010)
- Repository: [Campus-Archive](https://github.com/ayushsengar2010/Campus-Archive)

## � Acknowledgments

- **React Team** - For the amazing React library
- **Vite Team** - For the blazing fast build tool
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide Icons** - For the beautiful icon set
- **Open Source Community** - For inspiration and resources

---

<div align="center">

**⭐ If you find this project helpful, please give it a star! ⭐**

Made with ❤️ by Ayush Sengar

</div>