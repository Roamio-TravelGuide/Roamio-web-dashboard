// src/api/admin/adminApi.ts
import apiClient from '../apiClient';
import axios from 'axios';

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/v1/users/getAllUsers');
    
    // Transform the data to match frontend expectations
    return {
      data: response.data.users.map((user: any) => ({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone_no,
        status: user.status.toLowerCase(),
        role: user.role,
        avatar: user.profile_picture_url || '/default-avatar.png',
        registeredDate: user.registered_date,
        lastLogin: user.last_login,
        bio: user.bio,
        totalBookings: user.traveler_count || 0,
        totalReviews: user.report_count || 0,
        averageRating: 0,
      })),
      message: response.data.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || 'Fetching users failed';
    }
    throw new Error('An unexpected error occurred');
  }
};
