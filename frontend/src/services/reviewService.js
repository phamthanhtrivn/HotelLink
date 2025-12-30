import api from "./api";

export const reviewService = {
  getTop3Reviews: async () => {
    const res = await api.get("/public/reviews/top-three");
    return res.data;
  },
  getReviewsByRoomTypeId: async (roomTypeId) => {
    const res = await api.get(`/public/reviews/room-type/${roomTypeId}`);
    return res.data;
  },
  reviewByCustomer: async (review, customerId, bookingId) => {
    const res = await api.post(
      `/member/reviews/customer/${customerId}/booking/${bookingId}`,
      review,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return res.data;
  },
  getReviewByBookingId: async (bookingId) => {
    const res = await api.get(`/member/reviews/booking/${bookingId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  },
};
