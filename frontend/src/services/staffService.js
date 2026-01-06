import api from "./api";

export const staffService = {
  seachAdvance: async (params) => {
    const res = await api.get("/admin/staffs", {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  },
  updateStatus: async (staffId, status) => {
    const res = await api.patch(`/admin/staffs/${staffId}/status`, null, {
      params: { status },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },
    });
    return res.data;
  },
  createStaff: async (staffData) => {
    const res = await api.post("/admin/staffs", staffData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  },
  updateStaff: async (staffId, staffData) => {
    const res = await api.put(`/admin/staffs/${staffId}`, staffData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  }
};
