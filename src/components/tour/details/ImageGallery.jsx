import React from 'react';
import { ImageIcon, Eye } from 'lucide-react';
import { getMediaUrl } from '../../../utils/constants';

export const ImageGallery = React.memo(({ images, onImageClick }) => {
  if (!images?.length) {
    return (
      <div className="p-6 text-center bg-white border border-gray-100 rounded-lg">
        <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-gray-100 rounded-full">
          <ImageIcon className="w-5 h-5 text-gray-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700">No Images Available</h3>
        <p className="mt-1 text-xs text-gray-500">
          This tour stop doesn't have any images yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {images.map((image, index) => (
        <div
          key={`${image.id}-${index}`}
          className="relative overflow-hidden transition-all duration-300 bg-white border border-gray-100 rounded-lg shadow-xs group"
        >
          <div 
            className="relative overflow-hidden cursor-pointer h-28"
            onClick={() => onImageClick(getMediaUrl(image.url))}
          >
            <img 
              src={getMediaUrl(image.url)} 
              alt={`Stop image ${index + 1}`}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:opacity-100" />
            
            <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
              <div className="p-1.5 bg-white rounded-full shadow-sm">
                <Eye className="w-4 h-4 text-gray-700" />
              </div>
            </div>
          </div>
          
          <div className="p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700 truncate">
                Image #{image.id}
              </span>
              <span className="text-xs text-gray-400">
                #{index + 1}
              </span>
            </div>
            
            {image.status === 'rejected' && image.rejection_reason && (
              <div className="p-1.5 mt-1 text-xs border border-red-100 rounded bg-red-50">
                <p className="text-red-700 truncate">{image.rejection_reason}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

export default ImageGallery;