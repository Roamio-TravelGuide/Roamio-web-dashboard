// src/api/tourApi.ts
import apiClient from '../apiClient';
import axios from 'axios';
import type { TourPackage, Media } from '../../types/tour';

interface CreateTourPayload {
  finalData: {
    title: string;
    description: string;
    price: number;
    duration_minutes: number;
    guide_id: number;
    cover_image?: File;
    cover_image_url?: string;
    status?: string;
    tour_stops: Array<{
      sequence_no: number;
      stop_name: string;
      description?: string;
      location?: {
        longitude: number;
        latitude: number;
        address?: string;
        city?: string;
        province?: string;
        district?: string;
        postal_code?: string;
      };
    }>;
  };
}

export const createTour = async (tourData: {
  title: string;
  description: string;
  price: number;
  duration_minutes: number;
  status: string;
  guide_id: number;
  cover_image_url: string;
  tour_stops: Array<{
    sequence_no: number;
    stop_name: string;
    description: string;
    location: {
      longitude: number;
      latitude: number;
      address?: string;
      city?: string;
      province?: string;
      district?: string;
      postal_code?: string;
    } | null;
    media: Array<{
      media_type: string;
      url: string;
      duration_seconds?: number;
      caption?: string;
    }>;
  }>;
}): Promise<TourPackage> => {
  try {
    if (!tourData.guide_id) {
      throw new Error('Guide ID is required');
    }

    if (!tourData.price || isNaN(tourData.price)) {
      throw new Error('Valid price is required');
    }

    if (!tourData.duration_minutes || isNaN(tourData.duration_minutes)) {
      throw new Error('Valid duration is required');
    }

    // Validate tour stops
    if (!Array.isArray(tourData.tour_stops)) {
      throw new Error('Tour stops must be an array');
    }

    tourData.tour_stops.forEach((stop, index) => {
      if (!stop.stop_name) {
        throw new Error(`Stop ${index + 1} must have a name`);
      }
      if (!stop.location) {
        throw new Error(`Stop ${index + 1} must have a location`);
      }
    });

    console.log('Submitting tour with:', {
      title: tourData.title,
      guide_id: tourData.guide_id,
      stop_count: tourData.tour_stops.length
    });

    const response = await apiClient.post<TourPackage>('tour-packages/createTour', tourData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Tour creation failed:', error);
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        message?: string;
        errors?: Record<string, string[]>;
      }>;
      
      const serverMessage = axiosError.response?.data?.message;
      const validationErrors = axiosError.response?.data?.errors;
      
      if (validationErrors) {
        throw new Error(`Validation failed: ${
          Object.entries(validationErrors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('; ')
        }`);
      }
      
      throw new Error(serverMessage || 'Failed to create tour (server error)');
    }
    
    throw new Error(error instanceof Error ? error.message : 'Failed to create tour');
  }
};

export const getTourPackageById = async (guideId: string): Promise<any> => {
  try {
    const response = await apiClient.get(`tour-packages/guide/${guideId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tour packages:', error);
    throw error;
  }
};