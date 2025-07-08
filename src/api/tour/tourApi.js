// src/api/tourApi.js
import apiClient from '../apiClient';
import axios from 'axios';

export const createTour = async (tourData) => {
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

    const response = await apiClient.post('tour-packages/createTour', tourData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Tour creation failed:', error);
    
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data?.message;
      const validationErrors = error.response?.data?.errors;
      
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

export const getTourPackageById = async (guideId) => {
  try {
    return await apiClient.get(`tour-packages/guide/${guideId}`);
  } catch (error) {
    console.error('Error fetching tour packages:', error);
    throw error;
  }
};

export const getTourById = async (tourId) => {
  try {
    return await apiClient.get(`tour-packages/${tourId}`);
  } catch (error) {
    console.error('Error fetching tour package:', error);
    throw error;
  }
};