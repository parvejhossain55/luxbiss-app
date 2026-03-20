"use client";

import React, { useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import AdminSidebar from "../AdminSidebar/AdminSidebar";

/**
 * Layout for Admin Dashboard pages.
 * Centralizes AdminNavbar and AdminSidebar logic.
 */
export default function AdminDashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F9F9FC]">
            <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />

            <div className="flex">
                <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className="flex-1 min-w-0">
                    <div className="p-4 md:p-6">{children}</div>
                </main>
            </div>
        </div>
    );
}
