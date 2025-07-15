import React, { useCallback, useState, useEffect } from 'react';
import { UploadCloud, X, Info, ImageIcon, Loader2 } from 'lucide-react';
import { uploadtempcover, viewtempcover, deletetempcover } from '../../api/tour/tourApi';
import { useUploadSession } from '../../hooks/useUploadSession';
import { toast } from 'react-hot-toast';

// Constants for better maintainability
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

// Helper components for better organization
const ImagePreview = ({ 
  previewImage, 
  isUploading, 
  uploadProgress, 
  uploadError, 
  isEditable, 
  onRemove 
}) => (
  <div className="relative aspect-w-16 aspect-h-9 group">
    <img
      src={previewImage}
      alt="Tour cover preview"
      className="object-cover w-full h-full rounded-lg shadow-sm"
      onError={() => {
        const errorMessage = 'Failed to load image. Please re-upload.';
        toast.error(errorMessage);
        onRemove();
      }}
    />
    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
      {isUploading && (
        <ProgressBar progress={uploadProgress} />
      )}
      {uploadError && (
        <p className="text-sm text-red-300">{uploadError}</p>
      )}
    </div>
    {isEditable && (
      <RemoveImageButton onClick={onRemove} disabled={isUploading} />
    )}
  </div>
);

const ProgressBar = ({ progress }) => (
  <div className="w-full h-1.5 mb-2 bg-gray-200 rounded-full">
    <div 
      className="h-1.5 bg-blue-600 rounded-full" 
      style={{ width: `${progress}%` }}
    />
  </div>
);

