import api from "./api";

export const bookingService = {
  getTotalBookingByCustomerId: async (customerId) => {
    const res = await api.get(`/member/bookings/customer-total/${customerId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return await res.data;
  },
  createBookingByCustomer: async (bookingRequest) => {
    const res = await api.post(
      `/public/bookings/create-by-customer`,
      bookingRequest
    );

    return await res.data;
  },
  getBookingById: async (bookingId) => {
    const res = await api.get(`/public/bookings/${bookingId}`);
    return await res.data;
  }
};
