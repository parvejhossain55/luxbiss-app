"use client";

import React, { useState, useEffect } from "react";
import UserTopbar from "../UserNavbar/UserTopper";
import UserSidebar from "../UserSidebar/UserSidebar";
import FundDepositModal from "../../features/wallet/FundDepositModal";
import { useModalStore } from "@/store/useModalStore";
import { useTransactionStore } from "@/store/useTransactionStore";

export default function UserDashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDepositModalOpen, closeDepositModal, depositMessage } = useModalStore();
  const { summary } = useTransactionStore();

  // ✅ Prevent scrolling the page behind the sidebar on mobile
  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [sidebarOpen]);

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
    </div>
  );
}