const RemoveImageButton = ({ onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute p-2 text-white transition-opacity duration-200 bg-red-500 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100 hover:bg-red-600"
    aria-label="Remove image"
    disabled={disabled}
  >
    <X size={16} />
  </button>
);

const UploadArea = ({ 
  isDragging, 
  isUploading, 
  uploadProgress, 
  uploadError, 
  isEditable, 
  onFileInputChange 
}) => (
  <div
    className={`border-2 border-dashed rounded-lg transition-all aspect-w-16 aspect-h-9 flex items-center justify-center ${
      isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
    } ${!isEditable ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <div className="w-full p-6 text-center">
      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-teal-100">
        {isUploading ? (
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        ) : (
          <UploadCloud className="w-5 h-5 text-blue-600" />
        )}
      </div>
      <p className="mb-2 text-sm font-medium text-gray-700">
        {isUploading ? 'Uploading...' : isDragging ? 'Drop your image here' : 'Upload a cover image'}
      </p>
      
      {!isUploading && isEditable && (
        <>
          <p className="mb-4 text-xs text-gray-500">or</p>
          <FileInputButton onChange={onFileInputChange} disabled={isUploading} />
        </>
      )}
      
      <p className="mt-3 text-xs text-gray-500">PNG, JPG up to 10MB</p>
      
      {uploadError && (
        <p className="mt-2 text-xs text-red-500">{uploadError}</p>
      )}
      
      {isUploading && (
        <div className="w-1/2 mx-auto mt-3">
          <ProgressBar progress={uploadProgress} />
          <p className="mt-1 text-xs text-center text-gray-500">
            {uploadProgress}% uploaded
          </p>
        </div>
      )}
    </div>
  </div>
);

const FileInputButton = ({ onChange, disabled }) => (
  <label className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-md cursor-pointer bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
    <span>Select file</span>
    <input
      type="file"
      className="sr-only"
      accept="image/*"
      onChange={onChange}
      disabled={disabled}
    />
  </label>
);

const BestPracticesList = () => (
  <ul className="space-y-3">
    {[
      "Use a clear, descriptive title with location and activity type",
      "Start your description with the most exciting aspect",
      "Include practical details like duration and difficulty level"
    ].map((tip, index) => (
      <li key={index} className="flex items-start">
        <div className="flex-shrink-0 mt-1 mr-3">
          <div className="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
            {index + 1}
          </div>
        </div>
        <p className="text-sm text-gray-700">{tip}</p>
      </li>
    ))}
  </ul>
);

export const BasicInfoStep = ({ tourData, onUpdate, isEditable }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const sessionId = useUploadSession();

  // Initialize preview image based on different scenarios
  useEffect(() => {
    const initializePreview = async () => {
      if (isEditable && tourData.cover_image?.url) {
        setPreviewImage(tourData.cover_image.url);
        return;
      }

      if (tourData.cover_image_temp?.url) {
        setPreviewImage(tourData.cover_image_temp.url);
      } else if (tourData.cover_image_temp?.key) {
        try {
          const { url } = await viewtempcover(tourData.cover_image_temp.key);
          setPreviewImage(url);
          onUpdate({
            cover_image_temp: {
              ...tourData.cover_image_temp,
              url
            }
          });
        } catch (error) {
          handleError('Failed to load image. Please re-upload.', error);
        }
      } else if (tourData.cover_image_url) {
        setPreviewImage(tourData.cover_image_url);
      } else {
        setPreviewImage(null);
      }
    };

    initializePreview();
  }, [tourData, onUpdate, isEditable]);

  const handleError = (message, error) => {
    console.error('Error:', error);
    setUploadError(message);
    toast.error(message);
  };

  const validateFile = (file) => {
    if (!file.type.startsWith('image/') || !ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error('Please upload an image file (JPEG, PNG)');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Image size must be less than 10MB');
    }

    if (!sessionId) {
      throw new Error('Upload service is initializing. Please try again in a moment.');
    }
  };

  const handleImageUpload = useCallback(async (file) => {
    if (!isEditable) return;
    
    try {
      validateFile(file);
      
      const uploadToast = toast.loading('Uploading image...');
      setIsUploading(true);
      setUploadError(null);
      setUploadProgress(0);
      
      // Set temporary local URL for immediate preview
      const localUrl = URL.createObjectURL(file);
      setPreviewImage(localUrl);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'cover');
      formData.append('sessionId', sessionId);

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
          toast.loading(`Uploading image... ${percentCompleted}%`, { id: uploadToast });
        }
      });

      // Get permanent URL from server
      const { url } = await viewtempcover(uploadResponse.key);

      // Update parent component with new image data
      onUpdate({ 
        cover_image_temp: {
          url,
          tempId: uploadResponse.tempId,
          key: uploadResponse.key
        },
        cover_image_file: undefined,
        cover_image_url: undefined
      });

      // Replace temporary URL with permanent one
      setPreviewImage(url);
      URL.revokeObjectURL(localUrl);
      
      toast.success('Image uploaded successfully!', { id: uploadToast });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Upload failed. Please try again.';
      handleError(errorMessage, error);
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [sessionId, onUpdate, isEditable]);

  const handleDrop = (e) => {
    if (!isEditable) return;
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) {
      handleImageUpload(file);
    } else {
      handleError('Only image files are allowed');
    }
  };

  const handleFileInput = (e) => {
    if (!isEditable) return;
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
      e.target.value = ''; // Reset input to allow selecting the same file again
    }
  };

  const removeImage = async () => {
    if (!isEditable) return;
    const deleteToast = toast.loading('Removing image...');
    try {
      if (tourData.cover_image_temp?.key) {
        await deletetempcover(tourData.cover_image_temp.key);
      }
      
      setPreviewImage(null);
      setUploadError(null);
      
      onUpdate({ 
        cover_image_temp: undefined,
        cover_image_file: undefined,
        cover_image_url: undefined 
      });
      
      toast.success('Image removed successfully', { id: deleteToast });
    } catch (error) {
      handleError('Failed to delete image. Please try again.', error);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    if (!isEditable) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    if (!isEditable) return;
    setIsDragging(false);
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
                <ImagePreview 
                  previewImage={previewImage}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  uploadError={uploadError}
                  isEditable={isEditable}
                  onRemove={removeImage}
                />
              ) : (
                <UploadArea
                  isDragging={isDragging}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  uploadError={uploadError}
                  isEditable={isEditable}
                  onFileInputChange={handleFileInput}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
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
                  onChange={(e) => isEditable && onUpdate({ title: e.target.value })}
                  className={`w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isUploading || !isEditable ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  placeholder="e.g. Sunset Beach Walking Tour"
                  required
                  disabled={isUploading || !isEditable}
                />
              </div>

              <div>
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={tourData.description || ''}
                  onChange={(e) => isEditable && onUpdate({ description: e.target.value })}
                  rows={5}
                  className={`w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isUploading || !isEditable ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  placeholder="Describe the highlights and unique aspects of your tour..."
                  disabled={isUploading || !isEditable}
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
              <BestPracticesList />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};