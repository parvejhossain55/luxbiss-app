"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import UserTopbar from "../UserNavbar/UserTopper";
import UserSidebar from "../UserSidebar/UserSidebar";
import FundDepositModal from "../../features/wallet/FundDepositModal";
import FundWithdrawModal from "../../features/wallet/FundWithdrawModal";
import { useModalStore } from "@/store/useModalStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function UserDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDepositModalOpen, closeDepositModal, depositMessage, isWithdrawModalOpen, closeWithdrawModal } = useModalStore();
  const { summary } = useTransactionStore();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  // ✅ Prevent scrolling the page behind the sidebar on mobile
  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [sidebarOpen]);

  useEffect(() => {
    if (isLoading) return;

    if (user?.role === "admin") {
      router.replace("/admin/dashboard");
      return;
    }

    if (!isAuthenticated && !user) {
      const redirectPath = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/login?redirect=${redirectPath}`);
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);

  if (isLoading || (!isAuthenticated && !user) || user?.role === "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 rounded-full border-4 border-sky-200 border-t-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="md:flex">
        <UserSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 bg-[#F9F9FC] min-h-screen">
          <UserTopbar onMenuClick={() => setSidebarOpen(true)} />

          <div className="p-4 space-y-6">{children}</div>
        </main>
      </div>
      <FundDepositModal
        isOpen={isDepositModalOpen}
        onClose={closeDepositModal}
        message={depositMessage}
        summary={summary}
      />
      <FundWithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={closeWithdrawModal}
        availableBalance={user?.withdrawable_balance || 0}
      />
    </div>
  );
}
