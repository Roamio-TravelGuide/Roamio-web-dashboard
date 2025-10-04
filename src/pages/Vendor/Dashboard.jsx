import React, { useState, useRef, useEffect } from 'react';
import { 
  FiTrendingUp, 
  FiMapPin, 
  FiStar,
  FiEdit, 
  FiUpload, 
  FiLink, 
  FiCheckCircle, 
  FiXCircle,
  FiCamera,
  FiImage,
  FiLoader
} from 'react-icons/fi';
import VendorService from '../../api/vendor/vendorService.js';
import { Toast } from '../../components/Toast.jsx';

const API_BASE_URL = "http://localhost:3001";


const VendorDashboard = () => {
  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // State for vendor data
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    email: '',
    phone: '',
    socialMedia: {
      instagram: '',
      facebook: '',
      website: ''
    }
  });

  const [logo, setLogo] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState({ logo: false, cover: false });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Show toast message
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Mock stats data (you can move this to API later)
  const mockStats = [
    { title: "Monthly Views", value: "1,240", change: "+12%", icon: <FiTrendingUp /> },
    { title: "Recommendations", value: "89", change: "+8%", icon: <FiMapPin /> },
    { title: "Avg. Rating", value: "4.7", change: "+0.2", icon: <FiStar /> }
  ];

  // Load vendor data on component mount
  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    try {
      setLoading(true);
      setErrors({});
      const response = await VendorService.getVendorProfile();
      
      if (response.success) {
        const data = response.data;
        setVendorData(data);
        setFormData({
          businessName: data.businessName || '',
          description: data.description || '',
          email: data.email || '',
          phone: data.phone || '',
          socialMedia: data.socialMedia || {
            instagram: '',
            facebook: '',
            website: ''
          }
        });
        setLogo(data.logoUrl);
        setCoverPhoto(data.coverPhotoUrl);
      } else {
        // Handle case where vendor profile doesn't exist
        setErrors({ 
          general: response.message || 'Vendor profile not found. Please contact admin to set up your profile.' 
        });
      }
    } catch (error) {
      console.error('Error loading vendor data:', error);
      
      // Handle different error types
      if (error.status === 404) {
        setErrors({ 
          general: 'Vendor profile not found. Please contact admin to set up your profile.' 
        });
      } else if (error.status === 401) {
        setErrors({ 
          general: 'Authentication failed. Please log in again.' 
        });
      } else {
        setErrors({ 
          general: error.message || 'Failed to load vendor data. Please try again.' 
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
    // Handle form input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    // Handle social media input changes
    const handleSocialChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [name]: value }
      }));
    };
  
  // Handle logo upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ ...errors, logo: 'Logo file size must be less than 5MB' });
        return;
      }
      
      try {
        setUploading({ ...uploading, logo: true });
        setErrors({ ...errors, logo: null });

        const response = await VendorService.uploadVendorLogo(file);
        
        if (response.success) {
          setLogo(response.data.logoUrl);
          // Update vendor data
          setVendorData(prev => ({ ...prev, logoUrl: response.data.logoUrl }));
        } else {
          setErrors({ ...errors, logo: response.message || 'Failed to upload logo' });
        }
      } catch (error) {
        console.error('Error uploading logo:', error);
        setErrors({ ...errors, logo: error.message || 'Failed to upload logo' });
      } finally {
        setUploading({ ...uploading, logo: false });
      }
    }
  };

  // Handle cover photo upload
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setErrors({ ...errors, cover: 'Cover image file size must be less than 10MB' });
        return;
      }
      
      try {
        setUploading({ ...uploading, cover: true });
        setErrors({ ...errors, cover: null });

        const response = await VendorService.uploadVendorCover(file);
        
        if (response.success) {
          setCoverPhoto(response.data.coverUrl);
          // Update vendor data
          setVendorData(prev => ({ ...prev, coverPhotoUrl: response.data.coverUrl }));
        } else {
          setErrors({ ...errors, cover: response.message || 'Failed to upload cover image' });
        }
      } catch (error) {
        console.error('Error uploading cover:', error);
        setErrors({ ...errors, cover: error.message || 'Failed to upload cover image' });
      } finally {
        setUploading({ ...uploading, cover: false });
      }
    }
  };
  
    // Form validation
    const validateForm = () => {
      const newErrors = {};
      if (!formData.businessName) newErrors.businessName = 'Business name is required';
      if (!formData.email.includes('@')) newErrors.email = 'Invalid email address';
      return newErrors;
    };
  
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      try {
        setSaving(true);
        setErrors({});

        const response = await VendorService.updateVendorProfile(formData);
        
        if (response.success) {
          // Update local state with response data
          setVendorData(response.data);
          setIsEditing(false);
          showToast('Profile updated successfully!', 'success');
        } else {
          setErrors({ general: response.message || 'Failed to update profile' });
          showToast(response.message || 'Failed to update profile', 'error');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        
        // Handle validation errors
        if (error.status === 400 && error.details?.errors) {
          const validationErrors = {};
          error.details.errors.forEach(err => {
            validationErrors[err.field] = err.message;
          });
          setErrors(validationErrors);
          showToast('Please fix the validation errors', 'error');
        } else {
          const errorMessage = error.message || 'Failed to update profile. Please try again.';
          setErrors({ general: errorMessage });
          showToast(errorMessage, 'error');
        }
      } finally {
        setSaving(false);
      }
    };


    const scrollRef = React.useRef(null);

    const scroll = (direction) => {
      if (scrollRef.current) {
        const scrollAmount = direction === 'left' ? -300 : 300;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };

  return (
    <div className="min-h-screen vendor-dashboard bg-gray-50">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed z-50 top-4 right-4">
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FiLoader className="w-8 h-8 mx-auto mb-4 text-indigo-600 animate-spin" />
            <p className="text-gray-600">Loading vendor profile...</p>
          </div>
        </div>
      ) : errors.general ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="p-6 text-center bg-white border border-red-200 rounded-lg shadow-sm">
            <FiXCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
            <p className="mb-4 text-red-600">{errors.general}</p>
            <button
              onClick={loadVendorData}
              className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section with Cover Photo */}
          <div className="relative w-full h-80 md:h-96">
        {/* Cover Photo */}
        <div className="relative w-full h-full overflow-hidden bg-gray-200">
          <img 
            src={coverPhoto} 
            alt="Business Cover" 
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Cover Photo Edit Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={uploading.cover}
              className="flex items-center gap-2 px-4 py-2 text-white transition-all rounded-lg bg-black/50 backdrop-blur-sm hover:bg-black/70 disabled:opacity-50"
            >
              {uploading.cover ? (
                <>
                  <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  <span className="text-sm">Uploading...</span>
                </>
              ) : (
                <>
                  <FiCamera size={16} />
                  <span className="text-sm">Change Cover</span>
                </>
              )}
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
          </div>
          
          {/* Error Message for Cover */}
          {errors.cover && (
            <div className="absolute px-3 py-2 text-sm text-red-100 rounded-lg top-16 right-4 bg-red-500/80 backdrop-blur-sm">
              {errors.cover}
            </div>
          )}
        </div>
        
        {/* Business Info Card */}
        <div className="absolute bottom-0 left-0 right-0 w-full max-w-5xl px-6 mx-auto -mb-16">
          <div className="p-6 mx-auto bg-white border border-gray-100 shadow-xl rounded-2xl backdrop-blur-sm">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-end">
              {/* Logo Section */}
              <div className="relative group">
                <div className="w-24 h-24 -mt-12 overflow-hidden bg-gray-100 border-4 border-white shadow-lg md:w-32 md:h-32 md:-mt-16 rounded-2xl">
                  <img 
                    src={logo} 
                    alt="Business Logo" 
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                {/* Logo Edit Overlay */}
                <button
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploading.logo}
                  className="absolute inset-0 flex items-center justify-center w-24 h-24 -mt-12 transition-all md:w-32 md:h-32 md:-mt-16 bg-black/0 hover:bg-black/50 rounded-2xl group"
                >
                  <div className="text-center text-white transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                    {uploading.logo ? (
                      <div className="w-6 h-6 mx-auto border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    ) : (
                      <>
                        <FiCamera size={20} className="mx-auto mb-1" />
                        <span className="text-xs">Change</span>
                      </>
                    )}
                  </div>
                </button>
                
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                
                {/* Logo Error */}
                {errors.logo && (
                  <div className="absolute left-0 right-0 text-xs text-center text-red-500 -bottom-8">
                    {errors.logo}
                  </div>
                )}
              </div>
              
              {/* Business Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h1 className="text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
                      {vendorData?.businessName || 'Business Name'}
                    </h1>
                    <p className="mt-2 text-gray-600 line-clamp-2">
                      {vendorData?.description || 'Business description not available.'}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiMapPin size={14} />
                        <span>Business Location</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${vendorData?.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>{vendorData?.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="flex gap-6">
                    {mockStats.slice(0, 2).map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="flex items-center justify-center w-8 h-8 mb-1 text-indigo-600 bg-indigo-100 rounded-full">
                          {stat.icon}
                        </div>
                        <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-500">{stat.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Business Profile Section */}
      <div className="container px-6 pt-24 mx-auto">
        <section className="p-8 bg-white border border-gray-100 shadow-sm rounded-2xl vendor-section">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Business Profile</h2>
              <p className="mt-1 text-gray-600">Manage your business information and media</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 text-white transition-all bg-indigo-600 rounded-lg hover:bg-indigo-700 hover:shadow-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <FiEdit size={18} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 text-white transition-all bg-green-600 rounded-lg hover:bg-green-700 hover:shadow-md focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <FiLoader size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle size={18} />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setErrors({});
                    // Reset form data to original vendor data
                    if (vendorData) {
                      setFormData({
                        businessName: vendorData.businessName || '',
                        description: vendorData.description || '',
                        email: vendorData.email || '',
                        phone: vendorData.phone || '',
                        socialMedia: vendorData.socialMedia || {
                          instagram: '',
                          facebook: '',
                          website: ''
                        }
                      });
                    }
                  }}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 text-gray-700 transition-all bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiXCircle size={18} /> Cancel
                </button>
              </div>
            )}
          </div>

          {/* General Error Display */}
          {errors.general && (
            <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <FiXCircle size={16} />
                <span>{errors.general}</span>
              </div>
            </div>
          )}
      
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="p-6 space-y-6 bg-gray-50 rounded-xl">
                  <h3 className="pb-2 text-lg font-semibold text-gray-900 border-b border-gray-200">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Business Name*
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-xl transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          errors.businessName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter your business name"
                      />
                      {errors.businessName && (
                        <p className="flex items-center gap-1 mt-2 text-sm text-red-600">
                          <FiXCircle size={14} />
                          {errors.businessName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Contact Email*
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-xl transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="flex items-center gap-1 mt-2 text-sm text-red-600">
                          <FiXCircle size={14} />
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-4 transition-colors border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Business Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-4 text-gray-600 bg-gray-100 border border-gray-300 rounded-xl"
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Address verification is handled by our admin team
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Business Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full p-4 transition-colors border border-gray-300 resize-none rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Tell travelers about your business, what makes it special, and what they can expect..."
                    />
                  </div>
                </div>

                {/* Media Upload Section */}
                <div className="p-6 space-y-6 bg-gray-50 rounded-xl">
                  <h3 className="pb-2 text-lg font-semibold text-gray-900 border-b border-gray-200">
                    Business Media
                  </h3>
                  
                  {/* Logo Upload */}
                  <div>
                    <label className="block mb-3 text-sm font-medium text-gray-700">
                      Business Logo
                    </label>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 overflow-hidden bg-gray-200 border-2 border-gray-300 border-dashed rounded-xl">
                          {logo ? (
                            <img src={logo} alt="Business Logo" className="object-cover w-full h-full" />
                          ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                              <FiImage size={20} />
                              <span className="mt-1 text-xs">No Logo</span>
                            </div>
                          )}
                        </div>
                        {uploading.logo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                            <div className="w-6 h-6 border-2 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          disabled={uploading.logo}
                          className="flex items-center gap-2 px-4 py-2 text-indigo-600 transition-all border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50"
                        >
                          <FiUpload size={16} />
                          {uploading.logo ? 'Uploading...' : 'Upload Logo'}
                        </button>
                        <p className="text-xs text-gray-500">
                          Recommended: Square image, max 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="p-6 space-y-6 bg-gray-50 rounded-xl">
                  <h3 className="pb-2 text-lg font-semibold text-gray-900 border-b border-gray-200">
                    Social Media & Website
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center w-20 gap-2 text-sm font-medium text-gray-700">
                        <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-600 to-pink-500"></div>
                        Instagram
                      </span>
                      <div className="flex items-center flex-1 gap-2">
                        <span className="text-sm text-gray-500">instagram.com/</span>
                        <input
                          type="text"
                          name="instagram"
                          value={formData.socialMedia.instagram}
                          onChange={handleSocialChange}
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="username"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center w-20 gap-2 text-sm font-medium text-gray-700">
                        <div className="w-5 h-5 bg-blue-600 rounded"></div>
                        Facebook
                      </span>
                      <div className="flex items-center flex-1 gap-2">
                        <span className="text-sm text-gray-500">facebook.com/</span>
                        <input
                          type="text"
                          name="facebook"
                          value={formData.socialMedia.facebook}
                          onChange={handleSocialChange}
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="username"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center w-20 gap-2 text-sm font-medium text-gray-700">
                        <FiLink size={16} />
                        Website
                      </span>
                      <input
                        type="url"
                        name="website"
                        value={formData.socialMedia.website}
                        onChange={handleSocialChange}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              // View Mode
              <div className="space-y-8">
                {/* Business Information Display */}
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="pb-2 mb-6 text-lg font-semibold text-gray-900 border-b border-gray-200">
                    Business Information
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-1 text-sm font-medium text-gray-500">Business Name</h4>
                      <p className="font-medium text-gray-900">{formData.businessName}</p>
                    </div>
                    <div>
                      <h4 className="mb-1 text-sm font-medium text-gray-500">Contact Email</h4>
                      <p className="text-gray-900">{formData.email}</p>
                    </div>
                    <div>
                      <h4 className="mb-1 text-sm font-medium text-gray-500">Phone Number</h4>
                      <p className="text-gray-900">{formData.phone}</p>
                    </div>
                    <div>
                      <h4 className="mb-1 text-sm font-medium text-gray-500">Business Address</h4>
                      <p className="text-gray-900">{formData.address}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="mb-1 text-sm font-medium text-gray-500">Description</h4>
                      <p className="leading-relaxed text-gray-900">{formData.description}</p>
                    </div>
                  </div>
                </div>

                {/* Social Media Links Display */}
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="pb-2 mb-6 text-lg font-semibold text-gray-900 border-b border-gray-200">
                    Online Presence
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {formData.socialMedia.instagram && (
                      <a
                        href={`https://instagram.com/${formData.socialMedia.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 text-purple-700 transition-colors bg-purple-100 rounded-lg hover:bg-purple-200"
                      >
                        <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-600 to-pink-500"></div>
                        Instagram
                      </a>
                    )}
                    {formData.socialMedia.facebook && (
                      <a
                        href={`https://facebook.com/${formData.socialMedia.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 text-blue-700 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200"
                      >
                        <div className="w-4 h-4 bg-blue-600 rounded"></div>
                        Facebook
                      </a>
                    )}
                    {formData.socialMedia.website && (
                      <a
                        href={formData.socialMedia.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        <FiLink size={16} />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Custom scrollbar styling */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
        </>
      )}
    </div>
  );
};

export default VendorDashboard;