import { api } from "./api";

/**
 * Product Service (/products)
 */

export const productService = {
    /**
     * 1. List Products (with Pagination and filtering)
     * @param {Object} params - { page, per_page, level_id, step_id, sort_by, order }
     */
    async getProducts(params = {}) {
        const res = await api.get("/products", { params });
        return res.data;
    },

    /**
     * 2. Get Product by ID
     * @param {string} id
     */
    async getProduct(id) {
        const res = await api.get(`/products/${id}`);
        return res.data;
    },

    /**
     * 3. Create Product (Admin Only)
     * @param {Object} productData
     */
    async createProduct(productData) {
        const res = await api.post("/products", productData);
        return res.data;
    },

    /**
     * 4. Update Product (Admin Only)
     * @param {string} id
     * @param {Object} productData
     */
    async updateProduct(id, productData) {
        const res = await api.put(`/products/${id}`, productData);
        return res.data;
    },

    /**
     * 5. Delete Product (Admin Only)
     * @param {string} id
     */
    async deleteProduct(id) {
        const res = await api.delete(`/products/${id}`);
        return res.data;
    },

    /**
     * 6. List Levels
     */
    async getLevels(params = {}) {
        const res = await api.get("/levels", { params });
        return res.data;
    },

    /**
     * 7. List Steps by Level
     * @param {number} levelId
     */
    async getSteps(levelId, params = {}) {
        const res = await api.get(`/levels/${levelId}/steps`, { params });
        return res.data;
    },

    /**
     * 8. Create Level (Admin Only)
     */
    async createLevel(levelData) {
        const res = await api.post("/levels", levelData);
        return res.data;
    },

    /**
     * 9. Update Level (Admin Only)
     */
    async updateLevel(id, levelData) {
        const res = await api.put(`/levels/${id}`, levelData);
        return res.data;
    },

    /**
     * 10. Delete Level (Admin Only)
     */
    async deleteLevel(id) {
        const res = await api.delete(`/levels/${id}`);
        return res.data;
    },

    /**
     * 11. Create Step (Admin Only)
     */
    async createStep(stepData) {
        const res = await api.post("/steps", stepData);
        return res.data;
    },

    /**
     * 12. Update Step (Admin Only)
     */
    async updateStep(id, stepData) {
        const res = await api.put(`/steps/${id}`, stepData);
        return res.data;
    },

    /**
     * 13. Delete Step (Admin Only)
     */
    async deleteStep(id) {
        const res = await api.delete(`/steps/${id}`);
        return res.data;
    },

    /**
     * 14. Upload Product Image (Admin Only)
     */
    async uploadImage(file) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await api.post("/upload/image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },
};
