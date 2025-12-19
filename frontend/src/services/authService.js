import api from "./api";

export const authService = {
  register: async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },
  login: async (data) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },
  verifyToken: async (token) => {
    const res = await api.get("/auth/verify-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
};
