// src/api/authService.js
import apiClient from '../apiClient';

export const login = async (credentials) => {
  try {
    const response = await apiClien.post('/auth/login', credentials);
    const { token, refreshToken } = response.data;
    
    // Store tokens based on "remember me" preference
    storeAuthToken(token, credentials.rememberMe);
    storeRefreshToken(refreshToken);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    // Optional: Call backend logout endpoint if you have one
    await apiClient.post('/auth/logout');
    
    // Clear all auth-related storage
    clearAuthData();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Redirect to login page
    window.location.href = '/login';
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');
    
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    const { token } = response.data;
    
    storeAuthToken(token);
    return token;
  } catch (error) {
    clearAuthData();
    throw error;
  }
};

// Helper functions
export function storeAuthToken(token, rememberMe = false) {
  if (rememberMe) {
    localStorage.setItem('authToken', token);
  } else {
    sessionStorage.setItem('authToken', token);
  }
}

export function storeRefreshToken(token) {
  // Store refresh token in httpOnly cookie via backend or secure storage
  localStorage.setItem('refreshToken', token);
}

export function getAuthToken() {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

export function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

export function clearAuthData() {
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
}