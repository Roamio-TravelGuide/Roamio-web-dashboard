import React, { useCallback, useState, useEffect } from 'react';
import { UploadCloud, X, Info, Image as ImageIcon } from 'lucide-react';
import { uploadtempcover, viewtempcover } from '../../api/tour/tourApi';
import { useUploadSession } from '../../hooks/useUploadSession';

export const BasicInfoStep = ({ tourData, onUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const sessionId = useUploadSession();
  const [isSessionReady, setIsSessionReady] = useState(false);

  // Track when session is ready
  useEffect(() => {
    if (sessionId) {
      setIsSessionReady(true);
    } else {
      setIsSessionReady(false);
    }
  }, [sessionId]);

  // Handle initial preview setup
  useEffect(() => {
    const setupPreview = async () => {
      try {
        if (tourData.cover_image_temp?.url) {
          setPreviewImage(tourData.cover_image_temp.url);
        } else if (tourData.cover_image_temp?.key) {
          const { url } = await viewtempcover(tourData.cover_image_temp.key);
          setPreviewImage(url);
          onUpdate({
            cover_image_temp: {
              ...tourData.cover_image_temp,
              url: url
            }
          });
        } else if (tourData.cover_image_url) {
          setPreviewImage(tourData.cover_image_url);
        }
      } catch (error) {
        console.error('Preview setup error:', error);
        setUploadError('Failed to load image. Please re-upload.');
      }
    };
    setupPreview();
  }, [tourData.cover_image_url, tourData.cover_image_temp, onUpdate]);

  const uploadToTemp = async (file) => {
    try {
      if (!sessionId) {
        throw new Error('Upload session is not ready yet');
      }

      setIsUploading(true);
      setUploadError(null);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'cover');
      formData.append('sessionId', sessionId);

      console.log('Uploading with sessionId:', sessionId); // Debug log

      const uploadResponse = await uploadtempcover(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      const { url } = await viewtempcover(uploadResponse.key);

      const tempFileData = {
        url: url,
        tempId: uploadResponse.tempId,
        key: uploadResponse.key
      };

      onUpdate({ 
        cover_image_temp: tempFileData,
        cover_image_file: undefined,
        cover_image_url: undefined
      });

      return url;
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.response?.data?.error || error.message || 'Upload failed. Please try again.');
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleImageUpload = useCallback(async (file) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file (JPEG, PNG)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size must be less than 10MB');
      return;
    }

    if (!isSessionReady) {
      setUploadError('Upload service is initializing. Please try again in a moment.');
      return;
    }

    try {
      const localUrl = URL.createObjectURL(file);
      setPreviewImage(localUrl);
      setUploadError(null);
      
      const s3Url = await uploadToTemp(file);
      setPreviewImage(s3Url);
      
      URL.revokeObjectURL(localUrl);
    } catch (error) {
      console.error('Image upload error:', error);
      setPreviewImage(null);
    }
  }, [isSessionReady, onUpdate]);

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]?.type.startsWith('image/')) {
      handleImageUpload(e.dataTransfer.files[0]);
    } else {
      setUploadError('Only image files are allowed');
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files?.[0]) {
      handleImageUpload(e.target.files[0]);
      e.target.value = '';
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setUploadError(null);
    onUpdate({ 
      cover_image_temp: undefined,
      cover_image_file: undefined,
      cover_image_url: undefined 
    });
  };

  const handleImageError = () => {
    setUploadError('Failed to load image. Please re-upload.');
    setPreviewImage(null);
  };

  return (
    <div className="mx-auto">
      {/* Header */}
      <div className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800">Tour Information</h2>
        <p className="mt-2 text-gray-600">Provide the essential details for your tour experience</p>
      </div>

      {/* Horizontal Layout */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left Column - Cover Image */}
        <div className="flex-1">
          <section className="flex flex-col h-full overflow-hidden border border-gray-200 rounded-xl">
            <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
              <h3 className="flex items-center font-medium text-gray-800">
                <ImageIcon className="w-5 h-5 mr-2 text-blue-600" />
                Cover Image
                <span className="ml-1 text-red-500">*</span>
              </h3>
              <p className="mt-1 text-sm text-gray-600">This will be the main visual representation of your tour</p>
            </div>
            
            <div className="flex flex-col flex-1 p-5">
              {previewImage ? (
                <div className="relative aspect-w-16 aspect-h-9 group">
                  <img
                    src={previewImage}
                    alt="Tour cover preview"
                    className="object-cover w-full h-full rounded-lg shadow-sm"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    {isUploading && (
                      <div className="w-full h-1.5 mb-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-1.5 bg-blue-600 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                    {uploadError && (
                      <p className="text-sm text-red-300">{uploadError}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute p-2 text-white transition-opacity duration-200 bg-red-500 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100 hover:bg-red-600"
                    aria-label="Remove image"
                    disabled={isUploading}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg transition-all aspect-w-16 aspect-h-9 flex items-center justify-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={() => setIsDragging(true)}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <div className="w-full p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-teal-100">
                      <UploadCloud className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      {isDragging ? 'Drop your image here' : 'Upload a cover image'}
                    </p>
                    <p className="mb-4 text-xs text-gray-500">or</p>
                    <label className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-md cursor-pointer ${
                      isUploading || !isSessionReady ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700'
                    }`}>
                      <span>
                        {isUploading ? 'Uploading...' : 
                         !isSessionReady ? 'Initializing upload...' : 
                         'Select file'}
                      </span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileInput}
                        disabled={isUploading || !isSessionReady}
                      />
                    </label>
                    <p className="mt-3 text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    {uploadError && (
                      <p className="mt-2 text-xs text-red-500">{uploadError}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Details and Tips */}
        <div className="flex flex-col flex-1 gap-6">
          {/* Tour Details Section */}
          <section className="overflow-hidden border border-gray-200 rounded-xl">
            <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
              <h3 className="font-medium text-gray-800">Tour Details</h3>
              <p className="mt-1 text-sm text-gray-600">Basic information about your tour</p>
            </div>
            
            <div className="p-5 space-y-6">
              <div>
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">
                  Tour Title
                  <span className="ml-1 text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={tourData.title}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Sunset Beach Walking Tour"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={tourData.description || ''}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the highlights and unique aspects of your tour..."
                />
                <p className="mt-2 text-xs text-gray-500">Recommended length: 150-300 characters</p>
              </div>
            </div>
          </section>

          {/* Tips Section */}
          <section className="overflow-hidden border border-gray-200 rounded-xl">
            <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
              <h3 className="flex items-center font-medium text-gray-800">
                <Info className="w-5 h-5 mr-2 text-blue-600" />
                Best Practices
              </h3>
            </div>
            
            <div className="p-5">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3">
                    <div className="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">1</div>
                  </div>
                  <p className="text-sm text-gray-700">Use a clear, descriptive title with location and activity type</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3">
                    <div className="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">2</div>
                  </div>
                  <p className="text-sm text-gray-700">Start your description with the most exciting aspect</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3">
                    <div className="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">3</div>
                  </div>
                  <p className="text-sm text-gray-700">Include practical details like duration and difficulty level</p>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};