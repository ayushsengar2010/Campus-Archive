import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit,
    Save,
    X,
    Camera,
    BookOpen,
    Award,
    GraduationCap,
    School,
    Settings,
    Lock
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'settings', 'privacy'
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        // Basic Information
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@student.university.edu',
        phone: '+1 (555) 987-6543',
        studentId: 'STU-2024-001',
        department: 'Computer Science',
        program: 'Bachelor of Science',
        year: 'Third Year',
        semester: 'Fall 2024',
        expectedGraduation: '2026',
        bio: 'Passionate computer science student interested in software development and AI. Active member of coding club and hackathon participant.',
        
        // Academic Information
        gpa: '3.85',
        major: 'Computer Science',
        minor: 'Mathematics',
        advisor: 'Dr. Sarah Johnson',
        
        // Contact Information
        emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Mother',
            phone: '+1 (555) 123-4567'
        },
        
        // Profile Settings
        profileVisibility: 'institution', // 'public', 'institution', 'private'
        showEmail: true,
        showPhone: false,
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

    const handleNestedInputChange = (parent, field, value) => {
        setTempData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
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
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
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
                        <label className="bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
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
            <p className="text-gray-600">{(isEditing ? tempData : profileData).program}</p>
            <p className="text-gray-500">{(isEditing ? tempData : profileData).department}</p>
            <p className="text-sm text-blue-600 font-medium mt-1">{(isEditing ? tempData : profileData).studentId}</p>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <p className="text-gray-900 py-2">{profileData.phone}</p>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                    <p className="text-gray-900 py-2">{profileData.studentId}</p>
                </div>
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                {isEditing ? (
                    <textarea
                        value={tempData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell us about yourself..."
                    />
                ) : (
                    <p className="text-gray-700 py-2">{profileData.bio}</p>
                )}
            </div>
        </div>
    );

    const AcademicInfoSection = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.department}
                            onChange={(e) => handleInputChange('department', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.department}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.program}
                            onChange={(e) => handleInputChange('program', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.program}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    {isEditing ? (
                        <select
                            value={tempData.year}
                            onChange={(e) => handleInputChange('year', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option>First Year</option>
                            <option>Second Year</option>
                            <option>Third Year</option>
                            <option>Fourth Year</option>
                            <option>Fifth Year</option>
                        </select>
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.year}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Semester</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.semester}
                            onChange={(e) => handleInputChange('semester', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.semester}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.major}
                            onChange={(e) => handleInputChange('major', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.major}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minor</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.minor}
                            onChange={(e) => handleInputChange('minor', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.minor}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.gpa}
                            onChange={(e) => handleInputChange('gpa', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.gpa}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Graduation</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.expectedGraduation}
                            onChange={(e) => handleInputChange('expectedGraduation', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.expectedGraduation}</p>
                    )}
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Academic Advisor</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.advisor}
                            onChange={(e) => handleInputChange('advisor', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.advisor}</p>
                    )}
                </div>
            </div>
        </div>
    );

    const EmergencyContactSection = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.emergencyContact.name}
                            onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.emergencyContact.name}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempData.emergencyContact.relationship}
                            onChange={(e) => handleNestedInputChange('emergencyContact', 'relationship', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.emergencyContact.relationship}</p>
                    )}
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    {isEditing ? (
                        <input
                            type="tel"
                            value={tempData.emergencyContact.phone}
                            onChange={(e) => handleNestedInputChange('emergencyContact', 'phone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    ) : (
                        <p className="text-gray-900 py-2">{profileData.emergencyContact.phone}</p>
                    )}
                </div>
            </div>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                (isEditing ? tempData.showEmail : profileData.showEmail) ? 'bg-blue-600' : 'bg-gray-200'
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
                                (isEditing ? tempData.showPhone : profileData.showPhone) ? 'bg-blue-600' : 'bg-gray-200'
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
                            <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                            <p className="text-xs text-gray-500">Receive email notifications for grades and updates</p>
                        </div>
                        <button
                            onClick={() => isEditing && handleInputChange('emailNotifications', !(isEditing ? tempData.emailNotifications : profileData.emailNotifications))}
                            disabled={!isEditing}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                (isEditing ? tempData.emailNotifications : profileData.emailNotifications) ? 'bg-blue-600' : 'bg-gray-200'
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
                        <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
                        <p className="text-gray-600 mt-1">Manage your academic profile and settings</p>
                    </div>
                    <div className="flex space-x-2">
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                                    ? 'bg-white text-blue-600 shadow-sm'
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
                                    ? 'bg-white text-blue-600 shadow-sm'
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
                                    ? 'bg-white text-blue-600 shadow-sm'
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
                            <AcademicInfoSection />
                            <EmergencyContactSection />
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
                            <PrivacySettingsSection />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Profile;
