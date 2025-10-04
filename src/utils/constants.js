export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const API_URL = `${API_BASE_URL}`;
export const UPLOADS_URL = `${API_BASE_URL}`;

export const getMediaUrl = (url) => {
    // console.log(url);
  if (!url) return '';
  if (url.includes('http')) return url;
  return `http://localhost:3001${url}`;
};

// Status configuration
export const STATUS_CONFIG = {
  pending_approval: { 
    bg: 'bg-amber-50 border-amber-200', 
    text: 'text-amber-800', 
    icon: 'ClockIcon', 
    label: 'Pending Approval' 
  },
  published: { 
    bg: 'bg-green-50 border-green-200', 
    text: 'text-green-800', 
    icon: 'CheckCircle', 
    label: 'Published' 
  },
  rejected: { 
    bg: 'bg-red-50 border-red-200', 
    text: 'text-red-800', 
    icon: 'XCircle', 
    label: 'Rejected' 
  },
  pending: { 
    bg: 'bg-amber-50 border-amber-200', 
    text: 'text-amber-800', 
    icon: 'ClockIcon', 
    label: 'Pending' 
  },
  approved: { 
    bg: 'bg-green-50 border-green-200', 
    text: 'text-green-800', 
    icon: 'ThumbsUp', 
    label: 'Approved' 
  }
};

// Rejection type configuration
export const REJECTION_CONFIG = {
  audio: {
    icon: 'Headphones',
    title: "Audio Rejection",
    bg: "bg-red-50",
    border: "border-l-4 border-red-500",
    badge: "bg-red-100 text-red-800"
  },
  image: {
    icon: 'ImageIcon',
    title: "Image Rejection",
    bg: "bg-red-50",
    border: "border-l-4 border-red-500",
    badge: "bg-red-100 text-red-800"
  },
  general: {
    icon: 'AlertTriangle',
    title: "Rejection Summary",
    bg: "bg-red-50",
    border: "border-l-4 border-red-500",
    badge: "bg-red-100 text-red-800"
  }
};