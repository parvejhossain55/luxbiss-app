import { api } from "./api";

export const adminDashboardService = {
  async getStats() {
    const res = await api.get("/admin/dashboard/stats");
    return res.data;
  },
  async getRecentActivity() {
    const res = await api.get("/admin/dashboard/recent-activity");
    return res.data;
  },
};

