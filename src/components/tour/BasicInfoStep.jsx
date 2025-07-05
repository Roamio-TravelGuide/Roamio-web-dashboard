import React, { useCallback, useState, useEffect } from 'react';
import { UploadCloud, X } from 'lucide-react';

export const BasicInfoStep = ({
  tourData,
  onUpdate
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Initialize preview from existing URL if editing
  useEffect(() => {
    if (tourData.cover_image_url && !tourData.cover_image_file) {
      setPreviewImage(tourData.cover_image_url);
    }
  }, [tourData.cover_image_url]);

  const handleImageUpload = useCallback((file) => {
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    onUpdate({ 
      cover_image_file: file,
      cover_image_url: undefined // Clear existing URL if changing image
    });
  }, [onUpdate]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]?.type.startsWith('image/')) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files?.[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    onUpdate({ 
      cover_image_file: undefined,
      cover_image_url: undefined 
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Basic Tour Information
        </h2>
        <p className="text-gray-600">
          Provide the essential details about your tour package
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Cover Image Upload */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Cover Image *
          </label>
          {previewImage ? (
            <div className="relative group">
              <img
                src={previewImage}
                alt="Tour cover preview"
                className="object-cover w-full h-64 rounded-lg shadow-sm"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute p-2 text-white transition-opacity duration-200 bg-red-500 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100 hover:bg-red-600"
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <UploadCloud size={48} className="text-gray-400" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">
                    {isDragging ? 'Drop image here' : 'Drag and drop your cover image'}
                  </p>
                  <p className="text-xs text-gray-500">or</p>
                </div>
                <label className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700 focus-within:outline-none">
                  Browse Files
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileInput}
                  />
                </label>
                <p className="text-xs text-gray-500">
                  JPEG/PNG, max 10MB. Recommended: 1200×675px (16:9)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">
            Tour Title *
          </label>
          <input
            type="text"
            id="title"
            value={tourData.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter an engaging title for your tour"
            required
          />
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={tourData.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe what makes your tour special..."
          />
        </div>

        {/* Tips Section */}
        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h4 className="mb-2 font-medium text-blue-900">💡 Tips for Success</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Use a descriptive, engaging title that captures the essence of your tour</li>
            <li>• Include key highlights and unique features in your description</li>
            <li>• Choose a high-quality cover image that represents your tour well</li>
            <li>• Price competitively based on tour length and content quality</li>
            <li>• Duration will be validated against your audio content length</li>
          </ul>
        </div>
      </div>
    </div>
  );
};