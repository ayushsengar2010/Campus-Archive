import { useState, useEffect } from 'react';

/**
 * Custom hook to manage repository data and bookmarks
 */
export const useRepositoryData = () => {
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        loadSubmissions();
        loadBookmarks();
    }, []);

    const loadSubmissions = async () => {
        setIsLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - replace with actual API call
        const mockSubmissions = [
            {
                id: 'PRJ001',
                title: 'E-Commerce Platform with React & Node.js',
                description: 'A full-stack e-commerce application with user authentication, product management, shopping cart, and payment integration. Built with modern web technologies and best practices.',
                type: 'project',
                status: 'approved',
                githubUrl: 'https://github.com/student/ecommerce-platform',
                tags: ['React', 'Node.js', 'MongoDB', 'Express', 'E-commerce', 'Full-stack'],
                files: [
                    { name: 'Project Report.pdf', size: 2621440, url: '#' },
                    { name: 'Source Code.zip', size: 16040960, url: '#' },
                    { name: 'Documentation.docx', size: 1258291, url: '#' },
                    { name: 'Presentation.pptx', size: 9126912, url: '#' }
                ],
                metadata: {
                    department: 'Computer Science',
                    course: 'CS 401 - Web Development',
                    year: 2024
                },
                submitter: {
                    name: 'John Doe',
                    email: 'john.doe@university.edu'
                },
                createdAt: new Date('2024-05-15'),
                updatedAt: new Date('2024-05-20')
            },
            {
                id: 'PRJ002',
                title: 'Machine Learning Classification Model',
                description: 'Advanced machine learning model for classification tasks using Random Forest and Neural Networks. Achieved 95% accuracy on test dataset with comprehensive data preprocessing.',
                type: 'research',
                status: 'approved',
                githubUrl: 'https://github.com/student/ml-classification',
                tags: ['Python', 'TensorFlow', 'Scikit-learn', 'Machine Learning', 'Data Science'],
                files: [
                    { name: 'Research Paper.pdf', size: 3984588, url: '#' },
                    { name: 'Model Code.zip', size: 8601395, url: '#' },
                    { name: 'Dataset.csv', size: 13107200, url: '#' },
                    { name: 'Results Analysis.xlsx', size: 2202009, url: '#' }
                ],
                metadata: {
                    department: 'Computer Science',
                    course: 'CS 501 - Machine Learning',
                    year: 2024
                },
                submitter: {
                    name: 'Jane Smith',
                    email: 'jane.smith@university.edu'
                },
                createdAt: new Date('2024-06-20'),
                updatedAt: new Date('2024-06-25')
            },
            {
                id: 'PRJ003',
                title: 'Mobile Banking Application',
                description: 'Secure mobile banking app with real-time transactions, bill payments, and investment tracking. Features biometric authentication and end-to-end encryption.',
                type: 'project',
                status: 'approved',
                githubUrl: 'https://github.com/student/mobile-banking',
                tags: ['React Native', 'Firebase', 'Banking', 'Security', 'Mobile App'],
                files: [
                    { name: 'Project Report.pdf', size: 4404019, url: '#' },
                    { name: 'APK File.apk', size: 26843546, url: '#' },
                    { name: 'Source Code.zip', size: 19815628, url: '#' },
                    { name: 'User Manual.pdf', size: 1887437, url: '#' }
                ],
                metadata: {
                    department: 'Computer Science',
                    course: 'CS 402 - Mobile Development',
                    year: 2023
                },
                submitter: {
                    name: 'Mike Johnson',
                    email: 'mike.johnson@university.edu'
                },
                createdAt: new Date('2023-12-10'),
                updatedAt: new Date('2023-12-15')
            },
            {
                id: 'PRJ004',
                title: 'IoT Smart Home Automation System',
                description: 'Complete home automation solution with IoT devices, mobile control, and voice assistant integration. Supports multiple protocols and devices.',
                type: 'project',
                status: 'approved',
                githubUrl: 'https://github.com/student/smart-home',
                tags: ['IoT', 'Arduino', 'Raspberry Pi', 'Python', 'MQTT', 'Home Automation'],
                files: [
                    { name: 'Technical Report.pdf', size: 5349785, url: '#' },
                    { name: 'Circuit Diagrams.pdf', size: 3565158, url: '#' },
                    { name: 'Source Code.zip', size: 7024844, url: '#' },
                    { name: 'Demo Video.mp4', size: 47400960, url: '#' }
                ],
                metadata: {
                    department: 'Computer Engineering',
                    course: 'CS 503 - Internet of Things',
                    year: 2024
                },
                submitter: {
                    name: 'Sarah Williams',
                    email: 'sarah.williams@university.edu'
                },
                createdAt: new Date('2024-04-25'),
                updatedAt: new Date('2024-04-30')
            },
            {
                id: 'PRJ005',
                title: 'Blockchain-based Voting System',
                description: 'Secure and transparent voting system using blockchain technology. Ensures vote integrity, anonymity, and real-time result verification.',
                type: 'research',
                status: 'approved',
                githubUrl: 'https://github.com/student/blockchain-voting',
                tags: ['Blockchain', 'Ethereum', 'Solidity', 'Web3', 'Security', 'Voting'],
                files: [
                    { name: 'Whitepaper.pdf', size: 3041894, url: '#' },
                    { name: 'Smart Contracts.zip', size: 1258291, url: '#' },
                    { name: 'Frontend Code.zip', size: 13003366, url: '#' },
                    { name: 'Security Audit.pdf', size: 1782579, url: '#' }
                ],
                metadata: {
                    department: 'Computer Science',
                    course: 'CS 505 - Blockchain Technology',
                    year: 2023
                },
                submitter: {
                    name: 'David Brown',
                    email: 'david.brown@university.edu'
                },
                createdAt: new Date('2023-11-30'),
                updatedAt: new Date('2023-12-05')
            },
            {
                id: 'PRJ006',
                title: 'AI-Powered Healthcare Diagnosis System',
                description: 'Deep learning model for medical image analysis and disease diagnosis. Trained on large medical dataset with high accuracy.',
                type: 'research',
                status: 'approved',
                githubUrl: 'https://github.com/student/ai-healthcare',
                tags: ['AI', 'Deep Learning', 'Healthcare', 'Medical Imaging', 'PyTorch'],
                files: [
                    { name: 'Research Paper.pdf', size: 4721369, url: '#' },
                    { name: 'Model Architecture.pdf', size: 2359296, url: '#' },
                    { name: 'Training Code.zip', size: 9437184, url: '#' },
                    { name: 'Results.xlsx', size: 1572864, url: '#' }
                ],
                metadata: {
                    department: 'Computer Science',
                    course: 'CS 601 - Artificial Intelligence',
                    year: 2024
                },
                submitter: {
                    name: 'Emily Davis',
                    email: 'emily.davis@university.edu'
                },
                createdAt: new Date('2024-07-10'),
                updatedAt: new Date('2024-07-18')
            },
            {
                id: 'PRJ007',
                title: 'Real-time Chat Application',
                description: 'Modern chat application with real-time messaging, file sharing, and video calls. Built with WebSocket for instant communication.',
                type: 'project',
                status: 'approved',
                githubUrl: 'https://github.com/student/realtime-chat',
                tags: ['WebSocket', 'React', 'Node.js', 'Socket.io', 'Real-time'],
                files: [
                    { name: 'Project Documentation.pdf', size: 2831155, url: '#' },
                    { name: 'Frontend.zip', size: 11534336, url: '#' },
                    { name: 'Backend.zip', size: 5767168, url: '#' },
                    { name: 'API Documentation.pdf', size: 1468006, url: '#' }
                ],
                metadata: {
                    department: 'Computer Science',
                    course: 'CS 301 - Software Engineering',
                    year: 2024
                },
                submitter: {
                    name: 'Alex Martinez',
                    email: 'alex.martinez@university.edu'
                },
                createdAt: new Date('2024-03-15'),
                updatedAt: new Date('2024-03-22')
            },
            {
                id: 'PRJ008',
                title: 'Cloud Infrastructure Management Tool',
                description: 'DevOps tool for managing cloud infrastructure across multiple providers. Supports AWS, Azure, and Google Cloud.',
                type: 'project',
                status: 'approved',
                githubUrl: 'https://github.com/student/cloud-manager',
                tags: ['Cloud', 'DevOps', 'AWS', 'Azure', 'Infrastructure', 'Python'],
                files: [
                    { name: 'Technical Report.pdf', size: 3670016, url: '#' },
                    { name: 'Source Code.zip', size: 8912896, url: '#' },
                    { name: 'User Guide.pdf', size: 2097152, url: '#' },
                    { name: 'Architecture Diagram.pdf', size: 1679360, url: '#' }
                ],
                metadata: {
                    department: 'Information Technology',
                    course: 'IT 401 - Cloud Computing',
                    year: 2023
                },
                submitter: {
                    name: 'Chris Taylor',
                    email: 'chris.taylor@university.edu'
                },
                createdAt: new Date('2023-10-20'),
                updatedAt: new Date('2023-10-28')
            }
        ];

        setSubmissions(mockSubmissions);
        setIsLoading(false);
    };

    const loadBookmarks = () => {
        // Load bookmarks from localStorage
        const saved = localStorage.getItem('repository_bookmarks');
        if (saved) {
            setBookmarks(JSON.parse(saved));
        }
    };

    const toggleBookmark = (submissionId) => {
        setBookmarks(prev => {
            const newBookmarks = prev.includes(submissionId)
                ? prev.filter(id => id !== submissionId)
                : [...prev, submissionId];
            
            // Save to localStorage
            localStorage.setItem('repository_bookmarks', JSON.stringify(newBookmarks));
            
            return newBookmarks;
        });
    };

    return {
        submissions,
        isLoading,
        bookmarks,
        toggleBookmark
    };
};
