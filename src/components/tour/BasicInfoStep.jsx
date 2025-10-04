import React, { useCallback, useState, useEffect, useRef } from 'react';
import { UploadCloud, X, Info, ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getMediaUrl } from '../../utils/constants';
import { validateFile } from '../../utils/tourUtils';
import { ProgressBar, SectionHeader, ConfirmationDialog } from './common';

// Sub-components
const FileInputButton = ({ onChange, disabled }) => (
  <label className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-md cursor-pointer bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed">
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

const ImagePreview = ({ previewImage, isUploading, onRemove, isEditable }) => (
  <div className="relative aspect-w-16 aspect-h-9 group">
    <img
      src={previewImage}
      alt="Tour cover preview"
      className="object-cover w-full h-full rounded-lg shadow-sm"
      onError={() => {
        toast.error('Failed to load image. Please re-upload.');
        if (isEditable) onRemove();
      }}
    />
    {isEditable && (
      <button
        onClick={onRemove}
        className="absolute p-2 text-white transition-opacity duration-200 bg-red-500 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100 hover:bg-red-600"
        aria-label="Remove image"
      >
        <X size={16} />
      </button>
    )}
  </div>
);

const UploadArea = ({ 
  isDragging, 
  isUploading, 
  uploadError, 
  onFileInputChange,
  onDragOver,
  onDragLeave,
  onDrop,
  isEditable 
}) => (
  <div
    className={`border-2 border-dashed rounded-lg transition-all aspect-w-16 aspect-h-9 flex items-center justify-center ${
      isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
    } ${!isEditable ? 'bg-gray-50 cursor-not-allowed' : ''}`}
    onDragOver={isEditable ? onDragOver : undefined}
    onDragLeave={isEditable ? onDragLeave : undefined}
    onDrop={isEditable ? onDrop : undefined}
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
        {isUploading ? 'Uploading...' : 
         isDragging ? 'Drop your image here' : 
         !isEditable ? 'No cover image' : 'Upload a cover image'}
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
      
      {isUploading && <ProgressBar progress={0} className="w-1/2 mx-auto mt-3" />}
    </div>
  </div>
);

const BestPracticesList = () => {
  const tips = [
    "Use a clear, descriptive title with location and activity type",
    "Start your description with the most exciting aspect",
    "Include practical details like duration and difficulty level"
  ];

  return (
    <ul className="space-y-3">
      {tips.map((tip, index) => (
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
};

// Main component
export const BasicInfoStep = ({ tourData, onUpdate, isEditable = true }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const fileInputRef = useRef();

  // Initialize preview image
  useEffect(() => {
    if (tourData.cover_image_file) {
      const url = URL.createObjectURL(tourData.cover_image_file);
      setPreviewImage(getMediaUrl(url));
      return () => URL.revokeObjectURL(url);
    } else if (tourData.cover_image_url) {
      setPreviewImage(getMediaUrl(tourData.cover_image_url));
    } else {
      setPreviewImage(null);
    }
  }, [tourData.cover_image_file, tourData.cover_image_url]);

  const handleError = useCallback((message, error) => {
    console.error('Error:', error);
    setUploadError(message);
    toast.error(message);
  }, []);

  const handleImageUpload = useCallback(async (file) => {
    if (!isEditable) return;
    
    try {
      validateFile(file);
      
      setIsUploading(true);
      setUploadError(null);
      
      const localUrl = URL.createObjectURL(file);
      setPreviewImage(localUrl);

      onUpdate({ 
        cover_image_file: file,
        cover_image_temp: undefined,
        cover_image_url: undefined
      });
      
      toast.success('Image selected successfully!');
    } catch (error) {
      handleError(error.message || 'Failed to process image. Please try again.', error);
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  }, [onUpdate, isEditable, handleError]);

  const handleDrop = useCallback((e) => {
    if (!isEditable) return;
    
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) {
      handleImageUpload(file);
    } else {
      handleError('Only image files are allowed');
    }
  }, [handleImageUpload, handleError, isEditable]);

  const handleFileInput = useCallback((e) => {
    if (!isEditable) return;
    
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
      e.target.value = '';
    }
  }, [handleImageUpload, isEditable]);

  const confirmRemoveImage = useCallback(() => {
    if (!isEditable) return;
    
    setPreviewImage(null);
    onUpdate({ 
      cover_image_file: undefined,
      cover_image_temp: undefined,
      cover_image_url: undefined 
    });
    toast.success('Image removed successfully');
    setShowConfirmDialog(false);
  }, [onUpdate, isEditable]);

  const handleDragOver = useCallback((e) => {
    if (!isEditable) return;
    e.preventDefault();
    setIsDragging(true);
  }, [isEditable]);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  return (
    <div className="mx-auto">
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        title="Remove Cover Image"
        message="Are you sure you want to remove this cover image? This action cannot be undone."
        confirmText="Remove Image"
        onConfirm={confirmRemoveImage}
        onCancel={() => setShowConfirmDialog(false)}
      />
      
      {/* Header */}
      <div className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800">Tour Information</h2>
        <p className="mt-2 text-gray-600">
          {isEditable 
            ? 'Provide the essential details for your tour experience' 
            : 'View tour information'
          }
        </p>
        {!isEditable && (
          <div className="px-3 py-1 mt-2 text-sm text-gray-700 bg-gray-100 rounded-full inline-block">
            View mode - editing disabled
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Cover Image Section */}
        <div className="flex-1">
          <section className="flex flex-col h-full overflow-hidden border border-gray-200 rounded-xl">
            <SectionHeader 
              icon={ImageIcon}
              title="Cover Image"
              subtitle={isEditable 
                ? "This will be the main visual representation of your tour" 
                : "Tour cover image"
              }
            />
            
            <div className="flex flex-col flex-1 p-5">
              {previewImage ? (
                <ImagePreview 
                  previewImage={previewImage}
                  isUploading={isUploading}
                  onRemove={() => setShowConfirmDialog(true)}
                  isEditable={isEditable}
                />
              ) : (
                <UploadArea
                  isDragging={isDragging}
                  isUploading={isUploading}
                  uploadError={uploadError}
                  onFileInputChange={handleFileInput}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  isEditable={isEditable}
                />
              )}
            </div>
          </section>
        </div>

        {/* Tour Details Section */}
        <div className="flex flex-col flex-1 gap-6">
          <section className="overflow-hidden border border-gray-200 rounded-xl">
            <SectionHeader 
              title="Tour Details"
              subtitle={isEditable ? "Basic information about your tour" : "Tour details"}
            />
            
            <div className="p-5 space-y-6">
              <div>
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">
                  Tour Title <span className="ml-1 text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={tourData.title}
                  onChange={(e) => isEditable && onUpdate({ title: e.target.value })}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    !isEditable ? 'bg-gray-50 cursor-not-allowed' : 'text-gray-900'
                  }`}
                  placeholder="e.g. Sunset Beach Walking Tour"
                  required
                  disabled={isUploading || !isEditable}
                  readOnly={!isEditable}
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
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    !isEditable ? 'bg-gray-50 cursor-not-allowed' : 'text-gray-900'
                  }`}
                  placeholder="Describe the highlights and unique aspects of your tour..."
                  disabled={isUploading || !isEditable}
                  readOnly={!isEditable}
                />
                <p className="mt-2 text-xs text-gray-500">Recommended length: 150-300 characters</p>
              </div>
            </div>
          </section>

          {/* Best Practices Section */}
          {isEditable && (
            <section className="overflow-hidden border border-gray-200 rounded-xl">
              <SectionHeader icon={Info} title="Best Practices" />
              <div className="p-5">
                <BestPracticesList />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;