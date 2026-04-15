import { create } from "zustand";
import { transactionTemplateService } from "@/lib/transactionTemplate";

export const useTransactionTemplateStore = create((set) => ({
    templates: [],
    isLoading: false,
    error: null,

    fetchTemplates: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await transactionTemplateService.getTemplates();
            if (res.success) {
                set({ templates: res.data || [] });
            }
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to fetch transaction templates";
            set({ error: message });
            return { success: false, message };
        } finally {
            set({ isLoading: false });
        }
    },

    createTemplate: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const res = await transactionTemplateService.createTemplate(data);
            if (res.success) {
                set((state) => ({ templates: [res.data, ...state.templates] }));
            }
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to create transaction template";
            set({ error: message });
            return { success: false, message };
        } finally {
            set({ isLoading: false });
        }
    },

    updateTemplate: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const res = await transactionTemplateService.updateTemplate(id, data);
            if (res.success) {
                set((state) => ({
                    templates: state.templates.map((template) => template.id === id ? res.data : template)
                }));
            }
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to update transaction template";
            set({ error: message });
            return { success: false, message };
        } finally {
            set({ isLoading: false });
        }
    },

    deleteTemplate: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await transactionTemplateService.deleteTemplate(id);
            if (res.success || res.status === 204) {
                set((state) => ({
                    templates: state.templates.filter((template) => template.id !== id)
                }));
                return { success: true };
            }
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to delete transaction template";
            set({ error: message });
            return { success: false, message };
        } finally {
            set({ isLoading: false });
        }
    },
}));
