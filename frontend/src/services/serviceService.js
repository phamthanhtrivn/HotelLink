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
  saveService: async (data) => {
    const res = await api.post(`/admin/services`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  },
  updateService: async (serviceId, data) => {
    const res = await api.put(`/admin/services/${serviceId}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  },
};
