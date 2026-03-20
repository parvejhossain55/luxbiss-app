import { create } from 'zustand';
import { walletService } from '@/lib/wallet';

export const useWalletStore = create((set, get) => ({
    wallets: [],
    isLoading: false,
    error: null,

    /**
     * Fetch all wallets
     */
    fetchWallets: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await walletService.getWallets();
            const normalizedWallets = Array.isArray(res)
                ? res
                : Array.isArray(res?.data)
                    ? res.data
                    : Array.isArray(res?.data?.wallets)
                        ? res.data.wallets
                        : Array.isArray(res?.wallets)
                            ? res.wallets
                            : [];

            if (res?.success || normalizedWallets.length > 0) {
                set({ wallets: normalizedWallets });
            } else {
                set({ error: res?.message || "Failed to fetch wallets", wallets: [] });
            }
        } catch (err) {
            set({ error: err.message || "Failed to fetch wallets", wallets: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Create wallet
     */
    createWallet: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const res = await walletService.createWallet(data);
            if (res.success) {
                const { wallets } = get();
                set({ wallets: [...wallets, res.data] });
                return { success: true, data: res.data };
            } else {
                set({ error: res.message || "Failed to create wallet" });
                return { success: false, message: res.message };
            }
        } catch (err) {
            set({ error: err.message || "Failed to create wallet" });
            return { success: false, message: err.message };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Update wallet
     */
    updateWallet: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const res = await walletService.updateWallet(id, data);
            if (res.success) {
                const { wallets } = get();
                set({ wallets: wallets.map(w => w.id === id ? res.data : w) });
                return { success: true, data: res.data };
            } else {
                set({ error: res.message || "Failed to update wallet" });
                return { success: false, message: res.message };
            }
        } catch (err) {
            set({ error: err.message || "Failed to update wallet" });
            return { success: false, message: err.message };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Delete wallet
     */
    deleteWallet: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await walletService.deleteWallet(id);
            if (res.success || res.status === 204) {
                const { wallets } = get();
                set({ wallets: wallets.filter(w => w.id !== id) });
                return { success: true };
            } else {
                set({ error: res.message || "Failed to delete wallet" });
                return { success: false, message: res.message };
            }
        } catch (err) {
            // Note: 204 No Content won't return a JSON body in axiios sometimes if not handled, 
            // but the status code indicates success.
            set({ error: err.message || "Failed to delete wallet" });
            return { success: false, message: err.message };
        } finally {
            set({ isLoading: false });
        }
    }
}));
