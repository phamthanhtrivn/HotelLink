import api from "./api";

export const dashboardService = {
  getDashboardData: async () => {
    const res = await api.get("/staff/dashboard", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  },
};
