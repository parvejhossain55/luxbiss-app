"use client";

import React from "react";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout/AdminDashboardLayout";
import TransactionManagement from "@/components/features/admin/TransactionManagement";

/**
 * Admin Transactions Page
 * Displays and manages all system transactions.
 */
export default function AdminTransactionsPage() {
    return (
        <AdminDashboardLayout>
            <TransactionManagement />
        </AdminDashboardLayout>
    );
}
