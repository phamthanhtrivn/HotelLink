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
      bookingRequest,
    );

    return await res.data;
  },
  getBookingById: async (bookingId) => {
    const res = await api.get(`/public/bookings/${bookingId}`);
    return await res.data;
  },
  getBookingsByCustomerId: async (customerId, params) => {
    const res = await api.get(`/member/bookings/customer/${customerId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      params,
    });
    return res.data;
  },
  cancelBookingByCustomer: async (bookingId) => {
    const res = await api.put(`/public/bookings/${bookingId}`);
    return res.data;
  },
  createByStaff: async (bookingRequest) => {
    const res = await api.post("/staff/bookings", bookingRequest, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  },
  searchAdvance: async (data, params) => {
    const res = await api.post(`/staff/bookings/search-advance`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params,
    });
    return res.data;
  },
  updateBookingStatus: async (bookingId, data) => {
    const res = await api.patch(
      `/staff/bookings/${bookingId}/booking-status`,
      {
        userId: data.userId,
        bookingStatus: data.bookingStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    return res.data;
  },
  checkInBooking: async (bookingId, userId) => {
    const res = await api.patch(
      `/staff/bookings/${bookingId}/check-in`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    return res.data;
  },
  addServicesToBooking: async (bookingId, data) => {
    const res = await api.post(`/staff/bookings/${bookingId}/add-services`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  },
  previewCheckOut: async (bookingId) => {
    const res = await api.get(`/staff/bookings/${bookingId}/preview-checkout`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
    return res.data
  },
  checkOutBooking: async (bookingId, data) => {
    const res = await api.post(`/staff/bookings/${bookingId}/check-out`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
    return res.data
  }
};
