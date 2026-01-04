import api from "./api";

export const customerService = {
  getCustomerById: async (customerId) => {
    const res = await api.get(`/member/customers/${customerId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  },
  updateInfo: async (customerData) => {
    const res = await api.put(
      `/member/customers/${customerData.id}`,
      customerData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );  
    return res.data;
  },
  searchAdvance: async (params) => {
    const res = await api.get(`/admin/customers`, {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/admin/customers/${id}/status`, null, {
      params: { status },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  },
};
