import { create } from "zustand";
import { productService } from "@/lib/product";

export const useProductStore = create((set, get) => ({
    products: [],
    levels: [],
    steps: [],
    isLoading: false,
    error: null,
    pagination: {
        page: 1,
        per_page: 10,
        total: 0,
    },
    levelPagination: {
        page: 1,
        per_page: 15, // default grid size
        total: 0,
    },
    stepPagination: {
        page: 1,
        per_page: 15, // default grid size
        total: 0,
    },

    /**
     * Fetch products with filtering and pagination
     */
    fetchProducts: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
            const res = await productService.getProducts(params);
            if (res.success) {
                set({
                    products: res.data,
                    pagination: {
                        page: res.meta?.page || 1,
                        per_page: res.meta?.per_page || 10,
                        total: res.meta?.total || 0,
                    }
                });
            }
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to fetch products";
            set({ error: message });
            return { success: false, message };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Fetch all levels
     */
    fetchLevels: async (params = {}) => {
        set({ isLoading: true });
        try {
            const res = await productService.getLevels(params);
            if (res.success) {
                set({
                    levels: res.data,
                    levelPagination: {
                        page: res.meta?.page || 1,
                        per_page: res.meta?.per_page || 15,
                        total: res.meta?.total || 0,
                    }
                });
            }
            return res;
        } catch (err) {
            console.error("Failed to fetch levels:", err);
            return { success: false };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Fetch steps for a specific level
     */
    fetchSteps: async (levelId, params = {}) => {
        if (!levelId) return;
        set({ isLoading: true });
        try {
            const res = await productService.getSteps(levelId, params);
            if (res.success) {
                set({
                    steps: res.data,
                    stepPagination: {
                        page: res.meta?.page || 1,
                        per_page: res.meta?.per_page || 15,
                        total: res.meta?.total || 0,
                    }
                });
            }
            return res;
        } catch (err) {
            console.error("Failed to fetch steps:", err);
            return { success: false };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Create product
     */
    createProduct: async (productData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await productService.createProduct(productData);
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to create product";
            const errors = err.response?.data?.errors;
            set({ error: message });
            return { success: false, message, errors };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Update product
     */
    updateProduct: async (id, productData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await productService.updateProduct(id, productData);
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to update product";
            const errors = err.response?.data?.errors;
            set({ error: message });
            return { success: false, message, errors };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Upload product image
     */
    uploadProductImage: async (file) => {
        set({ isLoading: true, error: null });
        try {
            const res = await productService.uploadImage(file);
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to upload image";
            set({ error: message });
            return { success: false, message };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Delete product
     */
    deleteProduct: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await productService.deleteProduct(id);
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to delete product";
            set({ error: message });
            return { success: false, message };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Create Level (Admin Only)
     */
    createLevel: async (levelData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await productService.createLevel(levelData);
            if (res.success) {
                await get().fetchLevels(get().levelPagination);
            }
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to create level";
            const errors = err.response?.data?.errors;
            set({ error: message });
            return { success: false, message, errors };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Update Level (Admin Only)
     */
    updateLevel: async (id, levelData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await productService.updateLevel(id, levelData);
            if (res.success) {
                await get().fetchLevels(get().levelPagination);
            }
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to update level";
            const errors = err.response?.data?.errors;
            set({ error: message });
            return { success: false, message, errors };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Delete Level (Admin Only)
     */
    deleteLevel: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await productService.deleteLevel(id);
            if (res.success) {
                await get().fetchLevels(get().levelPagination);
            }
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to delete level";
            set({ error: message });
            return { success: false, message };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Create Step (Admin Only)
     */
    createStep: async (stepData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await productService.createStep(stepData);
            if (res.success) {
                await get().fetchSteps(stepData.level_id, get().stepPagination);
            }
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to create step";
            const errors = err.response?.data?.errors;
            set({ error: message });
            return { success: false, message, errors };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Update Step (Admin Only)
     */
    updateStep: async (id, stepData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await productService.updateStep(id, stepData);
            if (res.success) {
                const levelId = stepData.level_id || get().steps.find(s => s.id === id)?.level_id;
                await get().fetchSteps(levelId, get().stepPagination);
            }
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to update step";
            const errors = err.response?.data?.errors;
            set({ error: message });
            return { success: false, message, errors };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Delete Step (Admin Only)
     */
    deleteStep: async (id, levelId) => {
        set({ isLoading: true, error: null });
        try {
            const res = await productService.deleteStep(id);
            if (res.success) {
                await get().fetchSteps(levelId, get().stepPagination);
            }
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to delete step";
            set({ error: message });
            return { success: false, message };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Advance Users to Next Step (Admin Only)
     */
    advanceUsersToNextStep: async (levelId, currentStepId, nextLevelId, nextStepId) => {
        set({ isLoading: true, error: null });
        try {
            const { userService } = await import("@/lib/user");
            const res = await userService.advanceUsersToNextStep(levelId, currentStepId, nextLevelId, nextStepId);
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to advance users";
            set({ error: message });
            return { success: false, message };
        } finally {
            set({ isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
}));
