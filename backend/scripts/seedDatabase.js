import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';
import Classroom from '../models/Classroom.model.js';
import Assignment from '../models/Assignment.model.js';
import Submission from '../models/Submission.model.js';
import Repository from '../models/Repository.model.js';
import Notification from '../models/Notification.model.js';

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Classroom.deleteMany({});
    await Assignment.deleteMany({});
    await Submission.deleteMany({});
    await Repository.deleteMany({});
    await Notification.deleteMany({});

    // Create Users
    console.log('👥 Creating users...');
    const users = await User.create([
      {
        name: 'Test Student',
        email: 'student@test.edu',
        password: 'password123',
        role: 'student',
        department: 'Computer Science',
        semester: 6,
        studentId: 'STU001'
      },
      {
        name: 'Test Faculty',
        email: 'faculty@test.edu',
        password: 'password123',
        role: 'faculty',
        department: 'Computer Science'
      },
      {
        name: 'Test Admin',
        email: 'admin@test.edu',
        password: 'password123',
        role: 'admin'
      },
      {
        name: 'Test Researcher',
        email: 'researcher@test.edu',
        password: 'password123',
        role: 'researcher',
        department: 'Machine Learning'
      },
      {
        name: 'John Doe',
        email: 'john.doe@test.edu',
        password: 'password123',
        role: 'student',
        department: 'Computer Science',
        semester: 5,
        studentId: 'STU002'
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@test.edu',
        password: 'password123',
        role: 'student',
        department: 'Computer Science',
        semester: 6,
        studentId: 'STU003'
      }
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create Classrooms
    console.log('🏫 Creating classrooms...');
    const classrooms = await Classroom.create([
      {
        name: 'Advanced Web Development',
        code: 'CS401',
        section: 'A',
        semester: 'Fall 2024',
        description: 'Learn modern web technologies including React, Node.js, and MongoDB',
        faculty: users[1]._id, // Faculty user
        students: [users[0]._id, users[4]._id, users[5]._id],
        enrollmentType: 'manual',
        maxStudents: 50,
        color: 'blue'
      },
      {
        name: 'Database Management Systems',
        code: 'CS301',
        section: 'B',
        semester: 'Fall 2024',
        description: 'Comprehensive study of database design and SQL',
        faculty: users[1]._id,
        students: [users[0]._id, users[4]._id],
        enrollmentType: 'manual',
        maxStudents: 60,
        color: 'green'
      }
    ]);

    console.log(`✅ Created ${classrooms.length} classrooms`);

    // Create Assignments
    console.log('📝 Creating assignments...');
    const assignments = await Assignment.create([
      {
        title: 'Build a React Application',
        description: 'Create a full-stack React application with CRUD operations',
        type: 'project',
        classroom: classrooms[0]._id,
        faculty: users[1]._id, // Faculty user
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        maxMarks: 100,
        instructions: 'Build a complete web application with authentication and data persistence',
        allowLateSubmission: true,
        isPublished: true,
        isStructured: true,
        requiredFields: {
          report: true,
          presentation: true,
          code: true,
          githubLink: false
        }
      },
      {
        title: 'Database Design Assignment',
        description: 'Design a normalized database schema for an e-commerce system',
        type: 'assignment',
        classroom: classrooms[1]._id,
        faculty: users[1]._id, // Faculty user
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        maxMarks: 50,
        instructions: 'Create ER diagrams and normalize to 3NF',
        allowLateSubmission: false,
        isPublished: true
      }
    ]);

    console.log(`✅ Created ${assignments.length} assignments`);

    // Create Submissions
    console.log('📤 Creating submissions...');
    const submissions = await Submission.create([
      {
        assignment: assignments[0]._id,
        student: users[0]._id,
        classroom: classrooms[0]._id,
        description: 'A fully functional e-commerce application built with React and Node.js',
        files: [
          {
            filename: 'project-report.pdf',
            originalName: 'React Project Report.pdf',
            mimetype: 'application/pdf',
            size: 2500000,
            path: '/uploads/submissions/report.pdf',
            fileType: 'report'
          },
          {
            filename: 'source-code.zip',
            originalName: 'React App Source Code.zip',
            mimetype: 'application/zip',
            size: 5000000,
            path: '/uploads/submissions/code.zip',
            fileType: 'code'
          }
        ],
        status: 'pending',
        submittedAt: new Date()
      },
      {
        assignment: assignments[1]._id,
        student: users[4]._id,
        classroom: classrooms[1]._id,
        description: 'Complete database schema with ER diagrams',
        files: [
          {
            filename: 'database-design.pdf',
            originalName: 'E-Commerce DB Design.pdf',
            mimetype: 'application/pdf',
            size: 1500000,
            path: '/uploads/submissions/db-design.pdf',
            fileType: 'document'
          }
        ],
        status: 'accepted',
        marks: 45,
        feedback: 'Excellent work! Well-structured database design.',
        reviewedBy: users[1]._id,
        reviewedAt: new Date(),
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log(`✅ Created ${submissions.length} submissions`);

    // Create Repository Items
    console.log('📚 Creating repository items...');
    const repositoryItems = await Repository.create([
      {
        title: 'Machine Learning Image Classifier',
        description: 'A CNN-based image classification system using TensorFlow',
        type: 'Project',
        category: 'Machine Learning',
        student: users[3]._id,
        faculty: users[1]._id,
        submission: submissions[1]._id,
        classroom: classrooms[1]._id,
        academicYear: '2024',
        semester: 'Fall 2024',
        files: {
          report: {
            filename: 'ml-project-report.pdf',
            originalName: 'ML Image Classifier Report.pdf',
            mimetype: 'application/pdf',
            size: 3000000,
            path: '/uploads/repository/ml-report.pdf'
          },
          code: {
            filename: 'ml-source-code.zip',
            originalName: 'TensorFlow Classifier Code.zip',
            mimetype: 'application/zip',
            size: 8000000,
            path: '/uploads/repository/ml-code.zip'
          }
        },
        tags: ['Machine Learning', 'TensorFlow', 'Python', 'Image Classification'],
        githubUrl: 'https://github.com/example/ml-classifier',
        featured: true,
        views: 150,
        downloads: 45
      },
      {
        title: 'Blockchain Voting System',
        description: 'A secure decentralized voting system using Ethereum',
        type: 'Research Paper',
        category: 'Blockchain',
        student: users[3]._id,
        faculty: users[1]._id,
        submission: submissions[0]._id,
        classroom: classrooms[0]._id,
        academicYear: '2024',
        semester: 'Fall 2024',
        files: {
          report: {
            filename: 'blockchain-paper.pdf',
            originalName: 'Blockchain Voting Paper.pdf',
            mimetype: 'application/pdf',
            size: 2000000,
            path: '/uploads/repository/blockchain-paper.pdf'
          }
        },
        tags: ['Blockchain', 'Ethereum', 'Solidity', 'Smart Contracts'],
        githubUrl: 'https://github.com/example/voting-dapp',
        featured: false,
        views: 89,
        downloads: 23
      }
    ]);

    console.log(`✅ Created ${repositoryItems.length} repository items`);

    // Create Notifications
    console.log('🔔 Creating notifications...');
    const notifications = await Notification.create([
      {
        user: users[0]._id,
        type: 'feedback',
        title: 'Feedback Received',
        message: 'Dr. Test Faculty provided feedback on your Database Design Assignment',
        isRead: false,
        link: `/student/submissions/${submissions[0]._id}`,
        relatedEntity: {
          entityType: 'submission',
          entityId: submissions[0]._id
        }
      },
      {
        user: users[1]._id,
        type: 'submission',
        title: 'New Submission',
        message: 'Test Student submitted React E-Commerce App',
        isRead: false,
        link: `/faculty/classrooms/${classrooms[0]._id}/submissions`,
        relatedEntity: {
          entityType: 'submission',
          entityId: submissions[0]._id
        }
      },
      {
        user: users[0]._id,
        type: 'assignment',
        title: 'New Assignment Posted',
        message: 'New assignment: Build a React Application (Due in 14 days)',
        isRead: false,
        link: `/student/classrooms/${classrooms[0]._id}`,
        relatedEntity: {
          entityType: 'assignment',
          entityId: assignments[0]._id
        }
      }
    ]);

    console.log(`✅ Created ${notifications.length} notifications`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Classrooms: ${classrooms.length}`);
    console.log(`   - Assignments: ${assignments.length}`);
    console.log(`   - Submissions: ${submissions.length}`);
    console.log(`   - Repository Items: ${repositoryItems.length}`);
    console.log(`   - Notifications: ${notifications.length}`);

    console.log('\n🔐 Test Credentials:');
    console.log('   Student: student@test.edu / password123');
    console.log('   Faculty: faculty@test.edu / password123');
    console.log('   Admin: admin@test.edu / password123');
    console.log('   Researcher: researcher@test.edu / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
