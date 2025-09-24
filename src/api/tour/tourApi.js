import apiClient from '../apiClient';
import axios from 'axios';

export const getTourPackagesByGuideId = async (guideId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`tour-package/guide/${guideId}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tour packages:', error);
    throw error;
  }
};

export const getTourById = async (tourId) => {
  try {
    return await apiClient.get(`tour-package/${tourId}`);
  } catch (error) {
    console.error('Error fetching tour package:', error);
    throw error;
  }
};

export const getTourPackages = async ({statusFilter, searchQuery, currentPage, itemsPerPage}) => {
  try {
    const params = {
      status: statusFilter === 'all' ? undefined : statusFilter,
      search: searchQuery,
      page: currentPage,
      limit: itemsPerPage
    };

    const response = await apiClient.get('/tour-package', {
      params,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
      console.error('Tour Packages fetching failed:', error);
      throw error;
  }
}

export const updateTour = async (id, tourData) => {
  try {
    console.log(tourData);
    const response = await apiClient.put(`tour-package/${id}`, tourData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Tour update failed:', error);
    
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
      
      throw new Error(serverMessage || 'Failed to update tour (server error)');
    }
    
    throw new Error(error instanceof Error ? error.message : 'Failed to update tour');
  }
};

export const createCompleteTour = async (formData) => {
  const response = await apiClient.post('tour-package/complete', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};