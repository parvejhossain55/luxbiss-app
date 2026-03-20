import { api } from "./api";

/**
 * User Module (/users)
 */

export const userService = {
    // 1. Get Current User (/me)
    async getMe() {
        const res = await api.get("/users/me");
        if (res.data.success && res.data.data) {
            if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify(res.data.data));
            }
        }
        return res.data;
    },

    // 2. Update Profile
    async updateProfile(id, profileData) {
        const res = await api.put(`/users/${id}`, profileData);
        if (res.data.success && res.data.data) {
            if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify(res.data.data));
            }
        }
        return res.data;
    },

    // 3. List Users (Admin)
    async getUsers(params = {}) {
        const res = await api.get("/users", { params });
        return res.data;
    },

    // 4. Get User By ID
    async getUser(id) {
        const res = await api.get(`/users/${id}`);
        return res.data;
    },

    // 5. Update User (Admin)
    async updateUser(id, userData) {
        const res = await api.put(`/users/${id}`, userData);
        return res.data;
    },

    // 6. Approve Hold Balance (Admin)
    async approveHoldBalance(id) {
        const res = await api.post(`/users/${id}/approve-hold`);
        return res.data;
    },

    // 7. Delete User (Admin)
    async deleteUser(id) {
        const res = await api.delete(`/users/${id}`);
        return res.data;
    },

    // 8. Advance Users to Next Step (Admin)
    async advanceUsersToNextStep(level_id, current_step_id, next_level_id, next_step_id) {
        const res = await api.post("/users/advance-step", { level_id, current_step_id, next_level_id, next_step_id });
        return res.data;
    }
};
