import { api } from "./api";

/**
 * Gift Card Service (/giftcards)
 * Handles verify and apply endpoints for users.
 * Admin-only endpoints (create, list, delete) are excluded from this service.
 */
export const giftCardService = {
    /**
     * 1. Verify Gift Card
     *    Checks if a code is valid and returns balance + expiry date.
     * @param {string} redeem_code - e.g., "ABCD-EFGH-IJKL-MNOP"
     */
    async verifyGiftCard(redeem_code) {
        const res = await api.post("/giftcards/verify", { redeem_code });
        return res.data;
    },

    /**
     * 2. Apply / Redeem Gift Card
     *    Marks the card as Used and credits the user's account.
     *    This action is irreversible.
     * @param {string} redeem_code - The verified gift card code
     */
    async applyGiftCard(redeem_code) {
        const res = await api.post("/giftcards/apply", { redeem_code });
        return res.data;
    },

    /**
     * 3. List Gift Cards (Admin Only)
     */
    async getGiftCards(params = {}) {
        const res = await api.get("/giftcards", { params });
        return res.data;
    },

    /**
     * 4. Create Gift Card (Admin Only)
     */
    async createGiftCard(cardData) {
        const res = await api.post("/giftcards", cardData);
        return res.data;
    },

    /**
     * 5. Delete Gift Card (Admin Only)
     */
    async deleteGiftCard(id) {
        const res = await api.delete(`/giftcards/${id}`);
        // Handle 204 No Content
        if (res.status === 204 || res.data === "") {
            return { success: true };
        }
        return res.data;
    }
};
