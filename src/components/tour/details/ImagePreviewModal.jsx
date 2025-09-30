import React from 'react';
import { XCircle } from 'lucide-react';

export const ImagePreviewModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
      <div className="relative max-w-4xl max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute right-0 text-white transition-colors -top-10 hover:text-gray-300"
          aria-label="Close image preview"
        >
          <XCircle className="w-8 h-8" />
        </button>
        <img 
          src={imageUrl} 
          alt="Full size view"
          className="object-contain max-w-full max-h-[80vh] rounded-lg"
          loading="eager"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;