import { TOUR_CONSTANTS } from './tourConstants';

// Time formatting utilities
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export const formatTimeForInput = (seconds) => {
  return new Date(seconds * 1000).toISOString().substring(14, 19);
};

// Price calculation utilities
export const calculateTourPrice = (totalAudioSeconds) => {
  const totalMinutes = totalAudioSeconds / 60;
  const basePrice = totalMinutes * TOUR_CONSTANTS.PRICE_PER_MINUTE;
  return Math.max(basePrice, TOUR_CONSTANTS.MINIMUM_PRICE);
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2
  }).format(price);
};

// Media utilities
export const getAudioDuration = (file) => {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    
    audio.addEventListener('loadedmetadata', () => {
      const duration = Math.floor(audio.duration);
      URL.revokeObjectURL(audio.src);
      resolve(duration);
    });
    
    audio.addEventListener('error', () => {
      resolve(0);
    });
  });
};

// Validation utilities
export const validateFile = (file, maxSize = TOUR_CONSTANTS.MAX_FILE_SIZE, allowedTypes = TOUR_CONSTANTS.ALLOWED_IMAGE_TYPES) => {
  if (!file.type.startsWith('image/') || !allowedTypes.includes(file.type)) {
    throw new Error('Please upload a JPEG or PNG image file');
  }

  if (file.size > maxSize) {
    throw new Error('Image size must be less than 10MB');
  }
};

// Data transformation utilities
export const transformTourData = (apiData) => {
  return {
    id: apiData.id,
    title: apiData.title,
    description: apiData.description,
    price: apiData.price,
    duration_minutes: apiData.duration_minutes,
    cover_image_url: apiData.cover_image?.url || null,
    cover_image_id: apiData.cover_image_id,
    tour_stops: apiData.tour_stops?.map((stop) => ({
      id: stop.id,
      package_id: stop.package_id,
      sequence_no: stop.sequence_no,
      stop_name: stop.stop_name,
      description: stop.description,
      location: stop.location ? {
        latitude: stop.location.latitude,
        longitude: stop.location.longitude,
        address: stop.location.address,
        city: stop.location.city,
        province: stop.location.province,
        district: stop.location.district,
        postal_code: stop.location.postal_code
      } : null,
      media: stop.media?.map(mediaItem => ({
        id: mediaItem.media?.id,
        media_type: mediaItem.media?.media_type,
        file_name: mediaItem.media?.file_name || `file_${mediaItem.media?.id}`,
        file_type: mediaItem.media?.format,
        file_size: mediaItem.media?.file_size,
        duration_seconds: mediaItem.media?.duration_seconds,
        url: mediaItem.media?.url,
        temp_url: mediaItem.media?.url,
        uploaded_by_id: mediaItem.media?.uploaded_by_id,
        created_at: mediaItem.media?.created_at
      })) || [],
      tempId: `stop-${stop.id}-${Date.now()}`
    })) || []
  };
};