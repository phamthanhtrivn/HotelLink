import api from "./api"

export const paymentService = {
  payWithVNPay: async (paymentData) => {
    const res = await api.post("/payments/vn-pay", paymentData)
    return res.data;
  },
  payWithMomo: async (paymentData) => {
    const res = await api.post("/payments/momo", paymentData)
    return res.data;
  }
}