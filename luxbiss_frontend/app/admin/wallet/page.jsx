"use client";

import React from "react";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout/AdminDashboardLayout";
import WalletManagement from "@/components/features/admin/WalletManagement";

/**
 * Admin Wallet Page
 * For managing the system's payment wallets.
 */
export default function AdminWalletPage() {
    return (
        <AdminDashboardLayout>
            <WalletManagement />
        </AdminDashboardLayout>
    );
}
