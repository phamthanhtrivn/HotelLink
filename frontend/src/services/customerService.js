import { token } from "@/constants/constants";
import api from "./api";

export const customerService = {
  getCustomerById: async (customerId) => {
    const res = await api.get(`/member/customer/${customerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  updateInfo: async (customerData) => {
    const res = await api.put(
      `/member/customer/${customerData.id}`,
      customerData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  }
};
