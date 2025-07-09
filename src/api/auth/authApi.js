import apiClient from '../apiClient';
import axios from 'axios';

export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/v1/auth/login', credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const signup = async (userData) => {
  try {
    const roleMap = {
      'guide': 'travel_guide',
      'restaurant': 'vendor',
      'traveler': 'traveler'
    };
    
    const backendRole = roleMap[userData.role] || userData.role;

    const signupPayload = {
      name: userData.name,
      email: userData.email,
      phone_no: userData.phone_no,
      password: userData.password,
      role: backendRole,
      profile_picture_url: userData.profile_picture_url || '',
      bio: userData.bio || '',
    };

    if (backendRole === 'travel_guide') {
      signupPayload.license = userData.license || userData.guideId;
      signupPayload.years_of_experience = userData.years_of_experience || 0;
      signupPayload.languages_spoken = userData.languages_spoken || ['English'];
    } else if (backendRole === 'vendor') {
      signupPayload.business_name = userData.name;
      signupPayload.business_type = userData.type
      signupPayload.address = userData.address;
      signupPayload.city = userData.city || 'Unknown';
      signupPayload.province = userData.province || 'Unknown';
      signupPayload.location = userData.location
      signupPayload.latitude = userData.latitude || 0;
      signupPayload.longitude = userData.longitude || 0;
      signupPayload.restaurantType = userData.restaurantType;// Ensure this is passed
    }

    const response = await apiClient.post('/v1/auth/signup', signupPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;

  } catch (error) {
    let errorMessage = 'Signup failed';
    
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || 
                   error.response?.data?.error ||
                   'Signup failed. Please check your input and try again.';
      
      if (error.response?.data?.errors) {
        errorMessage += `: ${JSON.stringify(error.response.data.errors)}`;
      }
    }
    
    throw new Error(errorMessage);
  }
};

export const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Logout failed');
  }
};