import { create } from "zustand";
import { giftCardService } from "@/lib/giftcard";

/**
 * useGiftCardStore
 *
 * Manages state for the "Redeem Gift Card" modal (verify → apply flow).
 * Intentionally separate from useTransactionStore to keep concerns isolated.
 */
export const useGiftCardStore = create((set) => ({
    // State
    verifiedCard: null,     // the data object returned from /giftcards/verify
    isVerifying: false,     // loading state for the verify step
    isApplying: false,      // loading state for the apply step
    verifyError: null,      // error message from verify request
    applyError: null,       // error message from apply request

    /**
     * Step 1: Verify Gift Card
     * Fetches card details (balance, expiry) without consuming it.
     */
    verifyGiftCard: async (redeem_code) => {
        set({ isVerifying: true, verifyError: null, verifiedCard: null });
        try {
            const res = await giftCardService.verifyGiftCard(redeem_code);
            if (res.success) {
                set({ verifiedCard: res.data });
                return { success: true, data: res.data };
            }
            // API returned success: false
            const message = res.message || "Verification failed";
            set({ verifyError: message });
            return { success: false, message };
        } catch (err) {
            const message =
                err.response?.data?.message || err.message || "Verification failed";
            set({ verifyError: message });
            return { success: false, message };
        } finally {
            set({ isVerifying: false });
        }
    },

    /**
     * Step 2: Apply / Redeem Gift Card
     * Irreversible — marks the card as Used and credits the user's account.
     * Caller is responsible for re-fetching /transactions/summary on success.
     */
    applyGiftCard: async (redeem_code) => {
        set({ isApplying: true, applyError: null });
        try {
            const res = await giftCardService.applyGiftCard(redeem_code);
            if (res.success) {
                return { success: true, data: res.data };
            }
            const message = res.message || "Redemption failed";
            set({ applyError: message });
            return { success: false, message };
        } catch (err) {
            const message =
                err.response?.data?.message || err.message || "Redemption failed";
            set({ applyError: message });
            return { success: false, message };
        } finally {
            set({ isApplying: false });
        }
    },

    /** Reset all gift card state (called when modal closes) */
    reset: () =>
        set({
            verifiedCard: null,
            isVerifying: false,
            isApplying: false,
            verifyError: null,
            applyError: null,
        }),
}));
