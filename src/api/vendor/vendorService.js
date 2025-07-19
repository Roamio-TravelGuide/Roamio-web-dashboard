import apiClient from "../apiClient.js";

// Vendor API service for handling vendor-related operations
export class VendorService {
  /**
   * Get vendor profile data
   * @returns {Promise} Vendor profile data
   */
  static async getVendorProfile() {
    try {
      const response = await apiClient.get("/vendor");
      return response.data;
    } catch (error) {
      console.error("Error fetching vendor profile:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Update vendor profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Updated vendor profile
   */
  static async updateVendorProfile(profileData) {
    try {
      const payload = {
        businessName: profileData.businessName,
        description: profileData.description,
        email: profileData.email,
        phone: profileData.phone,
        socialMedia: {
          instagram: profileData.socialMedia?.instagram || "",
          facebook: profileData.socialMedia?.facebook || "",
          website: profileData.socialMedia?.website || "",
        },
      };

      const response = await apiClient.put("/vendor", payload);
      return response.data;
    } catch (error) {
      console.error("Error updating vendor profile:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Upload vendor logo
   * @param {File} logoFile - Logo file to upload
   * @returns {Promise} Upload result with URL
   */
  static async uploadVendorLogo(logoFile) {
    try {
      const formData = new FormData();
      formData.append("logo", logoFile);

      const response = await apiClient.post("/vendor/logo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading vendor logo:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Upload vendor cover photo
   * @param {File} coverFile - Cover photo file to upload
   * @returns {Promise} Upload result with URL
   */
  static async uploadVendorCover(coverFile) {
    try {
      const formData = new FormData();
      formData.append("cover", coverFile);

      const response = await apiClient.post("/vendor/cover", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading vendor cover:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors and return user-friendly messages
   * @param {Object} error - Error object from API
   * @returns {Object} Formatted error object
   */
  static handleError(error) {
    if (error.response) {
      // API responded with error status
      const { status, data } = error.response;
      return {
        status,
        message:
          data?.message || "An error occurred while processing your request",
        details: data?.error || null,
      };
    } else if (error.request) {
      // Network error
      return {
        status: 0,
        message: "Network error. Please check your connection and try again.",
        details: null,
      };
    } else {
      // Other error
      return {
        status: 0,
        message: error.message || "An unexpected error occurred",
        details: null,
      };
    }
  }
}

export default VendorService;
