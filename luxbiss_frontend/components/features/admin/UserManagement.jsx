"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FullWidthTable from "@/components/ui/FullWidthTable/FullWidthTable";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "react-hot-toast";
import BeautifulConfirmModal from "@/components/ui/BeautifulConfirmModal";
import { formatTableDate } from "@/lib/utils";

const UserManagement = () => {
    const router = useRouter();
    const { users, pagination: serverPagination, isLoading, fetchUsers, updateUser, deleteUser } = useUserStore();
    const [activeTab, setActiveTab] = useState("All User");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [confirmData, setConfirmData] = useState({ open: false, user: null, type: "ignore" });
    const [deleteData, setDeleteData] = useState({ open: false, user: null });

    useEffect(() => {
        const fetchParams = { page, per_page: perPage };
        if (activeTab === "Active") fetchParams.status = "active";
        if (activeTab === "Ignored") fetchParams.status = "ignored";
        if (activeTab === "Suspended") fetchParams.status = "suspend";
        if (activeTab === "Hold") fetchParams.status = "hold";

        fetchUsers(fetchParams);
    }, [page, perPage, activeTab, fetchUsers]);

    // Format and secondary local filtering (in case API returns more than expected, or for 'All User')
    const formattedUsers = users.map(u => ({
        ...u,
        regDate: formatTableDate(u.created_at) || "-",
        status: u.status ? u.status.charAt(0).toUpperCase() + u.status.slice(1) : "Unknown"
    }));

    const filteredUsers = formattedUsers; // Trusting API filter, but 'All User' handles all non-ignored typically

    const tabs = ["All User", "Active", "Ignored", "Suspended", "Hold"];

    const handleEdit = (user) => {
        router.push(`/admin/users/${user.id}/`);
    };

    const columns = [
        {
            header: "Name",
            key: "name",
            render: (val) => <span className="font-medium text-slate-700">{val}</span>,
        },
        {
            header: "Country",
            key: "country",
            render: (val) => <span className="text-slate-600">{val}</span>,
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
            header: "Hold Balance",
            key: "hold_balance",
            render: (val) => <span className="font-bold text-amber-600">${val?.toFixed(2)}</span>,
        },
        {
            header: "Withdrawable",
            key: "withdrawable_balance",
            render: (val) => <span className="font-bold text-sky-600">${val?.toFixed(2)}</span>,
        },
        {
            header: "Reg Date",
            key: "regDate",
            render: (val) => <span className="text-slate-600 font-medium">{val}</span>,
        },
        {
            header: "User Status",
            key: "status",
            type: "pill",
            getPillStyles: (status) => {
                const s = status?.toLowerCase();
                if (s === "active") return { bg: "#E7F4EE", text: "#0D894F" };
                if (s === "hold") return { bg: "#FEF3C7", text: "#B45309" };
                if (s === "suspend") return { bg: "#FFF1F2", text: "#FB7185" }; // Pinkish red
                if (s === "ignored") return { bg: "#F3F4F6", text: "#667085" };
                return { bg: "#F3F4F6", text: "#4B5563" };
            },
        },
        {
            header: "Edit",
            key: "edit",
            render: (val, row) => {
                const isIgnored = row.status?.toLowerCase() === "ignored";
                return (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(row);
                            }}
                            className="px-4 py-1.5 bg-[#40C4E9] text-white text-xs font-semibold rounded-lg hover:bg-[#35b1d4] transition-colors shadow-sm"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                setConfirmData({ open: true, user: row, type: "ignore" });
                            }}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors shadow-sm border ${isIgnored
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                                }`}
                        >
                            {isIgnored ? "Restore" : "Ignore"}
                        </button>
                        <button
                            onClick={() => {
                                setDeleteData({ open: true, user: row });
                            }}
                            className="px-4 py-1.5 text-xs font-bold rounded-lg transition-colors shadow-sm border bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                        >
                            Delete
                        </button>
                    </div>
                );
            },
        },
    ];

    const handleConfirmAction = async () => {
        const { user: row } = confirmData;
        if (!row) return;

        const isIgnored = row.status?.toLowerCase() === "ignored";
        const newStatus = isIgnored ? "active" : "ignored";

        try {
            const res = await updateUser(row.id, { status: newStatus });
            if (res.success) {
                toast.success(`User successfully ${isIgnored ? 'restored' : 'ignored'}!`);
                fetchUsers({ page, per_page: perPage });
            } else {
                toast.error(res.message || "Operation failed");
            }
        } catch (err) {
            toast.error("An error occurred");
        }
    };

    const handleDeleteAction = async () => {
        const { user: row } = deleteData;
        if (!row) return;

        try {
            const res = await deleteUser(row.id);
            if (res.success) {
                toast.success("User deleted successfully!");
                fetchUsers({ page, per_page: perPage });
            } else {
                toast.error(res.message || "Delete failed");
            }
        } catch (err) {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#1a5b7d]">All User</h1>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-slate-200">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            setPage(1); // Reset to first page on tab change
                        }}
                        className={`pb-3 text-lg font-semibold transition-all relative ${activeTab === tab
                            ? "text-slate-900 border-b-2 border-slate-900"
                            : "text-slate-500 hover:text-slate-700 font-medium"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <FullWidthTable
                    data={filteredUsers}
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
                        setPage(1); // Reset to first page when per page changes
                    }}
                />
            </div>

            <BeautifulConfirmModal
                isOpen={confirmData.open}
                onClose={() => setConfirmData({ open: false, user: null, type: "ignore" })}
                onConfirm={handleConfirmAction}
                title={confirmData.user?.status?.toLowerCase() === "ignored" ? "Restore User?" : "Ignore User?"}
                message={confirmData.user?.status?.toLowerCase() === "ignored"
                    ? `Are you sure you want to restore ${confirmData.user?.email} to active status?`
                    : `Are you sure you want to ignore user ${confirmData.user?.email}? It will exclude them from main dashboard stats.`
                }
                variant={confirmData.user?.status?.toLowerCase() === "ignored" ? "success" : "warning"}
                confirmText={confirmData.user?.status?.toLowerCase() === "ignored" ? "Restore Now" : "Yes, Ignore"}
            />

            <BeautifulConfirmModal
                isOpen={deleteData.open}
                onClose={() => setDeleteData({ open: false, user: null })}
                onConfirm={handleDeleteAction}
                title="Delete User?"
                message={`Are you sure you want to permanently delete user ${deleteData.user?.email}? This action cannot be undone.`}
                variant="danger"
                confirmText="Yes, Delete"
            />
        </div>
    );
};

export default UserManagement;
