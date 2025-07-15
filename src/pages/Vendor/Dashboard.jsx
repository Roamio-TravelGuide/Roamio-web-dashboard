import React, { useState, useRef, useEffect } from "react";
import { FiEdit, FiUpload, FiCheckCircle, FiXCircle, FiCamera, FiImage, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import { 
  getVendorProfile, 
  updateVendorProfile, 
  uploadVendorLogo, 
  uploadVendorCover 
} from "../../api/vendor/vendorApi";

const VendorDashboard = () => {
  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // State for vendor data
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const initialFormState = {
    businessName: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    socialMedia: {
      instagram: "",
      facebook: "",
      website: ""
    }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [logo, setLogo] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState({ logo: false, cover: false });
  const [originalData, setOriginalData] = useState(null);

  // Fetch vendor profile on component mount
  useEffect(() => {
   // if (!isToken) return;
    const fetchVendorProfile = async () => {
      try {
        setLoading(true);
        const response = await getVendorProfile();
        const data = response.data.data;

        setVendorData(data);
        setFormData({
          businessName: data.businessName || "",
          description: data.description || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          socialMedia: data.socialMedia || {
            instagram: "",
            facebook: "",
            website: ""
          }
        });

        if (data.logoUrl) setLogo(data.logoUrl);
        if (data.coverPhotoUrl) setCoverPhoto(data.coverPhotoUrl);

        setOriginalData({
          businessName: data.businessName || "",
          description: data.description || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          socialMedia: data.socialMedia || {
            instagram: "",
            facebook: "",
            website: ""
          }
        });
      } catch (err) {
        console.error("Error fetching vendor profile:", err);
        setError(err.response?.data?.message || "Failed to load vendor profile");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProfile();
  }, []);

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
    if (!file) return;

    try {
      setUploading(prev => ({ ...prev, logo: true }));
      setErrors(prev => ({ ...prev, logo: null }));
      
      const response = await uploadVendorLogo(file);
      setLogo(response.data.logoUrl);
      toast.success("Logo uploaded successfully");
    } catch (err) {
      console.error("Error uploading logo:", err);
      setErrors(prev => ({
        ...prev,
        logo: err.response?.data?.message || err.message || "Failed to upload logo"
      }));
      toast.error(err.response?.data?.message || err.message || "Failed to upload logo");
    } finally {
      setUploading(prev => ({ ...prev, logo: false }));
    }
  };

  // Handle cover photo upload
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(prev => ({ ...prev, cover: true }));
      setErrors(prev => ({ ...prev, cover: null }));
      
      const response = await uploadVendorCover(file);
      setCoverPhoto(response.data.coverUrl);
      toast.success("Cover image uploaded successfully");
    } catch (err) {
      console.error("Error uploading cover:", err);
      setErrors(prev => ({
        ...prev,
        cover: err.response?.data?.message || err.message || "Failed to upload cover"
      }));
      toast.error(err.response?.data?.message || err.message || "Failed to upload cover");
    } finally {
      setUploading(prev => ({ ...prev, cover: false }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }
    if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email address";
    }
    if (
      formData.socialMedia.website &&
      !formData.socialMedia.website.startsWith("http")
    ) {
      newErrors.website = "Website must start with http:// or https://";
    }
    return newErrors;
  };

  // Handle cancel editing
  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
    }
    setIsEditing(false);
    setErrors({});
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const response = await updateVendorProfile(formData);
      const updatedData = response.data.data;

      // Update all relevant states
      setVendorData(prev => ({
        ...prev,
        businessName: updatedData.businessName,
        description: updatedData.description,
        email: updatedData.user?.email || formData.email,
        phone: updatedData.user?.phone_no || formData.phone,
        socialMedia: updatedData.social_media_links
      }));
      
      setOriginalData(formData);
      setIsEditing(false);
      setErrors({});

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      setErrors({
        ...errors,
        form: err.response?.data?.message || "Failed to update profile"
      });
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading vendor profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-md p-6 text-center bg-white rounded-lg shadow">
          <FiAlertCircle className="w-12 h-12 mx-auto text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-800">
            Error Loading Profile
          </h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 mt-4 text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No vendor data state
  if (!vendorData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 text-center bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800">
            No Vendor Data Found
          </h2>
          <p className="mt-2 text-gray-600">
            Please check your account settings
          </p>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error message for form-level errors */}
      {errors.form && (
        <div className="container px-6 py-3 mx-auto">
          <div className="flex items-center p-4 text-red-800 bg-red-100 rounded-lg">
            <FiAlertCircle className="mr-2" />
            {errors.form}
          </div>
        </div>
      )}

      {/* Cover Photo Section */}
      <div className="relative w-full h-80 md:h-96">
        <div className="relative w-full h-full overflow-hidden bg-gray-200">
          {coverPhoto ? (
            <img
              src={coverPhoto}
              alt="Business Cover"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              <FiImage size={48} />
            </div>
          )}
          
          {/* Cover Photo Upload Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={uploading.cover}
              className="flex items-center gap-2 px-4 py-2 text-white transition-all rounded-lg bg-black/50 hover:bg-black/70 disabled:opacity-50"
            >
              {uploading.cover ? (
                <>
                  <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <FiCamera size={16} />
                  <span>Change Cover</span>
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
        </div>

        {/* Business Info Card */}
        <div className="absolute bottom-0 left-0 right-0 w-full max-w-5xl px-6 mx-auto -mb-16">
          <div className="p-6 mx-auto bg-white border border-gray-100 rounded-2xl shadow-xl">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-end">
              {/* Logo Section */}
              <div className="relative group">
                <div className="w-24 h-24 -mt-12 overflow-hidden bg-gray-100 border-4 border-white rounded-2xl shadow-lg md:w-32 md:h-32 md:-mt-16">
                  {logo ? (
                    <img
                      src={logo}
                      alt="Business Logo"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      <FiImage size={24} />
                    </div>
                  )}
                </div>
                
                {/* Logo Upload Button */}
                <button
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploading.logo}
                  className="absolute inset-0 flex items-center justify-center w-24 h-24 -mt-12 transition-all md:w-32 md:h-32 md:-mt-16 bg-black/0 hover:bg-black/50 rounded-2xl"
                >
                  {uploading.logo ? (
                    <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  ) : (
                    <FiCamera size={20} className="text-white opacity-0 group-hover:opacity-100" />
                  )}
                </button>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>

              {/* Business Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                      {formData.businessName}
                    </h1>
                    <p className="mt-2 text-gray-600 line-clamp-2">
                      {formData.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Profile Section */}
      <div className="container px-6 pt-24 mx-auto">
        <section className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Business Profile</h2>
              <p className="mt-1 text-gray-600">Manage your business information</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 text-white transition-all bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                <FiEdit size={18} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-3 text-white transition-all bg-green-600 rounded-lg hover:bg-green-700"
                >
                  <FiCheckCircle size={18} /> Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-3 text-gray-700 transition-all bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <FiXCircle size={18} /> Cancel
                </button>
              </div>
            )}
          </div>

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
                      className={`w-full p-4 border rounded-xl ${
                        errors.businessName ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="Enter your business name"
                    />
                    {errors.businessName && (
                      <p className="mt-2 text-sm text-red-600">
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
                      className={`w-full p-4 border rounded-xl ${
                        errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">
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
                      className="w-full p-4 border border-gray-300 rounded-xl"
                      placeholder="+1 (555) 123-4567"
                    />
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
                    className="w-full p-4 border border-gray-300 rounded-xl"
                    placeholder="Tell travelers about your business..."
                  />
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
                      Instagram
                    </span>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.socialMedia.instagram}
                      onChange={handleSocialChange}
                      className="flex-1 p-3 border border-gray-300 rounded-lg"
                      placeholder="username"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center w-20 gap-2 text-sm font-medium text-gray-700">
                      Facebook
                    </span>
                    <input
                      type="text"
                      name="facebook"
                      value={formData.socialMedia.facebook}
                      onChange={handleSocialChange}
                      className="flex-1 p-3 border border-gray-300 rounded-lg"
                      placeholder="username"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center w-20 gap-2 text-sm font-medium text-gray-700">
                      Website
                    </span>
                    <input
                      type="url"
                      name="website"
                      value={formData.socialMedia.website}
                      onChange={handleSocialChange}
                      className={`flex-1 p-3 border rounded-lg ${
                        errors.website ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="https://yourwebsite.com"
                    />
                    {errors.website && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.website}
                      </p>
                    )}
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
                    <h4 className="mb-1 text-sm font-medium text-gray-500">
                      Business Name
                    </h4>
                    <p className="font-medium text-gray-900">
                      {formData.businessName}
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-gray-500">
                      Contact Email
                    </h4>
                    <p className="text-gray-900">{formData.email}</p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-gray-500">
                      Phone Number
                    </h4>
                    <p className="text-gray-900">
                      {formData.phone || "Not provided"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="mb-1 text-sm font-medium text-gray-500">
                      Description
                    </h4>
                    <p className="text-gray-900">
                      {formData.description || "No description provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media Links Display */}
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="pb-2 mb-6 text-lg font-semibold text-gray-900 border-b border-gray-200">
                  Online Presence
                </h3>
                <div className="flex flex-wrap gap-4">
                  {formData.socialMedia.instagram ? (
                    <a
                      href={`https://instagram.com/${formData.socialMedia.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200"
                    >
                      Instagram
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 text-gray-500 bg-gray-100 rounded-lg">
                      Instagram not set
                    </div>
                  )}

                  {formData.socialMedia.facebook ? (
                    <a
                      href={`https://facebook.com/${formData.socialMedia.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200"
                    >
                      Facebook
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 text-gray-500 bg-gray-100 rounded-lg">
                      Facebook not set
                    </div>
                  )}

                  {formData.socialMedia.website ? (
                    <a
                      href={formData.socialMedia.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Website
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 text-gray-500 bg-gray-100 rounded-lg">
                      Website not set
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default VendorDashboard;