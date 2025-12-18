import api from "./api";

export const authService = {
  verifyToken: async (token) => {
    const res = await api.get("/auth/verify-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
};
