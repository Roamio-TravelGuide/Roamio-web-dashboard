// src/components/guide_dashboard/settings/PasswordSection.jsx
import React, { useState } from 'react';

const PasswordSection = ({ isSaving, onSubmitPassword }) => {
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitPassword(passwordForm);
  };

  return (
    <div className="p-6 bg-white shadow-sm rounded-xl">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Change Password</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            name="current"
            value={passwordForm.current}
            onChange={handlePasswordChange}
            placeholder="Enter current password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isSaving}
          />
        </div>
        
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            name="new"
            value={passwordForm.new}
            onChange={handlePasswordChange}
            placeholder="Enter new password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isSaving}
          />
        </div>
        
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            name="confirm"
            value={passwordForm.confirm}
            onChange={handlePasswordChange}
            placeholder="Confirm new password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isSaving}
          />
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSaving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordSection;