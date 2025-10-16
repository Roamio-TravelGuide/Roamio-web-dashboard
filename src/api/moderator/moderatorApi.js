import apiClient from '../apiClient';

const BASE_URL = '/hiddenGem';

export const getHiddenGemsForModeration = async (filters = {}) => {
  try {
    const {
      status = 'pending',
      search = '',
      location = 'all',
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = filters;

    const params = {
      status,
      page,
      limit,
      sortBy,
      sortOrder
    };

    if (search) {
      params.search = search;
    }

    if (location && location !== 'all') {
      params.location = location;
    }

    const response = await apiClient.get(`${BASE_URL}/moderation`, { params });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch hidden gems');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching hidden gems for moderation:', error);
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('Session expired. Please log in again.');
        case 403:
          throw new Error('You do not have permission to moderate hidden gems.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(error.response.data?.message || 'Failed to fetch hidden gems');
      }
    } else {
      throw new Error(error.message || 'Network error occurred');
    }
  }
};

export const updateHiddenGemStatus = async (gemId, statusData) => {
  try {
    const { status, rejectionReason } = statusData;

    const response = await apiClient.patch(`${BASE_URL}/${gemId}/status`, {
      status,
      rejectionReason
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update gem status');
    }

    return response.data;
  } catch (error) {
    console.error('Error updating hidden gem status:', error);
    
    if (error.response?.data?.errors) {
      const errorMessages = Object.values(error.response.data.errors)
        .flat()
        .join(', ');
      throw errorMessages;
    }
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('Session expired. Please log in again.');
        case 403:
          throw new Error('You do not have permission to update gem status.');
        case 404:
          throw new Error('Hidden gem not found.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(error.response.data?.message || 'Failed to update gem status');
      }
    } else {
      throw new Error(error.message || 'Network error occurred');
    }
  }
};

export const getModerationStats = async () => {
  try {
    const response = await apiClient.get(`${BASE_URL}/moderation/stats`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch moderation stats');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching moderation stats:', error);
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('Session expired. Please log in again.');
        case 403:
          throw new Error('You do not have permission to view moderation stats.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(error.response.data?.message || 'Failed to fetch moderation stats');
      }
    } else {
      throw new Error(error.message || 'Network error occurred');
    }
  }
};

export const getHiddenGemDetails = async (gemId) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/${gemId}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch hidden gem details');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching hidden gem details:', error);
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('Session expired. Please log in again.');
        case 403:
          throw new Error('You do not have permission to view this gem.');
        case 404:
          throw new Error('Hidden gem not found.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(error.response.data?.message || 'Failed to fetch hidden gem details');
      }
    } else {
      throw new Error(error.message || 'Network error occurred');
    }
  }
};

// Additional moderator functions
export const bulkUpdateGemStatus = async (gemIds, status, rejectionReason = '') => {
  try {
    const response = await apiClient.patch(`${BASE_URL}/bulk-status`, {
      gemIds,
      status,
      rejectionReason
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update gems status');
    }

    return response.data;
  } catch (error) {
    console.error('Error bulk updating gem status:', error);
    throw error.response?.data?.message || 'Failed to bulk update gem status';
  }
};

export const getModerationActivity = async (page = 1, limit = 20) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/moderation/activity`, {
      params: { page, limit }
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch moderation activity');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching moderation activity:', error);
    throw error.response?.data?.message || 'Failed to fetch moderation activity';
  }
};