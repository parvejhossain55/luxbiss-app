import { api } from "./api";

export const transactionTemplateService = {
    async getTemplates() {
        const res = await api.get("/transaction-templates");
        return res.data;
    },

    async createTemplate(data) {
        const res = await api.post("/transaction-templates", data);
        return res.data;
    },

    async updateTemplate(id, data) {
        const res = await api.put(`/transaction-templates/${id}`, data);
        return res.data;
    },

    async deleteTemplate(id) {
        const res = await api.delete(`/transaction-templates/${id}`);
        if (res.status === 204 || res.data === "") {
            return { success: true };
        }
        return res.data;
    },
};
