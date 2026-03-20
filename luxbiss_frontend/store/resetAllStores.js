import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { useProductStore } from "@/store/useProductStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useGiftCardStore } from "@/store/useGiftCardStore";
import { useWalletStore } from "@/store/useWalletStore";

export function resetAllStores() {
    useAuthStore.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
    });
    useAuthStore.persist?.clearStorage?.();

    useUserStore.setState({
        users: [],
        currentUser: null,
        isLoading: false,
        error: null,
        pagination: { page: 1, per_page: 10, total: 0 },
    });

    useProductStore.setState({
        products: [],
        levels: [],
        steps: [],
        isLoading: false,
        error: null,
        pagination: { page: 1, per_page: 10, total: 0 },
        levelPagination: { page: 1, per_page: 15, total: 0 },
        stepPagination: { page: 1, per_page: 15, total: 0 },
    });

    useTransactionStore.setState({
        transactions: [],
        summary: {
            available_balance: 0,
            total_deposit: 0,
            total_withdrawal: 0,
            withdraw_report: [],
        },
        isLoading: false,
        error: null,
        pagination: { page: 1, per_page: 10, total: 0 },
    });

    useGiftCardStore.getState().reset();

    useWalletStore.setState({
        wallets: [],
        isLoading: false,
        error: null,
    });
}
