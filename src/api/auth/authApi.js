import apiClient from "../apiClient";
import axios from "axios";

export const login = async (credentials) => {
  try {
    const response = await apiClient.post("/auth/login", credentials);

    if (response.data.data?.status === "pending_approval") {
      throw new Error(
        "Your account is pending approval. Please wait for admin approval."
      );
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const signup = async (userData) => {
  try {
    const roleMap = {
      guide: "travel_guide",
      restaurant: "vendor",
      traveler: "traveler",
    };

    const backendRole = roleMap[userData.role] || userData.role;

    const signupPayload = {
      name: userData.name,
      email: userData.email,
      phone_no: userData.phone_no,
      password: userData.password,
      role: backendRole,
      profile_picture_url: userData.profile_picture_url || "",
      bio: userData.bio || "",
    };

    if (backendRole === "travel_guide") {
      signupPayload.license = userData.license || userData.guideId;
      (signupPayload.verification_documents = userData.verification_documents),
        (signupPayload.years_of_experience = userData.years_of_experience || 0);
      signupPayload.languages_spoken = userData.languages_spoken || ["English"];
    } else if (backendRole === "vendor") {
      signupPayload.business_name = userData.name;
      signupPayload.business_type = userData.type;
      signupPayload.address = userData.address;
      signupPayload.city = userData.city || "Unknown";
      signupPayload.province = userData.province || "Unknown";
      signupPayload.location = userData.location;
      signupPayload.latitude = userData.latitude || 0;
      signupPayload.longitude = userData.longitude || 0;
      signupPayload.restaurantType = userData.restaurantType;
    }

    // If frontend passed a FormData (for file upload), send it directly.
    let response;
    if (userData instanceof FormData) {
      response = await apiClient.post("/auth/signup", userData, {
        headers: {
          // Let the browser/axios set the correct multipart boundary
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      response = await apiClient.post("/auth/signup", signupPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return response.data;
  } catch (error) {
    let errorMessage = "Signup failed";

    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Signup failed. Please check your input and try again.";

      if (error.response?.data?.errors) {
        errorMessage += `: ${JSON.stringify(error.response.data.errors)}`;
      }
    }

    throw new Error(errorMessage);
  }
};

export const logout = async () => {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Logout failed");
  }
};

// Add these API functions to your authApi.js file

export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to send OTP");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await apiClient.post("/auth/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "OTP verification failed"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const resetPasswordWithOTP = async (email, otp, newPassword) => {
  try {
    const response = await apiClient.post("/auth/reset-password-otp", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  } catch (error) {
    // If the endpoint wasn't found, some backends use a different route name.
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      try {
        const altResponse = await apiClient.post("/auth/reset-password", {
          email,
          otp,
          newPassword,
        });
        return altResponse.data;
      } catch (altErr) {
        if (axios.isAxiosError(altErr)) {
          throw new Error(
            altErr.response?.data?.message ||
              "Password reset failed (alternate endpoint)"
          );
        }
        throw new Error("An unexpected error occurred (alternate endpoint)");
      }
    }

    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Password reset failed");
    }

    throw new Error("An unexpected error occurred");
  }
};
