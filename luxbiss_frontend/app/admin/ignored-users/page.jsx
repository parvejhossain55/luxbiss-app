"use client";

import React from "react";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout/AdminDashboardLayout";
import IgnoredUserManagement from "@/components/features/admin/IgnoredUserManagement";

/**
 * Admin Ignored Users Page
 */
export default function AdminIgnoredUsersPage() {
    return (
        <AdminDashboardLayout>
            <IgnoredUserManagement />
        </AdminDashboardLayout>
    );
}
