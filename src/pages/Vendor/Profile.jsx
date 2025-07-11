import React, { useState } from 'react';
import { FiEdit, FiUpload, FiLink, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const VendorProfile = () => {
  // Form state
  const [formData, setFormData] = useState({
    businessName: 'Sunset Café',
    description: 'A cozy café with ocean views and artisanal coffee.',
    email: 'contact@sunsetcafe.com',
    phone: '+1 (555) 123-4567',
    address: '123 Beachside Ave, Miami, FL',
    socialMedia: {
      instagram: 'sunsetcafe',
      facebook: 'sunsetcafemiami',
      website: 'https://sunsetcafe.com'
    }
  });

  const [logo, setLogo] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

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
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      setLogo(URL.createObjectURL(file));
    }
  };

  // Handle gallery upload
  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter(file => file.type.match('image.*'));
    
    const newGallery = validImages.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file)
    }));

    setGallery(prev => [...prev, ...newGallery]);
  };

  // Remove gallery image
  const removeImage = (id) => {
    setGallery(prev => prev.filter(img => img.id !== id));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.businessName) newErrors.businessName = 'Business name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email address';
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // TODO: Submit to backend
    setIsEditing(false);
    setErrors({});
  };

  return (
    <section className="p-6 bg-white rounded-lg shadow-md vendor-section">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Business Profile</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <FiEdit /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
            >
              <FiCheckCircle /> Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 text-gray-800 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              <FiXCircle /> Cancel
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Business Name*</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${errors.businessName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.businessName && <p className="mt-1 text-sm text-red-500">{errors.businessName}</p>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Contact Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Business Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  disabled // Admin verifies this
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Tell travelers about your business..."
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Business Logo</h3>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 overflow-hidden bg-gray-200 rounded-full">
                {logo ? (
                  <img src={logo} alt="Business Logo" className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    No Logo
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 px-4 py-2 text-gray-800 transition-colors bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                <FiUpload /> Upload Logo
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Gallery Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Business Gallery</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {gallery.map((img) => (
                <div key={img.id} className="relative group">
                  <img src={img.url} alt="Gallery" className="object-cover w-full h-32 rounded-lg" />
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute p-1 text-white transition-opacity bg-red-500 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100"
                  >
                    <FiXCircle size={16} />
                  </button>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center h-32 transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-indigo-500">
                <FiUpload size={24} className="mb-2 text-gray-400" />
                <span className="text-sm text-gray-500">Upload Images</span>
                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Social Media Links</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-24 text-sm font-medium text-gray-700">Instagram</span>
                <div className="flex items-center flex-1 gap-2">
                  <span className="text-gray-400">instagram.com/</span>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.socialMedia.instagram}
                    onChange={handleSocialChange}
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                    placeholder="username"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-24 text-sm font-medium text-gray-700">Facebook</span>
                <div className="flex items-center flex-1 gap-2">
                  <span className="text-gray-400">facebook.com/</span>
                  <input
                    type="text"
                    name="facebook"
                    value={formData.socialMedia.facebook}
                    onChange={handleSocialChange}
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                    placeholder="username"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-24 text-sm font-medium text-gray-700">Website</span>
                <input
                  type="url"
                  name="website"
                  value={formData.socialMedia.website}
                  onChange={handleSocialChange}
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        </form>
      ) : (
        // View Mode
        <div className="space-y-6">
          {/* Business Info */}
          <div className="space-y-4">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 overflow-hidden bg-gray-200 rounded-full">
                {logo ? (
                  <img src={logo} alt="Business Logo" className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    No Logo
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{formData.businessName}</h3>
                <p className="mt-1 text-gray-600">{formData.description}</p>
                <div className="flex gap-4 mt-3">
                  {formData.socialMedia.instagram && (
                    <a
                      href={`https://instagram.com/${formData.socialMedia.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-indigo-600 hover:underline"
                    >
                      <FiLink size={14} /> Instagram
                    </a>
                  )}
                  {formData.socialMedia.facebook && (
                    <a
                      href={`https://facebook.com/${formData.socialMedia.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-indigo-600 hover:underline"
                    >
                      <FiLink size={14} /> Facebook
                    </a>
                  )}
                  {formData.socialMedia.website && (
                    <a
                      href={formData.socialMedia.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-indigo-600 hover:underline"
                    >
                      <FiLink size={14} /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Contact Email</h4>
                <p className="text-gray-800">{formData.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
                <p className="text-gray-800">{formData.phone}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-500">Business Address</h4>
                <p className="text-gray-800">{formData.address}</p>
              </div>
            </div>
          </div>

          {/* Gallery Preview */}
          {gallery.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-700">Gallery</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {gallery.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt="Gallery"
                    className="object-cover w-full h-32 rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default VendorProfile;