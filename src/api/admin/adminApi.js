// src/api/admin/adminApi.js
import apiClient from "../apiClient";
import axios from "axios"; 

// Helper function to format dates consistently
function formatDate(date) {
  if (date instanceof Date) return date.toISOString();
  const parsed = new Date(date);
  return isNaN(parsed.getTime())
    ? new Date().toISOString()
    : parsed.toISOString();
}

export const getAllUsers = async (filters = {}) => {
  try {
    const response = await apiClient.get("/users/");
    // Check if response has the expected structure
    const users = response.data.data || [];

    // Transform the data to match frontend expectations
    return {
      data: users.map((user) => ({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone_no,
        status: user.status.toLowerCase(),
        role: user.role,
        avatar: user.profile_picture_url || "/default-avatar.png",
        registeredDate: formatDate(user.registered_date),
        lastLogin: user.last_login ? formatDate(user.last_login) : null,
        bio: user.bio,
        totalBookings: user.traveler_count || 0,
        totalReviews: user.report_count || 0,
        ...(user.role !== "traveler" && {
          averageRating: user.average_rating || 0,
        }),
      })),
      message: response.data.message || "Users fetched successfully",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || "Fetching users failed";
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getAllPackages = async (filters = {}) => {
  try {
    const response = await apiClient.get("/tour-package/", {
      params: {
        status: filters.status || undefined,
      },
    });

    return {
      data: response.data.data?.packages || [], // Match your backend response structure
      total: response.data.data?.total || 0,
      message: response.data.message || "Packages fetched successfully",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to fetch packages"
      );
    }
    throw new Error("An unexpected error occurred while fetching packages");
  }
};

export const getUserStatistics = async () => {
  try {
    const response = await apiClient.get("/users/");
    const users = response.data.data || [];

    // Calculate statistics from the user data
    return {
      total: users.length,
      active: users.filter((user) => user.status.toLowerCase() === "active")
        .length,
      pending: users.filter((user) => user.status.toLowerCase() === "pending")
        .length,
      blocked: users.filter((user) => user.status.toLowerCase() === "blocked")
        .length,
      travelers: users.filter((user) => user.role === "traveler").length,
      tourGuides: users.filter((user) => user.role === "travel_guide").length,
      moderators: users.filter((user) => user.role === "moderator").length,
      vendors: users.filter((user) => user.role === "vendor").length,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error in getUserStatistics:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      throw error.response?.data?.message || "Fetching statistics failed";
    }
    throw new Error("An unexpected error occurred while fetching statistics");
  }
};

export const updateUserStatus = async (userId, newStatus) => {
  try {
    const response = await apiClient.patch(`/users/${userId}/status`, {
      status: newStatus,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || "Updating user status failed";
    }
    throw new Error("An unexpected error occurred while updating status");
  }
};

export const getTotalRevenue = async () => {
  try {
    const response = await apiClient.get("/payment/revenue");

    // Get current date for daily revenue calculation
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));

    // Transform the data to match frontend expectations
    return {
      sold_packages:response.data.data?.sold_packages,
      total: response.data.data?.total_revenue || 0,
      today: response.data.data?.today_revenue || 0, // Add today's revenue
      monthly: response.data.data?.monthly || Array(12).fill(0),
      weekly: response.data.data?.weekly || Array(4).fill(0),
      yearly: response.data.data?.yearly || [],
      growthRate: response.data.data?.growth_rate || 0,
      lastUpdated: new Date().toISOString(),
      message: response.data.message || "Total revenue fetched successfully",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });

      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to fetch revenue data"
      );
    }

    console.error("System Error:", error);
    throw new Error("An unexpected error occurred while fetching revenue");
  }
};

export const getTopPerformerRevenue = async () => {
  try {
    const response = await apiClient.get("/payment/top-performer-revenue");
    return {
      data: response.data.data || { topTourGuide: null, mostSoldPackage: null },
      message: response.data.message || "Top performers fetched successfully",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      // Re-throw the error to be caught by the calling component
      throw new Error(
        error.response?.data?.message || "Failed to fetch top performers"
      );
    }
    // Also throw for non-axios errors
    throw new Error("An unexpected error occurred while fetching top performers");
  }
};

export const getTopSellingPackage = async() =>{
  try {
    const response = await apiClient.get("/payment/top-selling-package");
    return{
      data: response.data.data || [],
      message: response.data.message || "Top selling package fetched successfully",
    }
  } catch (error) {
    if(axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch top selling package"
      );
    }
    throw new Error("An unexpected error occurred while fetching top selling package");
  }
}