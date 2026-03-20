"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FullWidthTable from "@/components/ui/FullWidthTable/FullWidthTable";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "react-hot-toast";
import BeautifulConfirmModal from "@/components/ui/BeautifulConfirmModal";
import { formatTableDate } from "@/lib/utils";

/**
 * IgnoredUserManagement
 * Specialized view for managing users who have been ignored.
 */
const IgnoredUserManagement = () => {
    const router = useRouter();
    const { users, pagination: serverPagination, isLoading, fetchUsers, updateUser } = useUserStore();

    // We'll use the API's filtering capability to only get ignored users
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [confirmData, setConfirmData] = useState({ open: false, user: null });

    useEffect(() => {
        fetchUsers({ page, per_page: perPage, status: "ignored" });
    }, [page, perPage, fetchUsers]);

    const handleEdit = (user) => {
        router.push(`/admin/users/${user.id}`);
    };

    const handleRestore = (user) => {
        setConfirmData({ open: true, user });
    };

    const handleConfirmRestore = async () => {
        const { user } = confirmData;
        if (!user) return;

        try {
            const res = await updateUser(user.id, { status: "active" });
            if (res.success) {
                toast.success("User successfully restored!");
                fetchUsers({ page, per_page: perPage, status: "ignored" });
            } else {
                toast.error(res.message || "Failed to restore user");
            }
        } catch (err) {
            toast.error("Failed to restore user");
        }
    };

    const columns = [
        {
            header: "Name",
            key: "name",
            render: (val) => <span className="font-medium text-slate-700">{val}</span>,
        },
        {
            header: "Email",
            key: "email",
            render: (val) => <span className="text-slate-600">{val}</span>,
        },
        {
            header: "Balance",
            key: "balance",
            render: (val) => <span className="font-bold text-slate-700">${val?.toFixed(2)}</span>,
        },
        {
            header: "Ignored On",
            key: "updated_at",
            render: (val) => <span className="text-slate-600">{formatTableDate(val) || "-"}</span>,
        },
        {
            header: "User Status",
            key: "status",
            type: "pill",
            getPillStyles: () => ({ bg: "#F3F4F6", text: "#667085" }), // Greyed out for ignored
        },
        {
            header: "Actions",
            key: "actions",
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="px-4 py-1.5 bg-[#40C4E9] text-white text-xs font-semibold rounded-lg hover:bg-[#35b1d4] transition-colors shadow-sm"
                    >
                        View Profile
                    </button>
                    <button
                        onClick={() => handleRestore(row)}
                        className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
                    >
                        Restore
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#1a5b7d]">Ignored Users</h1>
            <p className="text-slate-500 font-medium">These users are excluded from the main dashboard statistics and activity.</p>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <FullWidthTable
                    data={users}
                    columns={columns}
                    isLoading={isLoading}
                    headerBgClass="bg-[#B0E3F2]"
                    pagination={{
                        page: page,
                        per_page: perPage,
                        total: serverPagination.total
                    }}
                    onPageChange={setPage}
                    onPerPageChange={(newPerPage) => {
                        setPerPage(newPerPage);
                        setPage(1);
                    }}
                />
            </div>

            <BeautifulConfirmModal
                isOpen={confirmData.open}
                onClose={() => setConfirmData({ open: false, user: null })}
                onConfirm={handleConfirmRestore}
                title="Restore User?"
                message={`Are you sure you want to restore ${confirmData.user?.email} to active status? They will reappear in main dashboard statistics.`}
                variant="success"
                confirmText="Restore Now"
            />
        </div>
    );
};

export default IgnoredUserManagement;
