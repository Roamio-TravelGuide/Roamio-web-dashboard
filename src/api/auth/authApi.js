import apiClient from '../apiClient';
import axios from 'axios';

export const login = async (credentials) => {
  try {
    console.log(credentials);
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || 'Login failed';
    }
    throw 'An unexpected error occurred';
  }
};

export const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  }
};