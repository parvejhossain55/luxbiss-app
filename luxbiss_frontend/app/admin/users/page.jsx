"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout/AdminDashboardLayout";
import UserManagement from "@/components/features/admin/UserManagement";

/**
 * Admin User Management Page
 * Allows administrators to manage all users.
 */
export default function AdminUsersPage() {
    const router = useRouter();
    const { user } = useAuthStore();

    useEffect(() => {
        // If not admin, redirect to user dashboard
        if (user && user.role !== "admin") {
            router.push("/dashboard");
        }
    }, [user, router]);

    return (
        <AdminDashboardLayout>
            <div className="py-2">
                <UserManagement />
            </div>
        </AdminDashboardLayout>
    );
}
