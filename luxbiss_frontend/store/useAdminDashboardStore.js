import { create } from 'zustand';
import { adminDashboardService } from '@/lib/adminDashboard';

export const useAdminDashboardStore = create((set) => ({
    stats: null,
    recentActivity: [],
    isLoading: false,
    error: null,

    fetchStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await adminDashboardService.getStats();
            if (res.success) {
                set({ stats: res.data });
                return { success: true, data: res.data };
            } else {
                set({ error: res.message || "Failed to fetch stats" });
                return { success: false, message: res.message };
            }
        } catch (err) {
            set({ error: err.message || "An error occurred while fetching stats" });
            return { success: false, message: err.message };
        } finally {
            set({ isLoading: false });
        }
    },

    fetchRecentActivity: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await adminDashboardService.getRecentActivity();
            if (res.success) {
                set({ recentActivity: res.data });
                return { success: true, data: res.data };
            } else {
                set({ error: res.message || "Failed to fetch recent activity" });
                return { success: false, message: res.message };
            }
        } catch (err) {
            set({ error: err.message || "An error occurred while fetching recent activity" });
            return { success: false, message: err.message };
        } finally {
            set({ isLoading: false });
        }
    }
}));
