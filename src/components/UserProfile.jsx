import React, { useState, useEffect } from 'react';
import { User, Camera, Save, Check } from 'lucide-react';
import { getItem, setItem, STORAGE_KEYS } from '../utils/localStorage';
import { fileToDataURL } from '../utils/fileUtils';

export default function UserProfile() {
  const [profile, setProfile] = useState({
    name: '',
    avatar: '',
    email: '',
    theme: 'light',
    notifications: true,
    studyGoalHours: 2,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = getItem(STORAGE_KEYS.USER_PROFILE, null);
    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, []);

  // Handle profile changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const dataURL = await fileToDataURL(file);
      setProfile(prev => ({
        ...prev,
        avatar: dataURL
      }));
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar. Please try again.');
    }
  };

  // Save profile
  const saveProfile = () => {
    setItem(STORAGE_KEYS.USER_PROFILE, profile);
    setIsEditing(false);
    
    // Show saved indicator briefly
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <User className="h-5 w-5 mr-2 text-blue-600" />
          User Profile
        </h2>
        
        {!isEditing ? (
          <button
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        ) : (
          <button
            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            onClick={saveProfile}
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
            </div>
            
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer">
                <Camera className="h-4 w-4" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarUpload}
                />
              </label>
            )}
          </div>
          
          {isSaved && (
            <div className="flex items-center text-green-600 text-sm mb-2">
              <Check className="h-4 w-4 mr-1" />
              <span>Profile saved!</span>
            </div>
          )}
        </div>
        
        {/* Profile Form */}
        <div className="flex-1">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Your Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Daily Study Goal (hours)</label>
              <input
                type="number"
                name="studyGoalHours"
                min="0"
                max="24"
                step="0.5"
                value={profile.studyGoalHours}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Theme</label>
              <select
                name="theme"
                value={profile.theme}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Preference</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={profile.notifications}
                onChange={handleChange}
                disabled={!isEditing}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
              />
              <label htmlFor="notifications" className="text-sm">
                Enable Notifications
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Export/Import Profile */}
      {!isEditing && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between">
            <button
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => {
                const dataStr = JSON.stringify(profile, null, 2);
                const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
                
                const exportFileDefaultName = 'user-profile.json';
                
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
              }}
            >
              Export Profile
            </button>
            
            <label className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
              Import Profile
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    try {
                      const importedProfile = JSON.parse(e.target.result);
                      if (window.confirm('Import this profile? This will overwrite your current profile.')) {
                        setProfile(importedProfile);
                        setItem(STORAGE_KEYS.USER_PROFILE, importedProfile);
                        setIsSaved(true);
                        setTimeout(() => setIsSaved(false), 2000);
                      }
                    } catch (error) {
                      alert('Error importing profile: Invalid format');
                    }
                  };
                  
                  reader.readAsText(file);
                  e.target.value = null; // Reset input
                }}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
