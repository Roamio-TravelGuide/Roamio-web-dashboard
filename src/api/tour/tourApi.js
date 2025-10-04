import apiClient from '../apiClient';

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
    const result = await apiClient.get(`tour-package/${tourId}`);
    return result.data;
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

export const createCompleteTour = async (formData) => {
  const response = await apiClient.post('tour-package/complete', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateTour = async (tourId, formData) => {
  try {
    const response = await apiClient.put(`tour-package/${tourId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};