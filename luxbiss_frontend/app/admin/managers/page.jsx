"use client";

import React from "react";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout/AdminDashboardLayout";
import ManagerManagement from "@/components/features/admin/ManagerManagement";

/**
 * Admin Managers Page
 * For managing the platform's administrative staff and their roles.
 */
export default function AdminManagersPage() {
    return (
        <AdminDashboardLayout>
            <ManagerManagement />
        </AdminDashboardLayout>
    );
}
