"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useAdminDashboardStore } from "@/store/useAdminDashboardStore";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout/AdminDashboardLayout";
import AdminStatCard from "@/components/features/admin/AdminStatCard";
import AdminRecentActivity from "@/components/features/admin/AdminRecentActivity";

/**
 * Admin Dashboard Home Page
 * Displays administrative overview and management tools.
 */
export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { stats, recentActivity, fetchStats, fetchRecentActivity, isLoading } = useAdminDashboardStore();
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  useEffect(() => {
    // If not admin, redirect to user dashboard
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchStats();
      fetchRecentActivity();
    }
  }, [user, fetchStats, fetchRecentActivity]);

  const formatTrend = (count = 0, amount = null) => {
    if (amount === null || amount === undefined) {
      return `+${count} Today`;
    }
    return `+${count} Today ($${Number(amount).toFixed(2)})`;
  };

  const dashboardStats = [
    {
      title: "User",
      value: stats?.users?.total ?? 0,
      trendText: formatTrend(stats?.users?.today_count ?? 0),
      onClick: () => router.push("/admin/users")
    },
    {
      title: "Ignored User",
      value: stats?.ignored_users?.total ?? 0,
      trendText: formatTrend(stats?.ignored_users?.today_count ?? 0),
      onClick: () => router.push("/admin/ignored-users")
    },
    {
      title: "Deposit",
      value: stats?.deposits?.total ?? 0,
      trendText: formatTrend(stats?.deposits?.today_count ?? 0, stats?.deposits?.today_amount ?? 0),
      onClick: () => router.push("/admin/transactions")
    },
    {
      title: "Withdraw",
      value: stats?.withdrawals?.total ?? 0,
      trendText: formatTrend(stats?.withdrawals?.today_count ?? 0, stats?.withdrawals?.today_amount ?? 0),
      onClick: () => router.push("/admin/transactions")
    },
    {
      title: "Gift Cards",
      value: stats?.gift_cards?.total ?? 0,
      trendText: formatTrend(stats?.gift_cards?.today_count ?? 0, stats?.gift_cards?.today_amount ?? 0),
      onClick: () => router.push("/admin/giftcards")
    },
  ];



  const paginatedActivity = recentActivity.slice((page - 1) * perPage, page * perPage);

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {dashboardStats.map((stat, idx) => (
            <AdminStatCard key={idx} {...stat} />
          ))}
        </div>

        {/* Recent Activity Table */}
        <AdminRecentActivity
          data={paginatedActivity}
          isLoading={isLoading}
          pagination={{
            page: page,
            per_page: perPage,
            total: recentActivity.length
          }}
          onPageChange={setPage}
          onPerPageChange={(newPerPage) => {
            setPerPage(newPerPage);
            setPage(1);
          }}
        />
      </div>
    </AdminDashboardLayout>
  );
}
