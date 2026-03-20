"use client";
import React, { useEffect } from "react";

import UserDashboardLayout from "@/components/layout/UserDashboardLayout/UserDashboardLayout";
import WalletManagementSummary from "@/components/features/wallet/WalletManagementSummary";
import TransactionHistory from "@/components/features/wallet/TransactionHistory";
import { useTransactionStore } from "@/store/useTransactionStore";

/**
 * Wallet Page
 * Displays wallet summary and transaction history.
 */
export default function WalletPage() {
  const { transactions, summary, pagination, fetchTransactions, fetchSummary, isLoading } = useTransactionStore();

  useEffect(() => {
    fetchTransactions({ per_page: 10 });
    fetchSummary();
  }, [fetchTransactions, fetchSummary]);

  return (
    <UserDashboardLayout>
      <WalletManagementSummary summary={summary} isLoading={isLoading} />
      <TransactionHistory
        data={transactions}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={(page) => fetchTransactions({ page, per_page: pagination?.per_page || 10 })}
        onPerPageChange={(per_page) => fetchTransactions({ page: 1, per_page })}
      />
    </UserDashboardLayout>
  );
}