import { api } from "./api";

/**
 * Transaction Service (/transactions)
 */

export const transactionService = {
    /**
     * 1. List Transactions (with Pagination and filtering)
     * @param {Object} params - { page, per_page, type, status, sort_by, sort_order }
     */
    async getTransactions(params = {}) {
        const res = await api.get("/transactions", { params });
        return res.data;
    },

    /**
     * 2. Get Transaction Summary (Balance, stats)
     * @param {number} days - Number of days for chart data (default 7)
     * @param {string} userId - Optional user ID for admin to fetch specific user stats
     */
    async getSummary(days = 7, userId = null) {
        const params = { days };
        if (userId) params.user_id = userId;
        const res = await api.get(`/transactions/summary`, { params });
        return res.data;
    },

    /**
     * 3. Create Transaction (Deposit or Withdraw)
     * @param {Object} txData - { type, amount, tx_hash, note }
     */
    async createTransaction(txData) {
        const res = await api.post("/transactions", txData);
        return res.data;
    },

    /**
     * 4. Deposit Alias
     */
    async deposit(amount, tx_hash = "", note = "") {
        return this.createTransaction({
            type: "deposit",
            amount: parseFloat(amount),
            tx_hash,
            note,
        });
    },

    /**
     * 5. Withdraw Alias
     */
    async withdraw(amount, note = "") {
        return this.createTransaction({
            type: "withdraw",
            amount: parseFloat(amount),
            note,
        });
    },

    /**
     * 6. Update Transaction Status (Admin)
     */
    async updateTransaction(id, data) {
        const res = await api.put(`/transactions/${id}`, data);
        return res.data;
    },

    /**
     * 7. Delete Transaction (Admin)
     */
    async deleteTransaction(id) {
        const res = await api.delete(`/transactions/${id}`);
        return res.data;
    },

    /**
     * 8. Invest in Step
     * @param {number} levelId 
     * @param {number} stepId 
     * @param {number} quantity 
     */
    async invest(levelId, stepId, quantity = 1) {
        const res = await api.post("/transactions/invest", {
            level_id: parseInt(levelId),
            step_id: parseInt(stepId),
            quantity: parseInt(quantity)
        });
        return res.data;
    }
};
