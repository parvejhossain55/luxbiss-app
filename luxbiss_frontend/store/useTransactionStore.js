import { create } from "zustand";
import { transactionService } from "@/lib/transaction";

export const useTransactionStore = create((set, get) => ({
    transactions: [],
    summary: {
        available_balance: 0,
        total_deposit: 0,
        total_withdrawal: 0,
        withdraw_report: [],
    },
    isLoading: false,
    error: null,
    pagination: {
        page: 1,
        per_page: 10,
        total: 0,
    },

    /**
     * Fetch Transaction History with filtering
     * @param {Object} params - { page, per_page, type, status }
     */
    fetchTransactions: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
            const apiParams = { ...params };
            if (apiParams.per_page) {
                apiParams.limit = apiParams.per_page;
            }

            const res = await transactionService.getTransactions(apiParams);
            if (res.success) {
                set({
                    transactions: res.data,
                    pagination: {
                        page: res.meta?.page || 1,
                        per_page: res.meta?.per_page || 10,
                        total: res.meta?.total || 0,
                    }
                });
            }
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to fetch transactions";
            set({ error: message });
            return { success: false, message };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Fetch Transaction Summary (Available Balance, Charts)
     * @param {number} daysCount - Days for report history
     * @param {string} userId - Optional user ID for admin use
     */
    fetchSummary: async (daysCount = 7, userId = null) => {
        set({ isLoading: true, error: null });
        try {
            const res = await transactionService.getSummary(daysCount, userId);
            if (res.success) {
                set({ summary: res.data });
            }
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to fetch summary";
            set({ error: message });
            return { success: false, message };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Single call to create a transaction (Deposit or Withdraw)
     * Calls re-fetch summary on success to keep balance consistent
     */
    createTransaction: async (txData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await transactionService.createTransaction(txData);
            if (res.success) {
                await Promise.all([
                    get().fetchSummary(),
                    get().fetchTransactions(get().pagination)
                ]);
                return res;
            }

            throw new Error(res.message || "Transaction failed");
        } catch (err) {
            const message = err.response?.data?.message || err.message || "An error occurred";
            set({ error: message });
            return { success: false, message };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Update Transaction Status (Admin)
     */
    updateTransaction: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const res = await transactionService.updateTransaction(id, data);
            if (res.success) {
                // Update local instance
                const { transactions } = get();
                const updated = transactions.map(t => t.id === id ? res.data : t);
                set({ transactions: updated });
                // Optionally resync top stats
                get().fetchSummary(get().summaryDays); // if we stored it
            }
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to update transaction";
            set({ error: message });
            return { success: false, message };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Invest in a combo set
     * @param {Object} investData - { level_id, step_id, quantity }
     */
    investInProduct: async (investData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await transactionService.invest(
                investData.level_id,
                investData.step_id,
                investData.quantity
            );
            if (res.success) {
                // Refresh relevant data
                await Promise.all([
                    get().fetchSummary(),
                    get().fetchTransactions(get().pagination),
                ]);
            }
            return res;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Investment failed";
            set({ error: message });
            return { success: false, message };
        } finally {
            set({ isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
}));
