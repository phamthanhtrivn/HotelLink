import api from "./api";

export const serviceSerice = {
  findService: async (params) => {
    const res = await api.get(`/admin/services`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  },
};
