import api from "./api";

export const personService = {
  getInfoById: async (personId) => {
    const res = await api.get(`/admin/persons/${personId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  },
  updatePersonById: async (personId, updateData) => {
    const res = await api.put(`/admin/persons/${personId}`, updateData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  },
};
