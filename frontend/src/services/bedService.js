import api from "./api";

export const bedService = {
  getAll: async () => {
    const res = await api.get("/admin/beds", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  },
};
