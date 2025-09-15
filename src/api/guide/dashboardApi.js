import apiClient from '../apiClient';

export const getTourPackagesByGuideId = async (guideId) => {
  try {
    const response = await apiClient.get(`tour-package/guide/${guideId}`);
    // console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error fetching tour packages:', error);
    throw error;
  }
};

export const getHiddenGemByGuideId = async (guideId) => {
  try {
    const response = await apiClient.get(`hiddenGem/guide/${guideId}`);
    // console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching tour packages:', error);
    throw error;
  }
}