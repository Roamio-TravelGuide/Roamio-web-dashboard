// src/api/auth/authApi.ts
import apiClient from "../apiClient.ts";
import axios from "axios";

export const login = async (credentials: { email: string; password: string }) => {
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


export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone_no: string;
  profile_picture_url:string;
}) => {
  try {
    const response = await apiClient.post("v1/auth/register", userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || "Registration failed";
    }
    throw "An unexpected error occurred";
  }
};


export const logout = async () => {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  }
};