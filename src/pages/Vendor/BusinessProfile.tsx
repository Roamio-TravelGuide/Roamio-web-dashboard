import React, { useState } from 'react';
import { MapPin, Phone, Mail, Globe, Clock, Edit3, Save, X, Plus, Trash2, Star, Camera, AlertCircle, Award, Users, TrendingUp, Eye, Heart, Share2, ExternalLink, Image, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BusinessData {
  name: string;
  type: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  amenities: string[];
  priceRange: string;
  rating: number;
  totalReviews: number;
}
const BusinessProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialData: BusinessData = {
    name: 'Royal Hotel & Restaurant',
    type: 'Hotel & Restaurant',
    description: 'A luxurious hotel and fine dining restaurant located in the heart of the city. We offer world-class accommodation and exquisite culinary experiences for tourists and locals alike. Our commitment to excellence has made us a premier destination for discerning travelers.',
    address: '123 Tourism Street, City Center, TC 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@royalhotel.com',
    website: 'www.royalhotel.com',
    hours: 'Mon-Sun: 24/7 (Hotel) | Restaurant: 6:00 AM - 11:00 PM',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa Services', 'Valet Parking', 'Room Service', 'Fitness Center', 'Business Center', 'Pet Friendly'],
    priceRange: '$150 - $400',
    rating: 4.8,
    totalReviews: 1247
  };

  const [originalData] = useState<BusinessData>(initialData);
  const [formData, setFormData] = useState<BusinessData>(initialData);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Business name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setErrors({});
    setIsEditing(false);
    setNewAmenity('');
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-700"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-32 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-2xl font-bold border border-white/20 shadow-2xl">
                    {formData.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">{formData.name}</h1>
                  <div className="flex items-center space-x-4">
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium border border-white/30">
                      {formData.type}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(formData.rating)}
                      </div>
                      <span className="text-white/90 font-medium">{formData.rating}</span>
                      <span className="text-white/70">({formData.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-xl text-white/90 leading-relaxed max-w-3xl mb-8">
                {formData.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <MapPin className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">City Center Location</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <Award className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Premium Service</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <Users className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">1000+ Happy Guests</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50 min-w-[140px]"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-white/90 transition-all duration-300 disabled:opacity-50 min-w-[140px] shadow-xl font-semibold"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-white/90 transition-all duration-300 shadow-xl font-semibold"
                  >
                    <Edit3 className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </button>
                  <button onClick={() => navigate("/vendor/imagegallery")} className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/20 transition-all duration-300">
                    <Image className="w-5 h-5" />
                    <span>Manage Gallery</span>
                  </button>
                  <button onClick={() => navigate("/vendor/payments")} className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/20 transition-all duration-300">
                    <CreditCard className="w-5 h-5" />
                    <span>Subscription</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 -mt-20 relative z-10">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12.4K</p>
                <p className="text-sm text-gray-600">Profile Views</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">94%</p>
                <p className="text-sm text-gray-600">Satisfaction Rate</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">856</p>
                <p className="text-sm text-gray-600">Favorites</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
                <p className="text-gray-600 mt-1">Manage your core business details</p>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Business Name</label>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                          placeholder="Enter business name"
                        />
                        {errors.name && (
                          <div className="flex items-center space-x-2 mt-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.name}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-xl border-2 border-transparent">
                        <p className="text-gray-900 font-semibold text-lg">{formData.name}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Business Type</label>
                    {isEditing ? (
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                      >
                        <option value="Hotel">Hotel</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Hotel & Restaurant">Hotel & Restaurant</option>
                        <option value="Tour Guide">Tour Guide</option>
                        <option value="Travel Agency">Travel Agency</option>
                        <option value="Attraction">Tourist Attraction</option>
                        <option value="Transportation">Transportation Service</option>
                      </select>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-xl border-2 border-transparent">
                        <p className="text-gray-900 font-semibold">{formData.type}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                  {isEditing ? (
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-200 hover:border-gray-300"
                      placeholder="Describe your business..."
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-xl border-2 border-transparent">
                      <p className="text-gray-700 leading-relaxed">{formData.description}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="priceRange"
                      value={formData.priceRange}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                      placeholder="e.g., $50 - $200 per night"
                    />
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                      <p className="text-green-700 font-bold text-xl">{formData.priceRange} <span className="text-sm font-normal">per night</span></p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-purple-50 px-8 py-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Amenities & Services</h2>
                <p className="text-gray-600 mt-1">Showcase what makes your business special</p>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {formData.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="group relative flex items-center justify-between px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 text-blue-700 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                      <span className="flex-1">{amenity}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeAmenity(index)}
                          className="ml-3 p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      placeholder="Add new amenity..."
                    />
                    <button
                      onClick={addAmenity}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-green-50 px-6 py-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                <p className="text-gray-600 mt-1">How customers can reach you</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Address</label>
                  {isEditing ? (
                    <div>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-200 ${errors.address ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                        placeholder="Enter full address"
                      />
                      {errors.address && (
                        <div className="flex items-center space-x-2 mt-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.address}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-blue-200">
                      <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 font-medium">{formData.address}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Phone</label>
                  {isEditing ? (
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && (
                        <div className="flex items-center space-x-2 mt-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.phone}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border-2 border-green-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                      <Phone className="w-5 h-5 text-green-600" />
                      <a href={`tel:${formData.phone}`} className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                        {formData.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Email</label>
                  {isEditing ? (
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <div className="flex items-center space-x-2 mt-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.email}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border-2 border-purple-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                      <Mail className="w-5 h-5 text-purple-600" />
                      <a href={`mailto:${formData.email}`} className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                        {formData.email}
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Website</label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                      placeholder="Enter website URL"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border-2 border-indigo-200 hover:shadow-md transition-all duration-200 cursor-pointer group">
                      <Globe className="w-5 h-5 text-indigo-600" />
                      <a 
                        href={`https://${formData.website.replace(/^https?:\/\//, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-indigo-600 transition-colors font-medium flex-1"
                      >
                        {formData.website}
                      </a>
                      <ExternalLink className="w-4 h-4 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Operating Hours</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="hours"
                      value={formData.hours}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                      placeholder="Enter operating hours"
                    />
                  ) : (
                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-gray-50 to-yellow-50 rounded-xl border-2 border-yellow-200">
                      <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <p className="text-gray-700 font-medium">{formData.hours}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;