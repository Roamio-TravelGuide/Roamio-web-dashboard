// import React, { useCallback, useState, useEffect, useRef } from 'react';
// import { UploadCloud, X, Info, ImageIcon, Loader2, AlertTriangle } from 'lucide-react';
// // import { uploadtempcover, viewtempcover, deletetempcover } from '../../api/tour/tourApi';
// import { useUploadSession } from '../../hooks/useUploadSession';
// import { toast } from 'react-hot-toast';

// // Constants
// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

// const convertFileToBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = error => reject(error);
//   });
// };

// const ProgressBar = ({ progress }) => (
//   <div className="w-full h-1.5 mb-2 bg-gray-200 rounded-full">
//     <div 
//       className="h-1.5 bg-blue-600 rounded-full" 
//       style={{ width: `${progress}%` }}
//     />
//   </div>
// );

// const FileInputButton = ({ onChange, disabled }) => (
//   <label className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-md cursor-pointer bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
//     <span>Select file</span>
//     <input
//       type="file"
//       className="sr-only"
//       accept="image/*"
//       onChange={onChange}
//       disabled={disabled}
//     />
//   </label>
// );

// const RemoveImageButton = ({ onClick, disabled }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className="absolute p-2 text-white transition-opacity duration-200 bg-red-500 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100 hover:bg-red-600"
//     aria-label="Remove image"
//     disabled={disabled}
//   >
//     <X size={16} />
//   </button>
// );

// const BestPracticesList = () => {
//   const tips = [
//     "Use a clear, descriptive title with location and activity type",
//     "Start your description with the most exciting aspect",
//     "Include practical details like duration and difficulty level"
//   ];

//   return (
//     <ul className="space-y-3">
//       {tips.map((tip, index) => (
//         <li key={index} className="flex items-start">
//           <div className="flex-shrink-0 mt-1 mr-3">
//             <div className="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
//               {index + 1}
//             </div>
//           </div>
//           <p className="text-sm text-gray-700">{tip}</p>
//         </li>
//       ))}
//     </ul>
//   );
// };

// const ConfirmationDialog = ({
//   isOpen,
//   title,
//   message,
//   onConfirm,
//   onCancel,
//   confirmText = "Delete",
//   cancelText = "Cancel",
//   isProcessing = false
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-white/10">
//       <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-xl">
//         <div className="flex items-start space-x-3">
//           <div className="flex-shrink-0 p-2 text-red-500 bg-red-100 rounded-full">
//             <AlertTriangle className="w-5 h-5" />
//           </div>
//           <div className="flex-1">
//             <h3 className="text-lg font-medium text-gray-900">{title}</h3>
//             <p className="mt-2 text-sm text-gray-600">{message}</p>
            
