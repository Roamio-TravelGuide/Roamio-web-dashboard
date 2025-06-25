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
  sequence_no: number;
  stop_name: string;
  description?: string;
  location?: Location;
  media?: Media[];
  tempId?: string;
}

export interface Media {
  id?: number;
  url: string;
  duration_seconds?: number;
  media_type: 'image' | 'audio';
  file_size?: number;
  format?: string;
  file?: File;
}

export interface TourPackage {
  id?: number;
  title: string;
  description?: string;
  price: number;
  duration_minutes: number;
  cover_image?: Media;
  tour_stops: TourStop[];
}

export interface RouteInfo {
  distance: number; // in meters
  duration: number; // in seconds
  path: google.maps.LatLng[];
}

export interface ValidationWarning {
  stopIndex: number;
  message: string;
  severity: 'warning' | 'error';
}