import apiClient from "../apiClient"; // your axios instance with baseURL: http://localhost:3001/api/v1

const VendorService = {
  async getVendorProfile() {
    const { data } = await apiClient.get("/vendor");
    return data; // { success, data: {..., logoUrl, coverPhotoUrl } }
  },

  async updateVendorProfile(payload) {
    
    const { data } = await apiClient.put("/vendor", payload);
    return data;
  },

  async uploadVendorLogo(file) {
    const fd = new FormData();
    fd.append("logo", file);
    const { data } = await apiClient.post("/vendor/logo", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data; // { success, data: { logoUrl: "http://host/uploads/..." } }
  },

  async uploadVendorCover(file) {
    const fd = new FormData();
    fd.append("cover", file);
    const { data } = await apiClient.post("/vendor/cover", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data; // { success, data: { coverUrl: "http://host/uploads/..." } }
  },
};

export default VendorService;
