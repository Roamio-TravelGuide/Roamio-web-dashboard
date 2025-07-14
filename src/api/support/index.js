import apiClient from "../apiClient";

// Support API endpoints
export const supportAPI = {
  // Get support categories based on user role
  getCategories: async () => {
    const response = await apiClient.get("/support/categories");
    return response.data;
  },

  // Create a new support ticket
  createTicket: async (ticketData) => {
    const response = await apiClient.post("/support/tickets", ticketData);
    return response.data;
  },

  // Get user's support tickets
  getUserTickets: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.status) queryParams.append("status", params.status);
    if (params.category) queryParams.append("category", params.category);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await apiClient.get(
      `/support/tickets?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get a specific ticket by ID
  getTicketById: async (ticketId) => {
    const response = await apiClient.get(`/support/tickets/${ticketId}`);
    return response.data;
  },

  // Update a support ticket
  updateTicket: async (ticketId, updateData) => {
    const response = await apiClient.put(
      `/support/tickets/${ticketId}`,
      updateData
    );
    return response.data;
  },

  // Admin only endpoints
  admin: {
    // Get all support tickets (admin only)
    getAllTickets: async (params = {}) => {
      const queryParams = new URLSearchParams();

      if (params.status) queryParams.append("status", params.status);
      if (params.category) queryParams.append("category", params.category);
      if (params.user_type) queryParams.append("user_type", params.user_type);
      if (params.urgency) queryParams.append("urgency", params.urgency);
      if (params.search) queryParams.append("search", params.search);
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const response = await apiClient.get(
        `/support/admin/tickets?${queryParams.toString()}`
      );
      return response.data;
    },

    // Update ticket status and resolution (admin only)
    updateTicketStatus: async (ticketId, statusData) => {
      const response = await apiClient.put(
        `/support/admin/tickets/${ticketId}/status`,
        statusData
      );
      return response.data;
    },

    // Get support ticket statistics (admin only)
    getTicketStats: async (userType = null) => {
      const queryParams = userType ? `?user_type=${userType}` : "";
      const response = await apiClient.get(
        `/support/admin/stats${queryParams}`
      );
      return response.data;
    },
  },
};

export default supportAPI;
