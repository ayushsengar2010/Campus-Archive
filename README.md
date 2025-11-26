# 🎓 Campus Archive - Full-Stack Academic Platform

A comprehensive academic repository and collaboration platform with **React 18 frontend** and **Node.js + Express + MongoDB backend**. Designed for modern educational institutions featuring role-based dashboards for students, faculty, researchers, and administrators.

## 🚀 **Full-Stack Integration Complete!**

✅ **REST API** with Node.js + Express  
✅ **MongoDB Database** with Mongoose ODM  
✅ **JWT Authentication** & Role-Based Access Control  
✅ **File Upload System** with Multer  
✅ **Real-time Notifications System**  
✅ **Email Service Integration**  
✅ **Rate Limiting & Security**  
✅ **Database Seeding Scripts**  

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

### Backend (Fully Integrated! 🎉)
- **Node.js** - JavaScript runtime
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Secure authentication with jsonwebtoken
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Express Validator** - Request validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Rate Limiting** - API protection with express-rate-limit
- **Nodemailer** - Email notifications

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
- **Nodemon** - Auto-restart for backend development
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - Or use MongoDB Atlas (cloud database)
- **npm** or **yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayushsengar2010/Campus-Archive.git
   cd Campus-Archive
   ```

2. **Start MongoDB**
   ```bash
   # Windows (Run as Administrator)
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file with your configuration
   # Example:
   # PORT=5000
   # MONGODB_URI=mongodb://localhost:27017/campus-archive
   # JWT_SECRET=your_jwt_secret_key_here
   # JWT_EXPIRE=7d
   # NODE_ENV=development
   
   # Seed database with sample data (optional)
   npm run seed
   
   # Start backend server
   npm run dev
   ```
   Backend runs on: `http://localhost:5000`

4. **Setup Frontend** (in new terminal)
   ```bash
   cd academic-repository-platform
   npm install
   npm run dev
   ```
   Frontend runs on: `http://localhost:5173`

