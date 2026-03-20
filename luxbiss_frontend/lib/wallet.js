import { api } from "./api";

/**
 * Wallet Service (/wallets)
 */
export const walletService = {
    // 1. List Wallets
    async getWallets() {
        const res = await api.get("/wallets");
        return res.data;
    },

    // 2. Create Wallet (Admin)
    async createWallet(walletData) {
        const res = await api.post("/wallets", walletData);
        return res.data;
    },

    // 3. Update Wallet (Admin)
    async updateWallet(id, walletData) {
        const res = await api.put(`/wallets/${id}`, walletData);
        return res.data;
    },

    // 4. Delete Wallet (Admin)
    async deleteWallet(id) {
        const res = await api.delete(`/wallets/${id}`);
        // 204 No Content has no JSON body, handle explicitly
        if (res.status === 204 || res.data === "") {
            return { success: true };
        }
        return res.data;
    }
};
