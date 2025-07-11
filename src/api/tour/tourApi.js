// src/api/tourApi.js
import apiClient from "../apiClient";
import axios from "axios";

export const createTour = async (tourData) => {
  try {
    const response = await apiClient.post(
      "tour-packages/createTour",
      tourData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Tour creation failed:", error);

    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data?.message;
      const validationErrors = error.response?.data?.errors;

      if (validationErrors) {
        throw new Error(
          `Validation failed: ${Object.entries(validationErrors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("; ")}`
        );
      }

      throw new Error(serverMessage || "Failed to create tour (server error)");
    }

    throw new Error(
      error instanceof Error ? error.message : "Failed to create tour"
    );
  }
};

export const getTourPackageById = async (guideId) => {
  try {
    return await apiClient.get(`tour-packages/guide/${guideId}`);
  } catch (error) {
    console.error("Error fetching tour packages:", error);
    throw error;
  }
};

export const getTourById = async (tourId) => {
  try {
    return await apiClient.get(`tour-packages/${tourId}`);
  } catch (error) {
    console.error("Error fetching tour package:", error);
    throw error;
  }
};

export const uploadtempcover = async (formData) => {
  try {
    // console.log(formData);
    const response = await apiClient.post("storage/temp-cover", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const viewtempcover = async (s3Key) => {
  try {
    const response = await apiClient.get("storage/file-url", {
      params: { s3Key },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("URL generation error:", error);
    throw error;
  }
};

export const uploadtempmedia = async (formData) => {
  try {
    // console.log(formData)
    const response = await apiClient.post("storage/temp-media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const finalizemedia = async (formData) => {
  try {
    // console.log(formData);
    const response = await apiClient.post("storage/finalize", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Finalization error:", error);
    throw error;
  }
};

// Get tour package media with fresh signed URLs (for moderators)
export const getTourPackageMedia = async (packageId) => {
  try {
    const response = await apiClient.get(
      `storage/tour-package/${packageId}/media`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tour package media:", error);
    throw error;
  }
};

// Get specific media files with fresh signed URLs
export const getMediaUrls = async (mediaIds) => {
  try {
    const idsParam = Array.isArray(mediaIds) ? mediaIds.join(",") : mediaIds;
    const response = await apiClient.get("storage/media/urls", {
      params: { mediaIds: idsParam },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching media URLs:", error);
    throw error;
  }
};

export const createTourStops = async (packageId, stops) => {
  try {
    const response = await apiClient.post(
      "tour-packages/tour-stops/bulk",
      {
        package_id: packageId,
        stops,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Tour stops creation failed:", error);
    throw error;
  }
};

export const createLocation = async (locationData) => {
  try {
    const response = await apiClient.post(
      "tour-packages/locations",
      locationData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Location creation failed:", error);
    throw error;
  }
};