//             <div className="flex justify-end mt-6 space-x-3">
//               <button
//                 onClick={onCancel}
//                 disabled={isProcessing}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 {cancelText}
//               </button>
//               <button
//                 onClick={onConfirm}
//                 disabled={isProcessing}
//                 className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//               >
//                 {isProcessing ? (
//                   <Loader2 className="w-4 h-4 mx-2 animate-spin" />
//                 ) : (
//                   confirmText
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ImagePreview = ({ 
//   previewImage, 
//   isUploading, 
//   uploadProgress, 
//   uploadError, 
//   onRemove 
// }) => (
//   <div className="relative aspect-w-16 aspect-h-9 group">
//     <img
//       src={previewImage}
//       alt="Tour cover preview"
//       className="object-cover w-full h-full rounded-lg shadow-sm"
//       onError={() => {
//         toast.error('Failed to load image. Please re-upload.');
//         onRemove();
//       }}
//     />
//     <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
//       {isUploading && <ProgressBar progress={uploadProgress} />}
//       {uploadError && <p className="text-sm text-red-300">{uploadError}</p>}
//     </div>
//     <RemoveImageButton onClick={onRemove} disabled={isUploading} />
//   </div>
// );

// const UploadArea = ({ 
//   isDragging, 
//   isUploading, 
//   uploadProgress, 
//   uploadError, 
//   onFileInputChange,
//   onDragOver,
//   onDragLeave,
//   onDrop
// }) => (
//   <div
//     className={`border-2 border-dashed rounded-lg transition-all aspect-w-16 aspect-h-9 flex items-center justify-center ${
//       isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
//     }`}
//     onDragOver={onDragOver}
//     onDragLeave={onDragLeave}
//     onDrop={onDrop}
//   >
//     <div className="w-full p-6 text-center">
//       <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-teal-100">
//         {isUploading ? (
//           <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
//         ) : (
//           <UploadCloud className="w-5 h-5 text-blue-600" />
//         )}
//       </div>
//       <p className="mb-2 text-sm font-medium text-gray-700">
//         {isUploading ? 'Uploading...' : isDragging ? 'Drop your image here' : 'Upload a cover image'}
//       </p>
      
//       {!isUploading && (
//         <>
//           <p className="mb-4 text-xs text-gray-500">or</p>
//           <FileInputButton onChange={onFileInputChange} disabled={isUploading} />
//         </>
//       )}
      
//       <p className="mt-3 text-xs text-gray-500">PNG, JPG up to 10MB</p>
      
//       {uploadError && (
//         <p className="mt-2 text-xs text-red-500">{uploadError}</p>
//       )}
      
//       {isUploading && (
//         <div className="w-1/2 mx-auto mt-3">
//           <ProgressBar progress={uploadProgress} />
//           <p className="mt-1 text-xs text-center text-gray-500">
//             {uploadProgress}% uploaded
//           </p>
//         </div>
//       )}
//     </div>
//   </div>
// );

// const SectionHeader = ({ icon: Icon, title, subtitle }) => (
//   <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
//     <h3 className="flex items-center font-medium text-gray-800">
//       {Icon && <Icon className="w-5 h-5 mr-2 text-blue-600" />}
//       {title}
//       {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
//     </h3>
//   </div>
// );

// export const BasicInfoStep = ({ tourData, onUpdate }) => {
//   const [isDragging, setIsDragging] = useState(false);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploadError, setUploadError] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isRemoving, setIsRemoving] = useState(false);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
//   const sessionId = useUploadSession();
//   const abortControllerRef = useRef(null);

//   // Initialize preview image
//   useEffect(() => {
//     let isMounted = true;
//     const initializePreview = async () => {
//       try {
//         if (!isMounted) return;

//         if (tourData.cover_image_temp?.url && tourData.cover_image_temp.url.startsWith('data:image')) {
//           setPreviewImage(tourData.cover_image_temp.url);
//         } else if (tourData.cover_image_url) {
//           setPreviewImage(tourData.cover_image_url);
//         } else {
//           setPreviewImage(null);
//         }
//       } catch (error) {
//         if (isMounted) {
//           handleError('Failed to load image. Please re-upload.', error);
//           setPreviewImage(null);
//         }
//       }
//     };

//     initializePreview();

//     return () => {
//       isMounted = false;
//       if (previewImage && previewImage.startsWith('blob:')) {
//         URL.revokeObjectURL(previewImage);
//       }
//     };
//   }, [tourData, onUpdate, previewImage]);

//   useEffect(() => {
//     return () => {
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, []);

//   const handleError = useCallback((message, error) => {
//     console.error('Error:', error);
//     setUploadError(message);
//     toast.error(message);
//   }, []);

//   const validateFile = useCallback((file) => {
//     if (!file.type.startsWith('image/') || !ALLOWED_FILE_TYPES.includes(file.type)) {
//       throw new Error('Please upload a JPEG or PNG image file');
//     }

//     if (file.size > MAX_FILE_SIZE) {
//       throw new Error('Image size must be less than 10MB');
//     }
//   }, []);

//   const handleImageUpload = useCallback(async (file) => {
//     try {
//       validateFile(file);
      
//       const uploadToast = toast.loading('Uploading image...');
//       setIsUploading(true);
//       setUploadError(null);
//       setUploadProgress(0);
      
//       const localUrl = URL.createObjectURL(file);
//       setPreviewImage(localUrl);

//       const base64Image = await convertFileToBase64(file);

//       onUpdate({ 
//         cover_image_temp: {
//           url: base64Image,
//           fileName: file.name,
//           fileType: file.type,
//           fileSize: file.size
//         },
//         cover_image_file: undefined,
//         cover_image_url: undefined
//       });
      
//       toast.success('Image uploaded successfully!', { id: uploadToast });
//     } catch (error) {
//       if (error.name !== 'AbortError') {
//         const errorMessage = error.response?.data?.error || error.message || 'Upload failed. Please try again.';
//         handleError(errorMessage, error);
//         setPreviewImage(null);
//       }
//     } finally {
//       setIsUploading(false);
//       setUploadProgress(0);
//     }
//   }, [validateFile, handleError, onUpdate]);

//   const handleDrop = useCallback((e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files?.[0];
//     if (file?.type.startsWith('image/')) {
//       handleImageUpload(file);
//     } else {
//       handleError('Only image files are allowed');
//     }
//   }, [handleImageUpload, handleError]);

//   const handleFileInput = useCallback((e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       handleImageUpload(file);
//       e.target.value = '';
//     }
//   }, [handleImageUpload]);

//   const initiateRemoveImage = useCallback(() => {
//     setShowConfirmDialog(true);
//   }, []);

//   const confirmRemoveImage = useCallback(async () => {
//     setIsRemoving(true);
//     const deleteToast = toast.loading('Removing image...');
    
//     try {
//       setPreviewImage(null);
      
//       onUpdate({ 
//         cover_image_temp: undefined,
//         cover_image_file: undefined,
//         cover_image_url: undefined 
//       });
      
//       toast.success('Image removed successfully', { id: deleteToast });
//     } catch (error) {
//       handleError('Failed to delete image. Please try again.', error);
      
//       if (tourData.cover_image_temp?.url) {
//         setPreviewImage(tourData.cover_image_temp.url);
//       }
//     } finally {
//       setIsRemoving(false);
//       setShowConfirmDialog(false);
//     }
//   }, [tourData, onUpdate, handleError]);

//   const cancelRemoveImage = useCallback(() => {
//     setShowConfirmDialog(false);
//   }, []);

//   const handleDragOver = useCallback((e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   }, []);

//   const handleDragLeave = useCallback(() => {
//     setIsDragging(false);
//   }, []);

//   return (
//     <div className="mx-auto">
//       <ConfirmationDialog
//         isOpen={showConfirmDialog}
//         title="Remove Cover Image"
//         message="Are you sure you want to remove this cover image? This action cannot be undone."
//         confirmText={isRemoving ? "Removing..." : "Remove Image"}
//         onConfirm={confirmRemoveImage}
//         onCancel={cancelRemoveImage}
//         isProcessing={isRemoving}
//       />
      
//       <div className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
//         <h2 className="text-2xl font-bold text-gray-800">Tour Information</h2>
//         <p className="mt-2 text-gray-600">Provide the essential details for your tour experience</p>
//       </div>

//       <div className="flex flex-col gap-6 lg:flex-row">
//         <div className="flex-1">
//           <section className="flex flex-col h-full overflow-hidden border border-gray-200 rounded-xl">
//             <SectionHeader 
//               icon={ImageIcon}
//               title="Cover Image"
//               subtitle="This will be the main visual representation of your tour"
//             />
            
//             <div className="flex flex-col flex-1 p-5">
//               {previewImage ? (
//                 <ImagePreview 
//                   previewImage={previewImage}
//                   isUploading={isUploading}
//                   uploadProgress={uploadProgress}
//                   uploadError={uploadError}
//                   onRemove={initiateRemoveImage}
//                 />
//               ) : (
//                 <UploadArea
//                   isDragging={isDragging}
//                   isUploading={isUploading}
//                   uploadProgress={uploadProgress}
//                   uploadError={uploadError}
//                   onFileInputChange={handleFileInput}
//                   onDragOver={handleDragOver}
//                   onDragLeave={handleDragLeave}
//                   onDrop={handleDrop}
//                 />
//               )}
//             </div>
//           </section>
//         </div>

//         <div className="flex flex-col flex-1 gap-6">
//           <section className="overflow-hidden border border-gray-200 rounded-xl">
//             <SectionHeader 
//               title="Tour Details"
//               subtitle="Basic information about your tour"
//             />
            
//             <div className="p-5 space-y-6">
//               <div>
//                 <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">
//                   Tour Title
//                   <span className="ml-1 text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="title"
//                   value={tourData.title}
//                   onChange={(e) => onUpdate({ title: e.target.value })}
//                   className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="e.g. Sunset Beach Walking Tour"
//                   required
//                   disabled={isUploading}
//                 />
//               </div>

//               <div>
//                 <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
//                   Description
//                 </label>
//                 <textarea
//                   id="description"
//                   value={tourData.description || ''}
//                   onChange={(e) => onUpdate({ description: e.target.value })}
//                   rows={5}
//                   className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Describe the highlights and unique aspects of your tour..."
//                   disabled={isUploading}
//                 />
//                 <p className="mt-2 text-xs text-gray-500">Recommended length: 150-300 characters</p>
//               </div>
//             </div>
//           </section>

//           <section className="overflow-hidden border border-gray-200 rounded-xl">
//             <SectionHeader 
//               icon={Info}
//               title="Best Practices"
//             />
            
//             <div className="p-5">
//               <BestPracticesList />
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useCallback, useState, useEffect, useRef } from 'react';
import { UploadCloud, X, Info, ImageIcon, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

const ProgressBar = ({ progress }) => (
  <div className="w-full h-1.5 mb-2 bg-gray-200 rounded-full">
    <div 
      className="h-1.5 bg-blue-600 rounded-full" 
      style={{ width: `${progress}%` }}
    />
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

const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel",
  isProcessing = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-white/10">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-xl">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 p-2 text-red-500 bg-red-100 rounded-full">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-600">{message}</p>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={onCancel}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mx-2 animate-spin" />
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImagePreview = ({ 
  previewImage, 
  isUploading, 
  uploadProgress, 
  uploadError, 
  onRemove 
}) => (
  <div className="relative aspect-w-16 aspect-h-9 group">
    <img
      src={previewImage}
      alt="Tour cover preview"
      className="object-cover w-full h-full rounded-lg shadow-sm"
      onError={() => {
        toast.error('Failed to load image. Please re-upload.');
        onRemove();
      }}
    />
    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
      {isUploading && <ProgressBar progress={uploadProgress} />}
      {uploadError && <p className="text-sm text-red-300">{uploadError}</p>}
    </div>
    <RemoveImageButton onClick={onRemove} disabled={isUploading} />
  </div>
);

const UploadArea = ({ 
  isDragging, 
  isUploading, 
  uploadProgress, 
  uploadError, 
  onFileInputChange,
  onDragOver,
  onDragLeave,
  onDrop
}) => (
  <div
    className={`border-2 border-dashed rounded-lg transition-all aspect-w-16 aspect-h-9 flex items-center justify-center ${
      isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
    }`}
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
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
      
      {!isUploading && (
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

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="p-5 bg-gradient-to-r from-blue-50 to-teal-50">
    <h3 className="flex items-center font-medium text-gray-800">
      {Icon && <Icon className="w-5 h-5 mr-2 text-blue-600" />}
      {title}
      {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
    </h3>
  </div>
);

export const BasicInfoStep = ({ tourData, onUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const fileInputRef = useRef(null);

  // Initialize preview image
  useEffect(() => {
    if (tourData.cover_image_file) {
      const url = URL.createObjectURL(tourData.cover_image_file);
      setPreviewImage(url);
      return () => URL.revokeObjectURL(url);
    } else if (tourData.cover_image_url) {
      setPreviewImage(tourData.cover_image_url);
    } else {
      setPreviewImage(null);
    }
  }, [tourData.cover_image_file, tourData.cover_image_url]);

  const handleError = useCallback((message, error) => {
    console.error('Error:', error);
    setUploadError(message);
    toast.error(message);
  }, []);

  const validateFile = useCallback((file) => {
    if (!file.type.startsWith('image/') || !ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error('Please upload a JPEG or PNG image file');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Image size must be less than 10MB');
    }
  }, []);

  const handleImageUpload = useCallback(async (file) => {
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
      const errorMessage = error.message || 'Failed to process image. Please try again.';
      handleError(errorMessage, error);
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  }, [validateFile, handleError, onUpdate]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) {
      handleImageUpload(file);
    } else {
      handleError('Only image files are allowed');
    }
  }, [handleImageUpload, handleError]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
      e.target.value = '';
    }
  }, [handleImageUpload]);

  const initiateRemoveImage = useCallback(() => {
    setShowConfirmDialog(true);
  }, []);

  const confirmRemoveImage = useCallback(async () => {
    setIsRemoving(true);
    
    try {
      setPreviewImage(null);
      
      onUpdate({ 
        cover_image_file: undefined,
        cover_image_temp: undefined,
        cover_image_url: undefined 
      });
      
      toast.success('Image removed successfully');
    } catch (error) {
      handleError('Failed to remove image. Please try again.', error);
    } finally {
      setIsRemoving(false);
      setShowConfirmDialog(false);
    }
  }, [onUpdate, handleError]);

  const cancelRemoveImage = useCallback(() => {
    setShowConfirmDialog(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="mx-auto">
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        title="Remove Cover Image"
        message="Are you sure you want to remove this cover image? This action cannot be undone."
        confirmText={isRemoving ? "Removing..." : "Remove Image"}
        onConfirm={confirmRemoveImage}
        onCancel={cancelRemoveImage}
        isProcessing={isRemoving}
      />
      
      <div className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800">Tour Information</h2>
        <p className="mt-2 text-gray-600">Provide the essential details for your tour experience</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">
          <section className="flex flex-col h-full overflow-hidden border border-gray-200 rounded-xl">
            <SectionHeader 
              icon={ImageIcon}
              title="Cover Image"
              subtitle="This will be the main visual representation of your tour"
            />
            
            <div className="flex flex-col flex-1 p-5">
              {previewImage ? (
                <ImagePreview 
                  previewImage={previewImage}
                  isUploading={isUploading}
                  uploadProgress={0}
                  uploadError={uploadError}
                  onRemove={initiateRemoveImage}
                />
              ) : (
                <UploadArea
                  isDragging={isDragging}
                  isUploading={isUploading}
                  uploadProgress={0}
                  uploadError={uploadError}
                  onFileInputChange={handleFileInput}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              )}
            </div>
          </section>
        </div>

        <div className="flex flex-col flex-1 gap-6">
          <section className="overflow-hidden border border-gray-200 rounded-xl">
            <SectionHeader 
              title="Tour Details"
              subtitle="Basic information about your tour"
            />
            
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
                  disabled={isUploading}
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
                  disabled={isUploading}
                />
                <p className="mt-2 text-xs text-gray-500">Recommended length: 150-300 characters</p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden border border-gray-200 rounded-xl">
            <SectionHeader 
              icon={Info}
              title="Best Practices"
            />
            
            <div className="p-5">
              <BestPracticesList />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};