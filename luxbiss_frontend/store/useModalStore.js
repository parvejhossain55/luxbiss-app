import { create } from 'zustand';

export const useModalStore = create((set) => ({
    isDepositModalOpen: false,
    depositMessage: "",
    openDepositModal: (message = "") => set({ isDepositModalOpen: true, depositMessage: message }),
    closeDepositModal: () => set({ isDepositModalOpen: false, depositMessage: "" }),
}));
