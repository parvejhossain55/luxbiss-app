"use client";

import React from "react";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout/AdminDashboardLayout";
import GiftCardManagement from "@/components/features/admin/GiftCardManagement";

/**
 * Admin Gift Cards Page
 * For generating and managing system gift vouchers.
 */
export default function AdminGiftCardsPage() {
    return (
        <AdminDashboardLayout>
            <GiftCardManagement />
        </AdminDashboardLayout>
    );
}
