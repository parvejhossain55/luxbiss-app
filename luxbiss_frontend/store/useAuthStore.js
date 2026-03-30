import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/lib/auth";
import { userService } from "@/lib/user";

const extractErrorMessage = (err, defaultMsg = "An error occurred") => {
    const data = err.response?.data;
    if (!data) return err.message || defaultMsg;

    let message = data.message || err.message || defaultMsg;

    if (data.errors && Array.isArray(data.errors)) {
        const fieldErrors = data.errors
            .map(e => {
                const field = e.field ? e.field.replace(/_/g, " ") : "";
                return field ? `${field}: ${e.message}` : e.message;
            })
            .join(". ");
        if (fieldErrors) {
            message = `${message}. ${fieldErrors}`;
        }
    }

    return message;
};

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: true,
            error: null,

            setUser: (user) => set({ user, isAuthenticated: !!user }),

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await authService.login(email, password);
                    if (res.success) {
                        set({ user: res.data?.user || null, isAuthenticated: true, error: null });
                        await get().fetchMe();
                        return res;
                    }
                    throw new Error(res.message || "Login failed");
                } catch (err) {
                    const message = extractErrorMessage(err, "Login failed");
                    set({ error: message });
                    return { success: false, message };
                } finally {
                    set({ isLoading: false });
                }
            },

            register: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await authService.register(userData);
                    if (res.success) {
                        return res;
                    }
                    throw new Error(res.message || "Registration failed");
                } catch (err) {
                    const message = extractErrorMessage(err, "Registration failed");
                    set({ error: message });
                    return { success: false, message };
                } finally {
                    set({ isLoading: false });
                }
            },

            confirmRegistration: async (email, otp) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await authService.confirmRegistration(email, otp);
                    if (res.success) {
                        set({ user: res.data?.user || null, isAuthenticated: true, error: null });
                        await get().fetchMe();
                        return res;
                    }
                    throw new Error(res.message || "Verification failed");
                } catch (err) {
                    const message = extractErrorMessage(err, "Verification failed");
                    set({ error: message });
                    return { success: false, message };
                } finally {
                    set({ isLoading: false });
                }
            },

            googleLogin: async (token) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await authService.googleLogin(token);
                    if (res.success) {
                        set({ user: res.data?.user || null, isAuthenticated: true, error: null });
                        await get().fetchMe();
                        return res;
                    }
                    throw new Error(res.message || "Google login failed");
                } catch (err) {
                    const message = err.response?.data?.message || err.message || "An error occurred";
                    set({ error: message });
                    return { success: false, message };
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: async () => {
                try {
                    await authService.logout();
                } finally {
                    const { resetAllStores } = await import("@/store/resetAllStores");
                    resetAllStores();
                }
            },


            fetchMe: async () => {
                set({ isLoading: true });
                try {
                    const res = await userService.getMe();
                    if (res.success) {
                        set({ user: res.data, isAuthenticated: true });
                    }
                    return res;
                } catch (err) {
                    // If we fail fetching user, clear state if it's 401
                    if (err.response?.status === 401) {
                        get().logout();
                    }
                    return { success: false, message: err.message };
                } finally {
                    set({ isLoading: false });
                }
            },

            updateUser: async (id, profileData) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await userService.updateProfile(id, profileData);
                    if (res.success) {
                        set({ user: res.data, error: null });
                    }
                    return res;
                } catch (err) {
                    const message = extractErrorMessage(err, "Update failed");
                    set({ error: message });
                    return { success: false, message };
                } finally {
                    set({ isLoading: false });
                }
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: "luxbiss-auth-storage", // name of the item in the storage (default is localStorage)
            getStorage: () => localStorage, // use localStorage (default)
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }), // only persist these fields
        }
    )
);
