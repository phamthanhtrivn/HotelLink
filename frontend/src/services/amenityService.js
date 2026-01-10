import api from "./api";

export const amenityService = {
  getAll: async () => {
    const res = await api.get("/admin/amenities", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  },
};
