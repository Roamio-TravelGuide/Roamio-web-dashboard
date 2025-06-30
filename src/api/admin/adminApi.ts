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

// Add this new function for updating vendor profiles
export const updateVendorProfile = async (userId: string, profileData: {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  businessName?: string;
  businessAddress?: string;
  businessType?: string;
}) => {
  try {
    const response = await apiClient.patch(`/v1/users/${userId}/vendor-profile`, {
      name: profileData.name,
      email: profileData.email,
      phone_no: profileData.phone,
      bio: profileData.bio,
      business_name: profileData.businessName,
      business_address: profileData.businessAddress,
      business_type: profileData.businessType
    });

    return {
      data: {
        ...response.data.user,
        businessName: response.data.user.business_name,
        businessAddress: response.data.user.business_address,
        businessType: response.data.user.business_type
      },
      message: response.data.message
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || 'Updating vendor profile failed';
    }
    throw new Error('An unexpected error occurred');
  }
};