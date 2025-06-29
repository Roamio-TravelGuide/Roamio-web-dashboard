import React, { useState, useRef } from 'react';
import { Upload, X, Plus, Edit, Trash2, Image as ImageIcon, Eye, Download, Share2, Filter, Search, Grid, List, Calendar, TrendingUp, AlertCircle, Check } from 'lucide-react';

interface ImageData {
  id: number;
  url: string;
  title: string;
  category: string;
  uploadDate: string;
  views: number;
  size: string;
  featured: boolean;
}

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([
    { id: 1, url: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg', title: 'Hotel Exterior', category: 'exterior', uploadDate: '2024-01-15', views: 1247, size: '2.4 MB', featured: true },
    { id: 2, url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg', title: 'Luxury Suite', category: 'rooms', uploadDate: '2024-01-12', views: 892, size: '1.8 MB', featured: false },
    { id: 3, url: 'https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg', title: 'Restaurant Dining', category: 'dining', uploadDate: '2024-01-10', views: 1156, size: '3.1 MB', featured: true },
    { id: 4, url: 'https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg', title: 'Hotel Lobby', category: 'interior', uploadDate: '2024-01-08', views: 743, size: '2.7 MB', featured: false },
    { id: 5, url: 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg', title: 'Swimming Pool', category: 'amenities', uploadDate: '2024-01-05', views: 1389, size: '2.2 MB', featured: true },
    { id: 6, url: 'https://images.pexels.com/photos/1833336/pexels-photo-1833336.jpeg', title: 'Spa Services', category: 'amenities', uploadDate: '2024-01-03', views: 967, size: '1.9 MB', featured: false },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageData | null>(null);
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageCategory, setNewImageCategory] = useState('exterior');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'all', label: 'All Photos', count: images.length },
    { id: 'exterior', label: 'Exterior', count: images.filter(img => img.category === 'exterior').length },
    { id: 'rooms', label: 'Rooms', count: images.filter(img => img.category === 'rooms').length },
    { id: 'dining', label: 'Dining', count: images.filter(img => img.category === 'dining').length },
    { id: 'interior', label: 'Interior', count: images.filter(img => img.category === 'interior').length },
    { id: 'amenities', label: 'Amenities', count: images.filter(img => img.category === 'amenities').length },
  ];

  const filteredImages = images.filter(img => {
    const matchesCategory = selectedCategory === 'all' || img.category === selectedCategory;
    const matchesSearch = img.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalViews = images.reduce((sum, img) => sum + img.views, 0);
  const featuredImages = images.filter(img => img.featured);
  const recentUploads = images.filter(img => {
    const uploadDate = new Date(img.uploadDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return uploadDate > thirtyDaysAgo;
  });

  const handleDeleteImage = (id: number) => {
    setImages(images.filter(img => img.id !== id));
    setSelectedImages(selectedImages.filter(imgId => imgId !== id));
  };

  const handleBulkDelete = () => {
    setImages(images.filter(img => !selectedImages.includes(img.id)));
    setSelectedImages([]);
  };

  const toggleImageSelection = (id: number) => {
    setSelectedImages(prev => 
      prev.includes(id) 
        ? prev.filter(imgId => imgId !== id)
        : [...prev, id]
    );
  };

  const toggleFeatured = (id: number) => {
    setImages(images.map(img => 
      img.id === id ? { ...img, featured: !img.featured } : img
    ));
  };

  const handleEditImage = (image: ImageData) => {
    setEditingImage(image);
    setNewImageTitle(image.title);
    setNewImageCategory(image.category);
  };

  const saveImageEdit = () => {
    if (editingImage) {
      setImages(images.map(img => 
        img.id === editingImage.id 
          ? { ...img, title: newImageTitle, category: newImageCategory }
          : img
      ));
      setEditingImage(null);
      setNewImageTitle('');
      setNewImageCategory('exterior');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsUploadModalOpen(false);
          setUploadProgress(0);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Image Gallery</h1>
            <p className="text-gray-600 mt-1">Manage your business photos and showcase your venue</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {selectedImages.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Selected ({selectedImages.length})</span>
              </button>
            )}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Photos</span>
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{images.length}</p>
                <p className="text-sm text-gray-600">Total Photos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{recentUploads.length}</p>
                <p className="text-sm text-gray-600">This Month</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{featuredImages.length}</p>
                <p className="text-sm text-gray-600">Featured</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search photos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>
              <div className="flex gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label} ({category.count})
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Image Display */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {filteredImages.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map(image => (
                  <div key={image.id} className="group relative bg-gray-100 rounded-xl overflow-hidden aspect-video shadow-sm hover:shadow-lg transition-all duration-300">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Selection Checkbox */}
                    <div className="absolute top-3 left-3">
                      <button
                        onClick={() => toggleImageSelection(image.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          selectedImages.includes(image.id)
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {selectedImages.includes(image.id) && <Check className="w-3 h-3" />}
                      </button>
                    </div>

                    {/* Featured Badge */}
                    {image.featured && (
                      <div className="absolute top-3 right-3">
                        <div className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                          Featured
                        </div>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300">
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center justify-between">
                          <div className="text-white">
                            <h3 className="font-semibold text-sm">{image.title}</h3>
                            <p className="text-xs text-gray-200 capitalize">{image.category}</p>
                            <div className="flex items-center space-x-3 mt-1 text-xs text-gray-300">
                              <span className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{image.views}</span>
                              </span>
                              <span>{formatDate(image.uploadDate)}</span>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => toggleFeatured(image.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                image.featured ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 hover:text-yellow-600'
                              }`}
                              title={image.featured ? 'Remove from featured' : 'Add to featured'}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditImage(image)}
                              className="p-2 bg-white rounded-lg text-gray-700 hover:text-blue-600 transition-colors"
                              title="Edit image"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteImage(image.id)}
                              className="p-2 bg-white rounded-lg text-gray-700 hover:text-red-600 transition-colors"
                              title="Delete image"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredImages.map(image => (
                  <div key={image.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <button
                      onClick={() => toggleImageSelection(image.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedImages.includes(image.id)
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {selectedImages.includes(image.id) && <Check className="w-3 h-3" />}
                    </button>
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{image.title}</h3>
                        {image.featured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 capitalize">{image.category}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{image.views} views</span>
                        </span>
                        <span>{formatDate(image.uploadDate)}</span>
                        <span>{image.size}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleFeatured(image.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          image.featured ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400 hover:text-yellow-600'
                        }`}
                        title={image.featured ? 'Remove from featured' : 'Add to featured'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditImage(image)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit image"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteImage(image.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No photos found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm ? `No photos match "${searchTerm}"` : 'Upload some photos to showcase your business and attract more customers'}
              </p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                Upload Your First Photos
              </button>
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upload Photos</h2>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop your photos here</h3>
                <p className="text-gray-600 mb-4">or click to browse from your device</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Choose Files
                </button>
                <p className="text-xs text-gray-500 mt-3">Supports JPG, PNG, WebP up to 10MB each</p>
              </div>
              
              {isUploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Uploading...</span>
                    <span className="text-sm text-gray-500">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Default Category</label>
                <select 
                  value={newImageCategory}
                  onChange={(e) => setNewImageCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="exterior">Exterior</option>
                  <option value="rooms">Rooms</option>
                  <option value="dining">Dining</option>
                  <option value="interior">Interior</option>
                  <option value="amenities">Amenities</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={isUploading}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Upload Photos'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Image Modal */}
        {editingImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Photo</h2>
                <button
                  onClick={() => setEditingImage(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="mb-6">
                <img
                  src={editingImage.url}
                  alt={editingImage.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Photo Title</label>
                  <input
                    type="text"
                    value={newImageTitle}
                    onChange={(e) => setNewImageTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Enter photo title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select 
                    value={newImageCategory}
                    onChange={(e) => setNewImageCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <option value="exterior">Exterior</option>
                    <option value="rooms">Rooms</option>
                    <option value="dining">Dining</option>
                    <option value="interior">Interior</option>
                    <option value="amenities">Amenities</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setEditingImage(null)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveImageEdit}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;