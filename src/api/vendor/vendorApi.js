import { data } from 'react-router-dom';
import apiClient from '../apiClient';

export const getVendorProfile = async () => {
 
  try {
    const response = await apiClient.get('/vendor');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch profile');
    }
    
    return response.data;
  } catch (error) {
    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('Session expired. Please log in again.');
        case 404:
          throw new Error('Vendor profile not found. Please complete your profile setup.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(error.response.data?.message || 'Failed to fetch vendor profile');
      }
    } else {
      throw new Error(error);
    }
  }
};

export const updateVendorProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/vendor', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating vendor profile:', error);
    if (error.response?.data?.errors) {
      // Handle validation errors from backend
      const errorMessages = Object.values(error.response.data.errors)
        .flat()
        .join(', ');
      throw errorMessages;
    }
    throw error.response?.data?.message || 'Failed to update profile';
  }
};

export const uploadVendorLogo = async (file) => {
  try {
    const formData = new FormData();
    formData.append('logo', file);
    
    const response = await apiClient.post('/vendor/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading vendor logo:', error);
    throw error.response?.data?.message || 'Failed to upload logo';
  }
};

export const uploadVendorCover = async (file) => {
  try {
    const formData = new FormData();
    formData.append('cover', file);
    
    const response = await apiClient.post('/vendor/cover', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading vendor cover:', error);
    throw error.response?.data?.message || 'Failed to upload cover';
  }
};