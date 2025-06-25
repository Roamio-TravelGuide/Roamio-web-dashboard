export interface TourStop {
  id: string;
  name: string;          // Maps to stop_name
  description: string;
  latitude: number;      // From Location relation
  longitude: number;     // From Location relation
  audioFile?: string;    // Maps to audio_url
  photos: string[];      // From TourStopMedia where is_photo=true
  order: number;         // Maps to sequence_no
}

export interface TourPackage {
  id: string;
  title: string;
  description: string;
  duration: number;      // Maps to duration_minutes
  price: number;
  stops: TourStop[];
  coverImage?: string;   // From cover_image relation
  createdAt: string;     // Maps to created_at
  updatedAt: string;     // Maps to updated_at
  status?: 'pending_approval' | 'published' | 'rejected';
}