# 🚀 Campus Archive - Backend API

Complete Node.js + Express + MongoDB backend for the Campus Archive academic repository platform.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [File Upload](#file-upload)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)

## ✨ Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Student, Faculty, Admin, Researcher roles
- **File Upload System** - Support for assignments, submissions, and repository files
- **Classroom Management** - Create, join, and manage classrooms
- **Assignment System** - Create and manage assignments with deadlines
- **Submission Tracking** - Submit, review, and grade assignments
- **Repository System** - Public academic project repository
- **Notification System** - Real-time user notifications
- **Rate Limiting** - API protection against abuse
- **Input Validation** - Comprehensive request validation
- **Error Handling** - Centralized error management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **File Upload**: Multer
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting

## 📦 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - Or use MongoDB Atlas (cloud database)
- **npm** or **yarn** package manager

## 🔧 Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see below)

## 🌍 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/campus-archive
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-archive

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### Important Notes:

- **JWT_SECRET**: Change this to a strong, random string in production
- **MONGODB_URI**: Update with your MongoDB connection string
- **CORS_ORIGIN**: Set to your frontend URL
- **MAX_FILE_SIZE**: File size limit in bytes (default: 10MB)

## 🚀 Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

### Health Check
Visit `http://localhost:5000/health` to verify the server is running.

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| POST | `/auth/logout` | Logout user | Private |
| GET | `/auth/me` | Get current user | Private |
| GET | `/auth/verify` | Verify token | Private |
| PUT | `/auth/profile` | Update profile | Private |
| PUT | `/auth/change-password` | Change password | Private |

### User Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | Get all users | Admin |
| GET | `/users/:id` | Get user by ID | Private |
| PUT | `/users/:id` | Update user | Admin |
| DELETE | `/users/:id` | Delete user | Admin |
| GET | `/users/stats/overview` | Get user statistics | Admin |
| PATCH | `/users/:id/status` | Toggle user status | Admin |
| GET | `/users/students/by-department` | Get students by dept | Faculty/Admin |

### Classroom Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/classrooms` | Create classroom | Faculty |
| GET | `/classrooms` | Get all classrooms | Private |
| GET | `/classrooms/:id` | Get classroom by ID | Private |
| PUT | `/classrooms/:id` | Update classroom | Faculty |
| DELETE | `/classrooms/:id` | Delete classroom | Faculty |
| POST | `/classrooms/join` | Join classroom | Student |
| POST | `/classrooms/:id/leave` | Leave classroom | Student |
| DELETE | `/classrooms/:id/students/:studentId` | Remove student | Faculty |

### Assignment Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/assignments` | Create assignment | Faculty |
| GET | `/assignments` | Get all assignments | Private |
| GET | `/assignments/:id` | Get assignment by ID | Private |
| PUT | `/assignments/:id` | Update assignment | Faculty |
| DELETE | `/assignments/:id` | Delete assignment | Faculty |
| GET | `/assignments/classroom/:classroomId` | Get by classroom | Private |

### Submission Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/submissions` | Create submission | Student |
| GET | `/submissions` | Get all submissions | Private |
| GET | `/submissions/:id` | Get submission by ID | Private |
| PUT | `/submissions/:id` | Update submission | Student |
| DELETE | `/submissions/:id` | Delete submission | Student |
| PUT | `/submissions/:id/review` | Review submission | Faculty |

### Repository Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/repository` | Get all projects | Public |
| GET | `/repository/featured` | Get featured projects | Public |
| GET | `/repository/:id` | Get project by ID | Public |
| POST | `/repository` | Create project | Researcher/Admin |
| PUT | `/repository/:id` | Update project | Owner/Admin |
| DELETE | `/repository/:id` | Delete project | Faculty/Admin |
| POST | `/repository/:id/bookmark` | Toggle bookmark | Private |
| GET | `/repository/bookmarks/my` | Get my bookmarks | Private |
| POST | `/repository/:id/download` | Increment download | Public |

### Notification Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/notifications` | Get all notifications | Private |
| GET | `/notifications/:id` | Get notification by ID | Private |
| GET | `/notifications/unread/count` | Get unread count | Private |
| PUT | `/notifications/:id/read` | Mark as read | Private |
| PUT | `/notifications/read-all` | Mark all as read | Private |
| DELETE | `/notifications/:id` | Delete notification | Private |
| DELETE | `/notifications/clear-read` | Clear read notifications | Private |
| POST | `/notifications` | Create notification | Admin |

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['student', 'faculty', 'admin', 'researcher'],
  studentId: String,
  department: String,
  semester: Number,
  phone: String,
  avatar: String,
  isActive: Boolean,
  isEmailVerified: Boolean,
  lastLogin: Date
}
```

### Classroom Model
```javascript
{
  name: String,
  code: String (unique),
  subject: String,
  section: String,
  description: String,
  faculty: ObjectId (User),
  students: [ObjectId (User)],
  semester: String,
  academicYear: String,
  isActive: Boolean,
  settings: Object
}
```

### Assignment Model
```javascript
{
  title: String,
  description: String,
  classroom: ObjectId (Classroom),
  faculty: ObjectId (User),
  type: Enum ['assignment', 'project', 'quiz', 'lab', 'presentation'],
  isStructured: Boolean,
  dueDate: Date,
  maxMarks: Number,
  instructions: String,
  attachments: [Object],
  allowLateSubmission: Boolean,
  isPublished: Boolean
}
```

### Submission Model
```javascript
{
  assignment: ObjectId (Assignment),
  student: ObjectId (User),
  classroom: ObjectId (Classroom),
  description: String,
  files: [Object],
  githubLink: String,
  status: Enum ['pending', 'submitted', 'reviewed', 'accepted', 'rejected', 'resubmit'],
  marks: Number,
  feedback: String,
  reviewedBy: ObjectId (User),
  isLate: Boolean,
  version: Number
}
```

### Repository Model
```javascript
{
  title: String,
  description: String,
  student: ObjectId (User),
  faculty: ObjectId (User),
  category: String,
  type: String,
  academicYear: String,
  semester: String,
  files: {
    report: Object,
    presentation: Object,
    code: Object
  },
  githubLink: String,
  tags: [String],
  views: Number,
  downloads: Number,
  bookmarks: [ObjectId (User)],
  isPublic: Boolean
}
```

## 🔐 Authentication

### Registration
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@university.edu",
  "password": "password123",
  "role": "student",
  "studentId": "2021001",
  "department": "Computer Science",
  "semester": 6
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@university.edu",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Using the Token

Include the token in the Authorization header:
```bash
Authorization: Bearer <your-token-here>
```

## 📤 File Upload

### Supported File Types
- Documents: `.pdf`, `.doc`, `.docx`
- Presentations: `.ppt`, `.pptx`
- Archives: `.zip`, `.rar`, `.7z`
- Images: `.jpg`, `.jpeg`, `.png`, `.gif`
- Text: `.txt`, `.md`
- Spreadsheets: `.csv`, `.xlsx`, `.xls`

### File Size Limit
- Default: 10MB per file
- Configurable via `MAX_FILE_SIZE` environment variable

### Upload Endpoints

**Create Submission with Files:**
```bash
POST /api/submissions
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
- assignment: <assignment-id>
- classroom: <classroom-id>
- description: "My project submission"
- githubLink: "https://github.com/user/repo"
- report: <file>
- presentation: <file>
- code: <file>
```

**Create Assignment with Attachments:**
```bash
POST /api/assignments
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
- title: "Final Project"
- description: "..."
- classroom: <classroom-id>
- dueDate: "2025-12-31"
- maxMarks: 100
- attachments: <files>
```

## ⚠️ Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error message here",
  "errors": [ /* validation errors if any */ ]
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## 📁 Project Structure

```
backend/
├── controllers/          # Request handlers
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── classroom.controller.js
│   ├── assignment.controller.js
│   ├── submission.controller.js
│   ├── repository.controller.js
│   └── notification.controller.js
├── middleware/           # Custom middleware
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── upload.middleware.js
│   ├── validation.middleware.js
│   └── rateLimiter.middleware.js
├── models/              # Database models
│   ├── User.model.js
│   ├── Classroom.model.js
│   ├── Assignment.model.js
│   ├── Submission.model.js
│   ├── Repository.model.js
│   └── Notification.model.js
├── routes/              # API routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── classroom.routes.js
│   ├── assignment.routes.js
│   ├── submission.routes.js
│   ├── repository.routes.js
│   └── notification.routes.js
├── uploads/             # File storage
│   ├── assignments/
│   ├── submissions/
│   ├── feedback/
│   ├── avatars/
│   └── repository/
├── .env.example         # Environment template
├── .gitignore
├── package.json
├── server.js            # Entry point
└── README.md
```

## 🧪 Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@university.edu",
    "password": "password123",
    "role": "student"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@university.edu",
    "password": "password123"
  }'
```

**Get Profile:**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your-token>"
```

### Using Postman

1. Import the API endpoints
2. Set up environment variable for `token`
3. Use the token in Authorization header
4. Test all endpoints

## 🔒 Security Features

- **Password Hashing** - bcryptjs with salt rounds
- **JWT Tokens** - Secure token-based authentication
- **CORS Protection** - Configurable origin whitelist
- **Rate Limiting** - Prevent API abuse
- **Helmet** - Security HTTP headers
- **Input Validation** - Express-validator for all inputs
- **File Type Validation** - Whitelist allowed file extensions
- **File Size Limits** - Prevent large file uploads
- **SQL Injection Protection** - Mongoose ORM
- **XSS Protection** - Sanitized inputs

## 📝 API Rate Limits

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 failed attempts per 15 minutes
- **File Uploads**: 20 uploads per hour

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Ayush Sengar**
- GitHub: [@ayushsengar2010](https://github.com/ayushsengar2010)

## 🙏 Acknowledgments

- Express.js documentation
- MongoDB documentation
- Node.js best practices

---

**For Frontend Integration**: Update the frontend `apiService.js` to use `http://localhost:5000/api` as the base URL.
