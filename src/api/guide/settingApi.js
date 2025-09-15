import apiClient from '../apiClient';

export const getGuideProfile = async (guideId) => {
  try {
    const response = await apiClient.get(`users/${guideId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Guide profile:', error);
    throw error;
  }
};

export const getGuidePerformance = async (guideId) => {
    try {
        const response = await apiClient.get(`users/performance/${guideId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching guide performance:', error);
        throw error;
    }
}

export const getDocuments = async(guideId)=>{
    try {
        const response = await apiClient.get(`users/documents/${guideId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching guide documents:', error);
        throw error;
    }
}