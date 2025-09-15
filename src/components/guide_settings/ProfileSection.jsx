// src/components/guide_dashboard/settings/ProfileSection.jsx
import React from 'react';
import { FiMail, FiUser, FiX, FiCamera } from 'react-icons/fi';

const ProfileSection = ({ profile, photoPreview, isSaving, onProfileUpdate, onPhotoChange, onRemovePhoto }) => {
  return (
    <div className="p-6 bg-white shadow-sm rounded-xl">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Profile Information</h2>
      
      {/* Profile Photo Section */}
      <div className="flex flex-col items-center mb-6 sm:flex-row sm:items-start">
        <div className="relative mb-4 sm:mb-0 sm:mr-6">
          <div className="w-24 h-24 overflow-hidden bg-gray-100 rounded-full">
            {photoPreview ? (
              <img 
                src={photoPreview} 
                alt="Profile" 
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                <FiUser className="text-3xl" />
              </div>
            )}
          </div>
          {photoPreview && (
            <button
              onClick={onRemovePhoto}
              disabled={isSaving}
              className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-white bg-red-500 rounded-full hover:bg-red-600 disabled:opacity-50"
            >
              <FiX className="w-3 h-3" />
            </button>
          )}
        </div>
        
        <div className="flex-1">
          <div className="space-y-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Profile Photo
              </label>
              <label className="flex items-center justify-center px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 disabled:opacity-50">
                <FiCamera className="mr-2" />
                <span>{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onPhotoChange}
                  className="hidden"
                  disabled={isSaving}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Recommended size: 200x200 pixels. JPG, PNG format.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => onProfileUpdate('name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            disabled={isSaving}
          />
        </div>
        
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Years of Experience</label>
          <input
            type="number"
            value={profile.guides?.years_of_experience || 0}
            onChange={(e) => onProfileUpdate('years_of_experience', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            disabled={isSaving}
          />
        </div>
        
        <div className="sm:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <div className="flex">
            <input
              type="email"
              value={profile.email}
              onChange={(e) => onProfileUpdate('email', e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
              disabled={isSaving}
            />
            <span className="inline-flex items-center px-4 text-sm text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg">
              <FiMail className="mr-2" /> Verified
            </span>
          </div>
        </div>
        
        <div className="sm:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={profile.phone_no}
            onChange={(e) => onProfileUpdate('phone_no', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            disabled={isSaving}
          />
        </div>
        
        <div className="sm:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">Bio</label>
          <textarea
            rows={4}
            value={profile.bio || ''}
            onChange={(e) => onProfileUpdate('bio', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            disabled={isSaving}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;