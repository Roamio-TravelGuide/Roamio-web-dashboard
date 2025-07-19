// src/api/admin/adminApi.js
import apiClient from "../apiClient";
import axios from "axios";
import { supportAPI } from "../support/index.js";

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

export const getUserStatistics = async () => {
  try {
    const response = await apiClient.get('/users/');
    const users = response.data.data || [];

    // Calculate statistics from the user data
    return {
      total: users.length,
      active: users.filter(user => user.status.toLowerCase() === 'active').length,
      pending: users.filter(user => user.status.toLowerCase() === 'pending').length,
      blocked: users.filter(user => user.status.toLowerCase() === 'blocked').length,
      travelers: users.filter(user => user.role === 'traveler').length,
      tourGuides: users.filter(user => user.role === 'travel_guide').length,
      moderators: users.filter(user => user.role === 'moderator').length,
      vendors: users.filter(user => user.role === 'vendor').length,
      lastUpdated: new Date().toISOString()
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

// Support/Complaint ticket functions
export const getAllTickets = async (params = {}) => {
  try {
    return await supportAPI.admin.getAllTickets(params);
  } catch (error) {
    console.error("Error in getAllTickets:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      throw error.response?.data?.message || "Fetching tickets failed";
    }
    throw new Error("An unexpected error occurred while fetching tickets");
  }
};

export const getTicketById = async (ticketId) => {
  try {
    return await supportAPI.getTicketById(ticketId);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || "Fetching ticket failed";
    }
    throw new Error("An unexpected error occurred while fetching ticket");
  }
};

export const updateTicketStatus = async (ticketId, statusData) => {
  try {
    return await supportAPI.admin.updateTicketStatus(ticketId, statusData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || "Updating ticket status failed";
    }
    throw new Error("An unexpected error occurred while updating ticket status");
  }
};

export const addSolutionToTicket = async (ticketId, solutionData) => {
  try {
    return await supportAPI.admin.addSolutionToTicket(ticketId, solutionData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || "Adding solution to ticket failed";
    }
    throw new Error("An unexpected error occurred while adding solution to ticket");
  }
};

export const getTicketStatistics = async (userType = null) => {
  try {
    return await supportAPI.admin.getTicketStats(userType);
  } catch (error) {
    console.error("Error in getTicketStatistics:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      throw error.response?.data?.message || "Fetching ticket statistics failed";
    }
    throw new Error("An unexpected error occurred while fetching ticket statistics");
  }
};