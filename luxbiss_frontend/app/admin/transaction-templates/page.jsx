"use client";

import React from "react";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout/AdminDashboardLayout";
import TransactionTemplateManagement from "@/components/features/admin/TransactionTemplateManagement";

export default function AdminTransactionTemplatesPage() {
    return (
        <AdminDashboardLayout>
            <TransactionTemplateManagement />
        </AdminDashboardLayout>
    );
}
