import React, { useState } from 'react';
import { FiUpload, FiCheck, FiClock, FiEye, FiLock, FiMail, FiPhone, FiGlobe, FiHelpCircle, FiStar, FiDollarSign, FiCalendar, FiUser, FiX, FiCamera } from 'react-icons/fi';
import DashboardHeader from '../../components/guide_dashboard/DashboardHeader';

const GuideSettings = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [profile, setProfile] = useState({
    name: 'Sarah Johnson',
    verified: true,
    yearsOfExperience: 8,
    bio: 'Passionate travel guide with 8 years of experience showcasing the hidden gems of our beautiful city. Specialized in historical tours and cultural experiences.',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    rating: 4.8,
    reviewsCount: 127,
    toursConducted: 89,
    totalEarnings: 12450,
    responseRate: 98,
    avgResponseTime: 2,
    lastLogin: '2025-01-18 14:30',
    profileVisibility: 'Public'
  });

  // Profile photo state
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('https://randomuser.me/api/portraits/women/44.jpg');

  // Languages state
  const [languages, setLanguages] = useState([
    { language: 'English', proficiency: 'Native' },
    { language: 'Spanish', proficiency: 'Fluent' },
    { language: 'French', proficiency: 'Basic' }
  ]);

  // Documents state
  const [documents, setDocuments] = useState([
    { name: 'Government ID', date: '2025-01-15', status: 'Approved' },
    { name: 'Guide Certificate', date: '2025-01-10', status: 'Pending' }
  ]);

  // Support tickets state
  const [tickets, setTickets] = useState([
    { id: 1234, title: 'Payment Issue', status: 'Resolved' },
    { id: 1235, title: 'Profile Update', status: 'Pending' }
  ]);

  // Form states
  const [newLanguage, setNewLanguage] = useState('');
  const [newLanguageProficiency, setNewLanguageProficiency] = useState('Basic');
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Handlers
  const handleLanguageAdd = (e) => {
    e.preventDefault();
    if (newLanguage) {
      setLanguages([...languages, { language: newLanguage, proficiency: newLanguageProficiency }]);
      setNewLanguage('');
    }
  };

  const handleLanguageRemove = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    // Password change logic here
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    setPhotoPreview(''); // Or set to default avatar
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="pb-12 mt-5">
        <div className="mx-auto sm:px-6 lg:px-12">
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Column - 2/3 width */}
              <div className="space-y-6 lg:col-span-2">
                {/* Profile Overview - Form Style */}
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
                          onClick={handleRemovePhoto}
                          className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-white bg-red-500 rounded-full hover:bg-red-600"
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
                          <label className="flex items-center justify-center px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                            <FiCamera className="mr-2" />
                            <span>{profilePhoto ? 'Change Photo' : 'Upload Photo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoChange}
                              className="hidden"
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
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Years of Experience</label>
                      <input
                        type="number"
                        value={profile.yearsOfExperience}
                        onChange={(e) => setProfile({...profile, yearsOfExperience: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                      <div className="flex">
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
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
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        rows={4}
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Save Changes
                    </button>
                  </div>
                </div>
                
                {/* Languages Section */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h2 className="mb-6 text-xl font-semibold text-gray-800">Languages</h2>
                  
                  <div className="mb-6 space-y-4">
                    {languages.map((lang, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-800">{lang.language}</p>
                          <p className="text-sm text-gray-500 capitalize">{lang.proficiency.toLowerCase()}</p>
                        </div>
                        <button
                          onClick={() => handleLanguageRemove(index)}
                          className="px-3 py-1 text-sm text-red-600 transition-colors duration-200 rounded-lg hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <form onSubmit={handleLanguageAdd} className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Add New Language</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          placeholder="Language"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <select
                          value={newLanguageProficiency}
                          onChange={(e) => setNewLanguageProficiency(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Basic">Basic</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Native">Native</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Add Language
                    </button>
                  </form>
                </div>
                
                {/* Verification & Documents */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h2 className="mb-6 text-xl font-semibold text-gray-800">Verification & Documents</h2>
                  
                  <div className="p-6 mb-6 text-center rounded-lg bg-gray-50">
                    <div className="max-w-md mx-auto">
                      <FiUpload className="mx-auto mb-3 text-3xl text-gray-400" />
                      <h3 className="mb-1 text-sm font-medium text-gray-700">Upload Documents</h3>
                      <p className="mb-3 text-xs text-gray-500">Government ID, Guide License, etc.</p>
                      <button className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                        Select Files
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center">
                          <div className="p-2 mr-3 bg-white rounded-lg shadow-sm">
                            <FiUpload className="text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{doc.name}</p>
                            <p className="text-xs text-gray-500">Uploaded on {doc.date}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          doc.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Password Change */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h2 className="mb-6 text-xl font-semibold text-gray-800">Change Password</h2>
                  
                  <form onSubmit={handleSubmitPassword} className="space-y-4">
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
                      />
                    </div>
                    
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              
              {/* Right Column - 1/3 width */}
              <div className="space-y-6">
                {/* Performance Metrics */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h2 className="mb-6 text-xl font-semibold text-gray-800">Performance</h2>
                  
                  {/* Rating Card */}
                  <div className="p-4 mb-6 text-center bg-blue-50 rounded-xl">
                    <div className="flex items-center justify-center mb-2">
                      <FiStar className="mr-1 text-yellow-500 fill-current" />
                      <span className="text-2xl font-bold text-gray-800">{profile.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Average rating from {profile.reviewsCount} reviews
                    </p>
                  </div>
                  
                  {/* Stats Cards */}
                  <div className="space-y-4">
                    <div className="flex items-center p-4 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-center w-12 h-12 mr-4 bg-white rounded-lg shadow-sm">
                        <FiCalendar className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tours Conducted</p>
                        <p className="text-xl font-semibold text-gray-800">{profile.toursConducted}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-center w-12 h-12 mr-4 bg-white rounded-lg shadow-sm">
                        <FiDollarSign className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                        <p className="text-xl font-semibold text-gray-800">${profile.totalEarnings.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Support Section */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h2 className="mb-6 text-xl font-semibold text-gray-800">Support Center</h2>
                  
                  <button className="w-full px-6 py-3 mb-6 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Create New Ticket
                  </button>
                  
                  <div className="mb-6">
                    <h3 className="mb-3 text-sm font-medium text-gray-700">Recent Tickets</h3>
                    <div className="space-y-3">
                      {tickets.map((ticket) => (
                        <div key={ticket.id} className="p-3 rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-800">{ticket.title}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">Ticket #{ticket.id}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="mb-3 text-sm font-medium text-gray-700">Help Resources</h3>
                    <div className="space-y-2">
                      <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50">
                        <FiHelpCircle className="mr-2 text-blue-600" />
                        Help Center
                      </a>
                      <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50">
                        <FiHelpCircle className="mr-2 text-blue-600" />
                        Community Guidelines
                      </a>
                      <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50">
                        <FiHelpCircle className="mr-2 text-blue-600" />
                        Contact Support
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Quick Info */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h2 className="mb-4 text-xl font-semibold text-gray-800">Quick Info</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FiClock className="mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Last Login</p>
                        <p className="font-medium text-gray-800">{profile.lastLogin}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FiEye className="mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Profile Visibility</p>
                        <p className="font-medium text-gray-800">{profile.profileVisibility}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FiGlobe className="mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Response Rate</p>
                        <p className="font-medium text-gray-800">{profile.responseRate}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideSettings;