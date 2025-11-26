import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

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
        
        try {
            // Fetch repository items from API
            const response = await apiService.getRepositoryItems();
            console.log('Repository items from API:', response);
            
            // Transform the data to match the expected format
            const transformedData = response.map(item => ({
                id: item._id,
                title: item.title,
                description: item.description || 'No description provided',
                type: item.type?.toLowerCase() || 'project',
                status: 'approved', // Repository items are always approved
                githubUrl: item.githubLink,
                tags: item.tags || [],
                files: item.files ? [
                    item.files.report && { 
                        name: item.files.report.originalName, 
                        originalName: item.files.report.originalName,
                        filename: item.files.report.filename,
                        size: item.files.report.size, 
                        path: item.files.report.path 
                    },
                    item.files.presentation && { 
                        name: item.files.presentation.originalName, 
                        originalName: item.files.presentation.originalName,
                        filename: item.files.presentation.filename,
                        size: item.files.presentation.size, 
                        path: item.files.presentation.path 
                    },
                    item.files.code && { 
                        name: item.files.code.originalName, 
                        originalName: item.files.code.originalName,
                        filename: item.files.code.filename,
                        size: item.files.code.size, 
                        path: item.files.code.path 
                    }
                ].filter(Boolean) : [],
                metadata: {
                    department: item.classroom?.department || 'N/A',
                    course: item.classroom?.name || 'N/A',
                    year: item.academicYear ? parseInt(item.academicYear.split('-')[0]) : new Date().getFullYear()
                },
                submitter: {
                    name: item.student?.name || 'Unknown',
                    email: item.student?.email || 'N/A'
                },
                createdAt: new Date(item.createdAt),
                updatedAt: new Date(item.updatedAt)
            }));
            
            setSubmissions(transformedData);
        } catch (error) {
            console.error('Error loading repository items:', error);
            setSubmissions([]);
        } finally {
            setIsLoading(false);
        }
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
