# Academic Repository Platform

A modern, responsive React web application for institution-wide academic repository and collaboration.

## Features

- ✅ **Authentication System** - JWT-based login/register with role-based access
- ✅ **Responsive Layout** - Beautiful sidebar navigation and header with search
- ✅ **Student Dashboard** - Google Classroom-style interface with project submission
- ✅ **Real-time Notifications** - Notification dropdown with unread indicators
- ✅ **File Management** - Drag-and-drop uploads with progress tracking
- ✅ **Data Tables** - Advanced tables with search, sorting, and filtering
- ✅ **Feedback System** - Rich feedback modals with file attachments
- ✅ **Submission Tracking** - Detailed submission history and status tracking
- 🔄 **Faculty Dashboard** - Review interface and analytics (In Progress)
- 🔄 **Advanced Search** - Global repository search with filtering (In Progress)
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS inspired by Google Classroom

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS + ShadCN UI
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Demo Accounts

You can test the application with these demo accounts:

- **Student:** student@university.edu / password123
- **Faculty:** faculty@university.edu / password123  
- **Admin:** admin@university.edu / password123
- **Researcher:** researcher@university.edu / password123

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN UI components
│   ├── layout/         # Layout components
│   ├── forms/          # Form components
│   └── common/         # Shared components
├── pages/              # Route components
│   ├── auth/           # Authentication pages
│   ├── student/        # Student dashboard
│   ├── faculty/        # Faculty dashboard
│   ├── admin/          # Admin dashboard
│   └── researcher/     # Researcher dashboard
├── hooks/              # Custom React hooks
├── services/           # API service functions
├── utils/              # Utility functions
├── types/              # Type definitions and constants
└── constants/          # Application constants
```

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

## Contributing

1. Follow the existing code style
2. Use meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## License

This project is licensed under the MIT License.

## Development Progress

### ✅ Completed Features

1. **Project Setup & Configuration**
   - React 18 with Vite
   - Tailwind CSS with custom theme
   - ESLint and Prettier configuration
   - Environment variables setup

2. **Authentication System**
   - JWT token management
   - Login/Register pages with validation
   - Role-based route protection
   - Authentication context and hooks
   - Mock user data for development

3. **Core Layout Components**
   - Responsive sidebar navigation with role-based menus
   - Header with global search and notifications
   - Main layout wrapper with mobile responsiveness
   - Breadcrumb navigation component
   - User avatar and dropdown menus

4. **Reusable UI Components**
   - File upload with drag-and-drop functionality
   - Data table with search, sorting, and pagination
   - Feedback modal with rich text editing
   - Dashboard cards with stats and trends
   - Modal component with keyboard navigation
   - Progress cards and action cards

5. **Student Dashboard (Google Classroom Style)**
   - Modern dashboard with stats and recent activity
   - Project submission form with file upload
   - Submission tracking with detailed views
   - Status indicators and feedback display
   - Responsive design with mobile support

### 🔄 In Progress

- Faculty dashboard implementation
- API integration and state management

### 📋 Upcoming Features

- File upload and management system
- Repository search and filtering
- Notification system
- Analytics and reporting
- Mobile app features