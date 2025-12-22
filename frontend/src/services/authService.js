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
  forgotPassword: async (email) => {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  },
  validateResetPasswordToken: async (token) => {
    const res = await api.get("/auth/validate-reset-password-token", {
      params: { token },
    });
    return res.data;
  },
  resetPassword: async (token, newPassword) => {
    const res = await api.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return res.data;
  }
};
