// src/types/tour.ts
export interface Media {
  id?: number;
  url: string;
  duration_seconds?: number;
  media_type: 'image' | 'audio';
  file_size?: number;
  format?: string;
  file?: File;
  uploaded_by_id?: number;
}

export interface Location {
  id?: number;
  longitude: number;
  latitude: number;
  address?: string;
  city?: string;
  province?: string;
  district?: string;
  postal_code?: string;
}

export interface TourStop {
  id?: number;
  package_id?: number;
  sequence_no: number;
  stop_name: string;
  description?: string;
  location?: Location;
  location_id?: number;
  media?: Media[];
  tempId?: string;
}

export interface TourPackage {
  id?: number;
  title: string;
  description: string;
  price: number;
  duration_minutes: number;
  status?: 'pending_approval' | 'published' | 'rejected';
  guide_id: number;
  cover_image_id?: number;
  cover_image?: Media;
  tour_stops: TourStop[];
  created_at?: Date;
  updated_at?: Date;
  rejection_reason?: string;
}

export interface RouteInfo {
  distance: number;
  duration: number;
  path: google.maps.LatLng[];
}

export interface ValidationWarning {
  stopIndex: number;
  message: string;
  severity: 'warning' | 'error';
}