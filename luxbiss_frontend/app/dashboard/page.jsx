"use client";
import React, { useEffect } from "react";

import UserDashboardLayout from "@/components/layout/UserDashboardLayout/UserDashboardLayout";
import BalanceAndWithdraw from "@/components/features/dashboard/BalanceAndWithdraw";
import TransactionHistory from "@/components/features/dashboard/TransactionHistory";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function LuxbissDashboard() {
  const router = useRouter();
  const { transactions, summary, pagination, fetchTransactions, fetchSummary, isLoading } = useTransactionStore();
  const { user } = useAuthStore();

  console.log('user balcnece', user?.balance)

  useEffect(() => {
    if (user?.role === "admin") {
      router.push("/admin/dashboard");
      return;
    }
    fetchTransactions({ per_page: 10 });
    fetchSummary(7);
  }, [fetchTransactions, fetchSummary, user, router]);

  return (
    <UserDashboardLayout>
      <div className="p-4 space-y-6">
        <BalanceAndWithdraw summary={summary} user={user} isLoading={isLoading} />
        <TransactionHistory
          data={transactions}
          isLoading={isLoading}
          pagination={pagination}
          showSearch={false}
          onPageChange={(page) => fetchTransactions({ page, per_page: pagination?.per_page || 10 })}
          onPerPageChange={(per_page) => fetchTransactions({ page: 1, per_page })}
        />
      </div>
    </UserDashboardLayout>

  );
}