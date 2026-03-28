import { create } from 'zustand';

export const useModalStore = create((set) => ({
    isDepositModalOpen: false,
    depositMessage: "",
    isWithdrawModalOpen: false,
    openDepositModal: (message = "") => set({ isDepositModalOpen: true, depositMessage: message }),
    closeDepositModal: () => set({ isDepositModalOpen: false, depositMessage: "" }),
    openWithdrawModal: () => set({ isWithdrawModalOpen: true }),
    closeWithdrawModal: () => set({ isWithdrawModalOpen: false }),
}));
