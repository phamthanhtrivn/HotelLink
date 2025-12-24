import { baseUrl } from "@/constants/constants";
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

    const res = await api.get(
      `${baseUrl}/api/public/room-types/search?${query}`
    );
    return res.data;
  },
  getRoomTypeById: async (id) => {
    const res = await api.get(`${baseUrl}/api/public/room-types/${id}`);
    return res.data;
  }
};
