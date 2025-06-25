import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, Music, X, AlertTriangle } from 'lucide-react';
import type { Media } from '../../types/tour';

interface MediaUploadProps {
  onMediaAdd: (media: Media[]) => void;
  onMediaRemove: (index: number) => void;
  media: Media[];
  acceptedTypes: string[];
  maxFiles?: number;
  className?: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  onMediaAdd,
  onMediaRemove,
  media,
  acceptedTypes,
  maxFiles = 10,
  className = ''
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newMedia: Media[] = acceptedFiles.map(file => {
      const isAudio = file.type.startsWith('audio/');
      const url = URL.createObjectURL(file);
      
      return {
        url,
        media_type: isAudio ? 'audio' : 'image',
        file_size: file.size,
        format: file.type,
        file,
        duration_seconds: isAudio ? undefined : undefined // Will be set after audio loads
      };
    });

    onMediaAdd(newMedia);
  }, [onMediaAdd]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: maxFiles - media.length,
    disabled: media.length >= maxFiles
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {media.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
            ${isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="mb-2 font-medium text-gray-600">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-sm text-gray-500">
            or click to browse ({maxFiles - media.length} remaining)
          </p>
        </div>
      )}

      {media.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Uploaded Media</h4>
          <div className="grid gap-3">
            {media.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {item.media_type === 'image' ? (
                      <div className="relative">
                        <Image className="text-blue-500" size={24} />
                        {item.url && (
                          <img
                            src={item.url}
                            alt="Preview"
                            className="absolute object-cover w-6 h-6 border-2 border-white rounded -top-1 -right-1"
                          />
                        )}
                      </div>
                    ) : (
                      <Music className="text-green-500" size={24} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.file?.name || 'Unknown file'}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {item.file_size && <span>{formatFileSize(item.file_size)}</span>}
                      {item.media_type === 'audio' && item.duration_seconds && (
                        <span>{formatDuration(item.duration_seconds)}</span>
                      )}
                      {item.format && <span>{item.format}</span>}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onMediaRemove(index)}
                  className="flex-shrink-0 p-1 text-gray-400 transition-colors hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {media.length >= maxFiles && (
        <div className="flex items-center p-3 space-x-2 border rounded-lg bg-amber-50 border-amber-200">
          <AlertTriangle className="text-amber-500" size={16} />
          <span className="text-sm text-amber-700">
            Maximum number of files reached ({maxFiles})
          </span>
        </div>
      )}
    </div>
  );
};