5. **Open your browser**
   
   Navigate to [http://localhost:5173](http://localhost:5173)

### 🎭 Demo Accounts

After seeding the database with `npm run seed` in the backend, you can use these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| **Student** | student@example.com | password123 |
| **Faculty** | faculty@example.com | password123 |
| **Admin** | admin@example.com | password123 |
| **Researcher** | researcher@example.com | password123 |

Or register your own account at [http://localhost:5173/register](http://localhost:5173/register)

## 📜 Available Scripts

### Frontend Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

### Backend Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with nodemon (hot reload) |
| `npm start` | Start production server |
| `npm run seed` | Seed database with sample data |
| `npm run clear` | Clear test data from database |

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
CampusArchive/
├── academic-repository-platform/  # Frontend (React + Vite)
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── common/          # Shared components
│   │   │   ├── forms/           # Form components
│   │   │   ├── layout/          # Layout components
│   │   │   │   ├── AppLayout.jsx
│   │   │   │   ├── Breadcrumb.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   └── ui/              # UI components
│   │   ├── constants/           # Application constants
│   │   ├── contexts/            # React contexts
│   │   │   ├── AppContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useAuth.jsx
│   │   │   ├── useForm.js
│   │   │   ├── useNotifications.js
│   │   │   └── useRepositoryData.js
│   │   ├── pages/               # Route pages
│   │   │   ├── admin/           # Admin pages
│   │   │   ├── auth/            # Authentication pages
│   │   │   ├── faculty/         # Faculty pages
│   │   │   ├── researcher/      # Researcher pages
│   │   │   └── student/         # Student pages
│   │   ├── services/            # API services
│   │   │   ├── apiService.js
│   │   │   ├── emailTemplates.js
│   │   │   ├── notificationService.js
│   │   │   └── reportService.js
│   │   ├── types/               # Type definitions
│   │   ├── utils/               # Utility functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/                       # Backend (Node.js + Express)
│   ├── controllers/              # Request handlers
│   │   ├── assignment.controller.js
│   │   ├── auth.controller.js
│   │   ├── classroom.controller.js
│   │   ├── notification.controller.js
│   │   ├── repository.controller.js
│   │   ├── submission.controller.js
│   │   └── user.controller.js
│   ├── middleware/               # Express middleware
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── rateLimiter.middleware.js
│   │   ├── upload.middleware.js
│   │   └── validation.middleware.js
│   ├── models/                   # Mongoose models
│   │   ├── Assignment.model.js
│   │   ├── Classroom.model.js
│   │   ├── Notification.model.js
│   │   ├── Repository.model.js
│   │   ├── Submission.model.js
│   │   └── User.model.js
│   ├── routes/                   # API routes
│   │   ├── assignment.routes.js
│   │   ├── auth.routes.js
│   │   ├── classroom.routes.js
│   │   ├── notification.routes.js
│   │   ├── repository.routes.js
│   │   ├── submission.routes.js
│   │   └── user.routes.js
│   ├── scripts/                  # Utility scripts
│   │   ├── clearTestData.js
│   │   └── seedDatabase.js
│   ├── uploads/                  # File upload directories
│   │   ├── assignments/
│   │   ├── avatars/
│   │   ├── feedback/
│   │   ├── repository/
│   │   └── submissions/
│   ├── server.js                 # Express server
│   └── package.json
│
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/campus-archive
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-archive

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_PATH=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables

Create a `.env` file in the `academic-repository-platform/` directory (optional):

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

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

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updateprofile` - Update user profile

### User Management
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Classroom Management
- `GET /api/classrooms` - Get all classrooms
- `POST /api/classrooms` - Create classroom (Faculty)
- `GET /api/classrooms/:id` - Get classroom details
- `PUT /api/classrooms/:id` - Update classroom
- `DELETE /api/classrooms/:id` - Delete classroom
- `POST /api/classrooms/:id/join` - Join classroom (Student)

### Assignment Management
- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Create assignment (Faculty)
- `GET /api/assignments/:id` - Get assignment details
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment

### Submission Management
- `GET /api/submissions` - Get all submissions
- `POST /api/submissions` - Submit assignment (Student)
- `GET /api/submissions/:id` - Get submission details
- `PUT /api/submissions/:id` - Update submission status (Faculty)
- `DELETE /api/submissions/:id` - Delete submission

### Repository Management
- `GET /api/repository` - Get all repository items (Public)
- `POST /api/repository` - Add to repository (Faculty)
- `GET /api/repository/:id` - Get repository item details
- `DELETE /api/repository/:id` - Remove from repository (Admin)

### Notification Management
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

For detailed API documentation with request/response examples, see `/backend/README.md`

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt with salt rounds
- **Input Validation** - Express-validator for all inputs
- **Rate Limiting** - Protection against brute force attacks
- **CORS** - Configured cross-origin resource sharing
- **Helmet** - Security headers for Express
- **File Upload Validation** - Size and type restrictions
- **Role-Based Access Control** - Protected routes by user role
- **Error Handling** - Secure error messages (no sensitive data exposure)

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd academic-repository-platform
npm run build
# Deploy the 'dist' folder
```

### Backend Deployment (Heroku/Railway/Render)
```bash
cd backend
# Set environment variables on your platform
# Deploy using Git or platform CLI
```

### Database (MongoDB Atlas)
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Whitelist your IP address
3. Update `MONGODB_URI` in your `.env` file

## 🧪 Testing

### Running the Seed Script
```bash
cd backend
npm run seed
```
This creates:
- 4 demo users (student, faculty, admin, researcher)
- 2 sample classrooms
- 5 sample assignments
- 10 sample submissions
- 5 repository items

### Clearing Test Data
```bash
cd backend
npm run clear
```

## 📚 Additional Documentation

- **[Backend API Documentation](./backend/README.md)** - Complete API reference
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

### ✅ Phase 6: Backend Integration (Completed)
- [x] REST API with Express.js
- [x] MongoDB database setup
- [x] User authentication & authorization
- [x] File upload endpoints
- [x] Classroom management APIs
- [x] Assignment & submission APIs
- [x] Notification system APIs
- [x] Repository management APIs
- [x] Database seeding scripts
- [x] Error handling & validation

### 🔄 Phase 7: Advanced Features (In Progress)
- [x] Email notification system
- [x] Rate limiting & security
- [ ] Real-time updates with WebSocket
- [ ] Advanced analytics dashboard
- [ ] PDF report generation
- [ ] Version control for submissions
- [ ] Plagiarism detection integration
- [ ] Cloud storage integration (AWS S3/Azure)

### 📋 Phase 8: Future Enhancements
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

## 🐛 Known Issues & Limitations

- File uploads limited to 10MB (configurable in backend)
- Email notifications require SMTP configuration
- No WebSocket integration yet (real-time updates pending)
- Plagiarism detection not implemented
- Mobile app not available (web-responsive only)

## 📊 Project Statistics

- **Total Components**: 30+
- **Pages**: 20+
- **API Endpoints**: 40+
- **Custom Hooks**: 4
- **Backend Controllers**: 7
- **Database Models**: 6
- **Middleware Functions**: 5
- **Demo Users**: 4 (Student, Faculty, Admin, Researcher)
- **Supported File Types**: PDF, DOC, DOCX, PPT, PPTX, ZIP, RAR, JPG, PNG, GIF
- **Lines of Code**: ~10,000+

## 🎓 Educational Value

This project demonstrates:
- **Full-Stack Development** - Complete MERN stack implementation
- **RESTful API Design** - Proper endpoint structure and HTTP methods
- **Database Design** - MongoDB schema design with relationships
- **Authentication & Authorization** - JWT-based security with role-based access
- **File Upload Handling** - Multer integration with validation
- **Modern React Patterns** - Hooks, context API, and custom hooks
- **Component Architecture** - Reusable, modular component design
- **State Management** - Context API and hooks for global state
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Form Handling** - Validation and error handling
- **Error Handling** - Centralized error middleware
- **Security Best Practices** - Helmet, CORS, rate limiting
- **Code Organization** - Clean separation of concerns
- **API Documentation** - Well-documented endpoints

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

## 👨‍💻 Author & Contact

**Ayush Sengar**
- GitHub: [@ayushsengar2010](https://github.com/ayushsengar2010)
- Repository: [Campus-Archive](https://github.com/ayushsengar2010/Campus-Archive)
- Email: Contact via GitHub

## 🙏 Acknowledgments

- **React Team** - For the amazing React library
- **Vite Team** - For the blazing fast build tool
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide Icons** - For the beautiful icon set
- **MongoDB** - For the flexible NoSQL database
- **Express.js** - For the minimal web framework
- **Open Source Community** - For inspiration and resources

---

<div align="center">

**⭐ If you find this project helpful, please give it a star! ⭐**

![GitHub stars](https://img.shields.io/github/stars/ayushsengar2010/Campus-Archive?style=social)
![GitHub forks](https://img.shields.io/github/forks/ayushsengar2010/Campus-Archive?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/ayushsengar2010/Campus-Archive?style=social)

Made with ❤️ by Ayush Sengar

[⬆ Back to Top](#-campus-archive---full-stack-academic-platform)

</div>
