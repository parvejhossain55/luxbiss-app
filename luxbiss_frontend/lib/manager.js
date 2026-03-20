import { api } from "./api";

/**
 * Manager Service (/managers)
 * Admin-only endpoints for managing sub-admins/staff.
 */
export const managerService = {
    /**
     * 1. List Managers
     * @param {Object} params - pagination params { page, per_page }
     */
    async getManagers(params = {}) {
        const res = await api.get("/managers", { params });
        return res.data;
    },

    /**
     * 2. Get Manager By ID
     */
    async getManager(id) {
        const res = await api.get(`/managers/${id}`);
        return res.data;
    },

    /**
     * 3. Create Manager
     * @param {Object} managerData - { name, telegram_username, profile_photo }
     */
    async createManager(managerData) {
        const res = await api.post("/managers", managerData);
        return res.data;
    },

    /**
     * 4. Update Manager
     */
    async updateManager(id, managerData) {
        const res = await api.put(`/managers/${id}`, managerData);
        return res.data;
    },

    /**
     * 5. Delete Manager
     */
    async deleteManager(id) {
        const res = await api.delete(`/managers/${id}`);
        // Handle 204 No Content
        if (res.status === 204 || res.data === "") {
            return { success: true };
        }
        return res.data;
    }
};
