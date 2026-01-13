import api from "./api";

export const roomService = {
  searchAdvance: async (params) => {
    const res = await api.get("/admin/rooms", {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  },
  updateStatus: async (roomId, status) => {
    const res = await api.patch(`/admin/rooms/${roomId}/status`, null, {
      params: { status },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
    return res.data
  },
  updateRoom: async (roomId, data) => {
    const res = await api.put(`/admin/rooms/${roomId}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
    return res.data;
  },
  updateRoomStatus: async (roomId, roomStatus) => {
    const res = await api.patch(`/staff/rooms/${roomId}/room-status`, null, {
       params: {
        roomStatus,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
     
    })
    return res.data;
  }
};
