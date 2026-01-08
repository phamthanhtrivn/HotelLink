import api from "./api";

export const roomTypeService = {
  fetchRoomTypes: async (filters, page, size = 5) => {
    const query = new URLSearchParams({
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
      adults: filters.adults,
      children: filters.children,
      roomTypeName: filters.roomTypeName,
      page: page,
      size: size,
    }).toString();

    const res = await api.get(`/public/room-types/search?${query}`);
    return res.data;
  },
  getRoomTypeById: async (id) => {
    const res = await api.get(`/public/room-types/${id}`);
    return res.data;
  },
  activeRoomTypes: async () => {
    const res = await api.get(`/admin/room-types/active`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  },
  searchAdvance: async (params) => {
    const res = await api.get(`/admin/room-types`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(
      `/admin/room-types/${id}/status`,
      null,
      {
        params: { status },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res.data;
  },
};
