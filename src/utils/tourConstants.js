// Pricing and validation constants
export const TOUR_CONSTANTS = {
  PRICE_PER_MINUTE: 500,
  MINIMUM_PRICE: 1000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  MEDIA_TYPES: {
    AUDIO: 'audio',
    IMAGE: 'image'
  },
  WALKING_SPEED: 1.4, // m/s
  STEPS: {
    BASIC_INFO: 1,
    ROUTE: 2,
    MEDIA: 3,
    REVIEW: 4
  }
};

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED_AUDIO: 'At least one audio file is required for this stop',
  INSUFFICIENT_AUDIO: 'Recommended minimum audio duration is',
  NO_LOCATION: 'Location not set for this stop',
  IMAGE_TYPE: 'Please upload a JPEG or PNG image file',
  IMAGE_SIZE: 'Image size must be less than 10MB'
};

// UI Labels
export const UI_LABELS = {
  CREATE: {
    TITLE: 'Create New Tour',
    DESCRIPTION: 'Create a new tour experience',
    SUBMIT: 'Submit for Approval'
  },
  EDIT: {
    TITLE: 'Edit Tour',
    DESCRIPTION: 'Update your tour details',
    SUBMIT: 'Update Tour'
  }
};