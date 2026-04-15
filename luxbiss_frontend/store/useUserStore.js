import { create } from 'zustand';
import { userService } from '@/lib/user';

export const useUserStore = create((set, get) => ({
    users: [],
    currentUser: null,
    isLoading: false,
    error: null,
    pagination: {
        page: 1,
        per_page: 10,
        total: 0
    },

    /**
     * Fetch users list based on filters/pagination
     */
    fetchUsers: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
            const res = await userService.getUsers(params);

            if (res.success) {
                set({
                    users: res.data || [],
                    pagination: {
                        page: res.meta?.page || 1,
                        per_page: res.meta?.per_page || 10,
                        total: res.meta?.total || 0
                    }
                });
            } else {
                set({ error: res.message || "Failed to fetch users", users: [] });
            }
        } catch (err) {
            set({ error: err.message || "Failed to fetch users", users: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Get a single user by ID
     */
    fetchUser: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await userService.getUser(id);
            if (res.success) {
                set({ currentUser: res.data });
                return { success: true, data: res.data };
            } else {
                set({ error: res.message || "Failed to fetch user" });
                return { success: false, message: res.message };
            }
        } catch (err) {
            set({ error: err.message || "Failed to fetch user" });
            return { success: false, message: err.message };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Update user (Admin)
     */
    updateUser: async (id, userData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await userService.updateUser(id, userData);
            if (res.success) {
                set({ currentUser: res.data });
                // Update local list if we have it
                const { users } = get();
                const updatedUsers = users.map(u => u.id === id ? res.data : u);
                set({ users: updatedUsers });
                return { success: true, data: res.data };
            } else {
                set({ error: res.message || "Failed to update user" });
                return { success: false, message: res.message };
            }
        } catch (err) {
            set({ error: err.message || "Failed to update user" });
            return { success: false, message: err.message };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Approve Hold Balance (Admin)
     */
    approveHoldBalance: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await userService.approveHoldBalance(id);
            if (res.success) {
                set({ currentUser: res.data });
                // Update local list
                const { users } = get();
                const updatedUsers = users.map(u => u.id === id ? res.data : u);
                set({ users: updatedUsers });
                return { success: true, data: res.data };
            } else {
                return { success: false, message: res.message };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || err.message || "Approval failed" };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Insert template transactions for ignored user
     */
    insertTemplateTransactions: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await userService.insertTemplateTransactions(id);
            if (res.success) {
                return { success: true, data: res.data };
            }
            return { success: false, message: res.message };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || err.message || "Failed to insert template transactions" };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Delete user
     */
    deleteUser: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await userService.deleteUser(id);
            if (res.success || res.status === 204) {
                // Update local list
                const { users } = get();
                set({ users: users.filter(u => u.id !== id) });
                return { success: true };
            } else {
                return { success: false, message: res.message };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || err.message || "Failed to delete user" };
        } finally {
            set({ isLoading: false });
        }
    }
}));
