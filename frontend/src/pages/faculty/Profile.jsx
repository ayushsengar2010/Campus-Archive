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
    BookOpen,
    Award,
    Users,
    Settings,
    Lock,
    Globe,
    Linkedin
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        // Basic Information
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@university.edu',
        phone: '+1 (555) 234-5678',
        title: 'Associate Professor',
        department: 'Computer Science',
        institution: 'BML Munjal University',
        location: 'Gurugram, India',
        officeRoom: 'Building A, Room 305',
        officeHours: 'Mon-Wed 2:00 PM - 4:00 PM',
        bio: 'Experienced educator specializing in software engineering and computer science education. Passionate about innovative teaching methodologies and student success.',
        
        // Academic Information
        employeeId: 'FAC-2020-156',
        designation: 'Associate Professor',
        qualification: 'Ph.D. in Computer Science',
        experience: '12 years',
        joiningDate: 'August 2020',
        
        // Teaching & Research
        coursesTeaching: ['Data Structures', 'Algorithms', 'Software Engineering', 'Web Development'],
        researchInterests: ['Software Engineering', 'Computer Science Education', 'EdTech'],
        
        // Contact Information
        website: 'https://sarahjohnson-faculty.com',
        linkedin: 'https://linkedin.com/in/drsarahjohnson',
        
        // Profile Settings
        profileVisibility: 'public',
        showEmail: true,
        showPhone: true,
        showOfficeHours: true,
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

    const profilePictureSection = (
        <div className="flex flex-col items-center mb-8">
            <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
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
                        <label className="bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors">
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

    const basicInfoSection = (
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        ) : (
                            <p className="text-gray-900 py-2">{profileData.department}</p>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Office Room</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.officeRoom}
                            onChange={(e) => handleInputChange('officeRoom', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.officeRoom}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Office Hours</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.officeHours}
                            onChange={(e) => handleInputChange('officeHours', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.officeHours}</p>
                    )}
                </div>
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                {isEditing ? (
                    <textarea
                        value={tempData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Tell us about yourself and your teaching philosophy..."
                    />
                ) : (
                    <p className="text-gray-700 py-2">{profileData.bio}</p>
                )}
            </div>
        </div>
    );

    const academicInfoSection = (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                    <p className="text-gray-900 py-2">{profileData.employeeId}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.designation}
                            onChange={(e) => handleInputChange('designation', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.designation}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.qualification}
                            onChange={(e) => handleInputChange('qualification', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.qualification}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.experience}
                            onChange={(e) => handleInputChange('experience', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.experience}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.joiningDate}
                            onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.joiningDate}</p>
                    )}
                </div>
            </div>

            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Courses Teaching</label>
                {isEditing ? (
                    <div className="space-y-2">
                        {tempData.coursesTeaching.map((course, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={course}
                                    onChange={(e) => handleArrayChange('coursesTeaching', index, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('coursesTeaching', index)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('coursesTeaching', '')}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                            + Add Course
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {profileData.coursesTeaching.map((course, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                {course}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Research Interests</label>
                {isEditing ? (
                    <div className="space-y-2">
                        {tempData.researchInterests.map((interest, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={interest}
                                    onChange={(e) => handleArrayChange('researchInterests', index, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('researchInterests', index)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('researchInterests', '')}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                            + Add Interest
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {profileData.researchInterests.map((interest, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                {interest}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const contactSection = (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact & Links</h3>
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
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="https://your-website.com"
                            />
                        ) : (
                            <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 py-2">
                                {profileData.website}
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
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="https://linkedin.com/in/username"
                            />
                        ) : (
                            <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 py-2">
                                {profileData.linkedin}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const privacySettingsSection = (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                    <select
                        value={isEditing ? tempData.profileVisibility : profileData.profileVisibility}
                        onChange={(e) => handleInputChange('profileVisibility', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                            <p className="text-xs text-gray-500">Allow students to see your email address</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => isEditing && handleInputChange('showEmail', !(isEditing ? tempData.showEmail : profileData.showEmail))}
                            disabled={!isEditing}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                (isEditing ? tempData.showEmail : profileData.showEmail) ? 'bg-green-600' : 'bg-gray-200'
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
                            <label className="text-sm font-medium text-gray-700">Show Office Hours</label>
                            <p className="text-xs text-gray-500">Display your office hours publicly</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => isEditing && handleInputChange('showOfficeHours', !(isEditing ? tempData.showOfficeHours : profileData.showOfficeHours))}
                            disabled={!isEditing}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                (isEditing ? tempData.showOfficeHours : profileData.showOfficeHours) ? 'bg-green-600' : 'bg-gray-200'
                            } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    (isEditing ? tempData.showOfficeHours : profileData.showOfficeHours) ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                            <p className="text-xs text-gray-500">Receive email notifications for updates</p>
                        </div>
                        <button
                            onClick={() => isEditing && handleInputChange('emailNotifications', !(isEditing ? tempData.emailNotifications : profileData.emailNotifications))}
                            disabled={!isEditing}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                (isEditing ? tempData.emailNotifications : profileData.emailNotifications) ? 'bg-green-600' : 'bg-gray-200'
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
                        <h1 className="text-3xl font-bold text-gray-900">Faculty Profile</h1>
                        <p className="text-gray-600 mt-1">Manage your faculty profile and settings</p>
                    </div>
                    <div className="flex space-x-2">
                        {!isEditing ? (
                            <button
                                type="button"
                                onClick={handleEdit}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                            type="button"
                            onClick={() => setActiveTab('profile')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'profile'
                                    ? 'bg-white text-green-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <User className="w-4 h-4 inline mr-2" />
                            Profile Information
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('settings')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'settings'
                                    ? 'bg-white text-green-600 shadow-sm'
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
                                    ? 'bg-white text-green-600 shadow-sm'
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
                            {profilePictureSection}
                            {basicInfoSection}
                            {academicInfoSection}
                            {contactSection}
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
                            {privacySettingsSection}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Profile;
