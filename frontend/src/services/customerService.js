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
  }
};
