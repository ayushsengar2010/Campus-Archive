import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Building,
    Calendar,
    Edit,
    Save,
    X,
    Camera,
    Globe,
    Github,
    Linkedin,
    Twitter,
    BookOpen,
    Award,
    Users,
    FileText,
    Settings,
    Lock,
    Bell,
    Eye,
    EyeOff,
    Upload,
    Trash2
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import DashboardCard from '../../components/ui/DashboardCard';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'settings', 'privacy'
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        // Basic Information
        firstName: 'Dr. John',
        lastName: 'Smith',
        email: 'john.smith@university.edu',
        phone: '+1 (555) 123-4567',
        title: 'Senior Research Fellow',
        department: 'Computer Science',
        institution: 'BML Munjal University',
        location: 'Gurugram, India',
        bio: 'Experienced researcher specializing in machine learning applications in educational technology. Published author with expertise in AI-driven assessment systems and collaborative learning platforms.',
        
        // Professional Information
        orcid: '0000-0002-1825-0097',
        researcherId: 'A-1234-2024',
        specializations: ['Machine Learning', 'Educational Technology', 'AI Assessment', 'Data Mining'],
        interests: ['Artificial Intelligence', 'Education', 'Research Collaboration', 'Innovation'],
        
        // Contact & Social
        website: 'https://johnsmith-research.com',
        github: 'https://github.com/johnsmith',
        linkedin: 'https://linkedin.com/in/johnsmith',
        twitter: 'https://twitter.com/johnsmith_ai',
        
        // Academic Information
        education: [
            {
                degree: 'Ph.D. in Computer Science',
                institution: 'Stanford University',
                year: '2018',
                field: 'Machine Learning'
            },
            {
                degree: 'M.S. in Computer Science',
                institution: 'MIT',
                year: '2014',
                field: 'Artificial Intelligence'
            }
        ],
        
        // Statistics
        totalPapers: 24,
        totalCitations: 156,
        hIndex: 12,
        collaborations: 8,
        
        // Profile Settings
        profileVisibility: 'public', // 'public', 'institution', 'private'
        showEmail: true,
        showPhone: false,
        allowCollaborationRequests: true,
        emailNotifications: true,
        profilePicture: null
    });

    const [tempData, setTempData] = useState({ ...profileData });

    const handleEdit = () => {
        setTempData({ ...profileData });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setTempData({ ...profileData });
        setIsEditing(false);
    };

    const handleSave = () => {
        setProfileData({ ...tempData });
        setIsEditing(false);
        // Here you would typically make an API call to save the data
        console.log('Saving profile data:', tempData);
        alert('Profile saved successfully!');
    };

    const handleInputChange = (field, value) => {
        setTempData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleArrayChange = (field, index, value) => {
        setTempData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayItem = (field, newItem) => {
        setTempData(prev => ({
            ...prev,
            [field]: [...prev[field], newItem]
        }));
    };

    const removeArrayItem = (field, index) => {
        setTempData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleProfilePictureUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                handleInputChange('profilePicture', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const ProfilePictureSection = () => (
        <div className="flex flex-col items-center mb-8">
            <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {(isEditing ? tempData.profilePicture : profileData.profilePicture) ? (
                        <img 
                            src={isEditing ? tempData.profilePicture : profileData.profilePicture} 
                            alt="Profile" 
                            className="w-32 h-32 rounded-full object-cover"
                        />
                    ) : (
                        `${(isEditing ? tempData : profileData).firstName[0]}${(isEditing ? tempData : profileData).lastName[0]}`
                    )}
                </div>
                {isEditing && (
                    <div className="absolute bottom-0 right-0">
                        <label className="bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                            <Camera className="w-4 h-4" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">
                {(isEditing ? tempData : profileData).firstName} {(isEditing ? tempData : profileData).lastName}
            </h2>
            <p className="text-gray-600">{(isEditing ? tempData : profileData).title}</p>
            <p className="text-gray-500">{(isEditing ? tempData : profileData).department}, {(isEditing ? tempData : profileData).institution}</p>
        </div>
    );

    const BasicInfoSection = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.firstName}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.lastName}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {isEditing ? (
                            <input
                                type="email"
                                value={tempData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        ) : (
                            <p className="text-gray-900 py-2">{profileData.email}</p>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {isEditing ? (
                            <input
                                type="tel"
                                value={tempData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        ) : (
                            <p className="text-gray-900 py-2">{profileData.phone}</p>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.title}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        {isEditing ? (
                            <input
                                type="text"
                                value={tempData.department}
                                onChange={(e) => handleInputChange('department', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        ) : (
                            <p className="text-gray-900 py-2">{profileData.department}</p>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.institution}
                            onChange={(e) => handleInputChange('institution', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.institution}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {isEditing ? (
                            <input
                                type="text"
                                value={tempData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        ) : (
                            <p className="text-gray-900 py-2">{profileData.location}</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                {isEditing ? (
                    <textarea
                        value={tempData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Tell us about yourself and your research..."
                    />
                ) : (
                    <p className="text-gray-700 py-2">{profileData.bio}</p>
                )}
            </div>
        </div>
    );

    const ProfessionalInfoSection = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ORCID ID</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.orcid}
                            onChange={(e) => handleInputChange('orcid', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="0000-0000-0000-0000"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.orcid}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Researcher ID</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.researcherId}
                            onChange={(e) => handleInputChange('researcherId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.researcherId}</p>
                    )}
                </div>
            </div>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                {isEditing ? (
                    <div className="space-y-2">
                        {tempData.specializations.map((spec, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={spec}
                                    onChange={(e) => handleArrayChange('specializations', index, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button
                                    onClick={() => removeArrayItem('specializations', index)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => addArrayItem('specializations', '')}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                            + Add Specialization
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {profileData.specializations.map((spec, index) => (
                            <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                                {spec}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Research Interests</label>
                {isEditing ? (
                    <div className="space-y-2">
                        {tempData.interests.map((interest, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={interest}
                                    onChange={(e) => handleArrayChange('interests', index, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button
                                    onClick={() => removeArrayItem('interests', index)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => addArrayItem('interests', '')}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                            + Add Interest
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {profileData.interests.map((interest, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                {interest}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const SocialLinksSection = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links & Contact</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        {isEditing ? (
                            <input
                                type="url"
                                value={tempData.website}
                                onChange={(e) => handleInputChange('website', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="https://your-website.com"
                            />
                        ) : (
                            <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 py-2">
                                {profileData.website}
                            </a>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                    <div className="flex items-center space-x-2">
                        <Github className="w-4 h-4 text-gray-400" />
                        {isEditing ? (
                            <input
                                type="url"
                                value={tempData.github}
                                onChange={(e) => handleInputChange('github', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="https://github.com/username"
                            />
                        ) : (
                            <a href={profileData.github} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 py-2">
                                {profileData.github}
                            </a>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <div className="flex items-center space-x-2">
                        <Linkedin className="w-4 h-4 text-gray-400" />
                        {isEditing ? (
                            <input
                                type="url"
                                value={tempData.linkedin}
                                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="https://linkedin.com/in/username"
                            />
                        ) : (
                            <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 py-2">
                                {profileData.linkedin}
                            </a>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                    <div className="flex items-center space-x-2">
                        <Twitter className="w-4 h-4 text-gray-400" />
                        {isEditing ? (
                            <input
                                type="url"
                                value={tempData.twitter}
                                onChange={(e) => handleInputChange('twitter', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="https://twitter.com/username"
                            />
                        ) : (
                            <a href={profileData.twitter} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 py-2">
                                {profileData.twitter}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const EducationSection = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
            {isEditing ? (
                <div className="space-y-4">
                    {tempData.education.map((edu, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                <input
                                    type="text"
                                    value={edu.degree}
                                    onChange={(e) => handleArrayChange('education', index, { ...edu, degree: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Degree"
                                />
                                <input
                                    type="text"
                                    value={edu.institution}
                                    onChange={(e) => handleArrayChange('education', index, { ...edu, institution: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Institution"
                                />
                                <input
                                    type="text"
                                    value={edu.year}
                                    onChange={(e) => handleArrayChange('education', index, { ...edu, year: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Year"
                                />
                                <input
                                    type="text"
                                    value={edu.field}
                                    onChange={(e) => handleArrayChange('education', index, { ...edu, field: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Field of Study"
                                />
                            </div>
                            <button
                                onClick={() => removeArrayItem('education', index)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                                Remove Education
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => addArrayItem('education', { degree: '', institution: '', year: '', field: '' })}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                        + Add Education
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {profileData.education.map((edu, index) => (
                        <div key={index} className="flex items-start space-x-3">
                            <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                                <p className="text-gray-600">{edu.institution}</p>
                                <p className="text-sm text-gray-500">{edu.year} • {edu.field}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const PrivacySettingsSection = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                    <select
                        value={isEditing ? tempData.profileVisibility : profileData.profileVisibility}
                        onChange={(e) => handleInputChange('profileVisibility', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={!isEditing}
                    >
                        <option value="public">Public - Visible to everyone</option>
                        <option value="institution">Institution - Visible to institution members</option>
                        <option value="private">Private - Only visible to you</option>
                    </select>
                </div>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Show Email Address</label>
                            <p className="text-xs text-gray-500">Allow others to see your email address</p>
                        </div>
                        <button
                            onClick={() => isEditing && handleInputChange('showEmail', !(isEditing ? tempData.showEmail : profileData.showEmail))}
                            disabled={!isEditing}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                (isEditing ? tempData.showEmail : profileData.showEmail) ? 'bg-indigo-600' : 'bg-gray-200'
                            } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    (isEditing ? tempData.showEmail : profileData.showEmail) ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Show Phone Number</label>
                            <p className="text-xs text-gray-500">Allow others to see your phone number</p>
                        </div>
                        <button
                            onClick={() => isEditing && handleInputChange('showPhone', !(isEditing ? tempData.showPhone : profileData.showPhone))}
                            disabled={!isEditing}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                (isEditing ? tempData.showPhone : profileData.showPhone) ? 'bg-indigo-600' : 'bg-gray-200'
                            } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    (isEditing ? tempData.showPhone : profileData.showPhone) ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Allow Collaboration Requests</label>
                            <p className="text-xs text-gray-500">Allow other researchers to send collaboration requests</p>
                        </div>
                        <button
                            onClick={() => isEditing && handleInputChange('allowCollaborationRequests', !(isEditing ? tempData.allowCollaborationRequests : profileData.allowCollaborationRequests))}
                            disabled={!isEditing}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                (isEditing ? tempData.allowCollaborationRequests : profileData.allowCollaborationRequests) ? 'bg-indigo-600' : 'bg-gray-200'
                            } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    (isEditing ? tempData.allowCollaborationRequests : profileData.allowCollaborationRequests) ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                            <p className="text-xs text-gray-500">Receive email notifications for important updates</p>
                        </div>
                        <button
                            onClick={() => isEditing && handleInputChange('emailNotifications', !(isEditing ? tempData.emailNotifications : profileData.emailNotifications))}
                            disabled={!isEditing}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                (isEditing ? tempData.emailNotifications : profileData.emailNotifications) ? 'bg-indigo-600' : 'bg-gray-200'
                            } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    (isEditing ? tempData.emailNotifications : profileData.emailNotifications) ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                        <p className="text-gray-600 mt-1">Manage your profile information and settings</p>
                    </div>
                    <div className="flex space-x-2">
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'profile'
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <User className="w-4 h-4 inline mr-2" />
                            Profile Information
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'settings'
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Settings className="w-4 h-4 inline mr-2" />
                            Settings
                        </button>
                        <button
                            onClick={() => setActiveTab('privacy')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'privacy'
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Lock className="w-4 h-4 inline mr-2" />
                            Privacy
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'profile' && (
                        <div>
                            <ProfilePictureSection />
                            <BasicInfoSection />
                            <ProfessionalInfoSection />
                            <SocialLinksSection />
                            <EducationSection />
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Change Password</label>
                                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                            Update Password
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Two-Factor Authentication</label>
                                        <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
                                            Enable 2FA
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Export Data</label>
                                        <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                                            Download My Data
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'privacy' && (
                        <div>
                            <PrivacySettingsSection />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Profile;