"use client";

import React, { useState, useEffect } from "react";
import FullWidthTable from "@/components/ui/FullWidthTable/FullWidthTable";
import { toast } from "react-hot-toast";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useUserStore } from "@/store/useUserStore";
import { formatTableDate } from "@/lib/utils";

const TransactionManagement = () => {
    const { transactions, fetchTransactions, updateTransaction, isLoading, pagination: txPagination } = useTransactionStore();
    const { users, fetchUsers } = useUserStore();

    const [activeTab, setActiveTab] = useState("All");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    useEffect(() => {
        // Fetch all users once so we can map user_id to email/country
        fetchUsers({ per_page: 500 });
    }, [fetchUsers]);

    useEffect(() => {
        // Translate tab to backend status
        let targetStatus = undefined;
        if (activeTab === "Pending") targetStatus = "processing";
        else if (activeTab === "Completed") targetStatus = "completed";
        else if (activeTab === "Failed") targetStatus = "rejected"; // or cancelled

        fetchTransactions({
            page,
            per_page: perPage,
            status: targetStatus
        });
    }, [page, perPage, activeTab, fetchTransactions]);

    // Translate backend status to UI status
    const formatStatus = (s) => {
        if (s === "processing") return "Pending";
        if (s === "rejected" || s === "cancelled") return "Failed";
        if (s === "completed") return "Completed";
        return s;
    };

    const formattedTransactions = transactions.map(t => {
        const user = users.find(u => u.id === t.user_id) || {};
        return {
            id: t.id,
            action: t.type === 'withdraw' ? "Withdraw" : t.type === 'investment' ? "Investment" : "Deposit",
            amount: t.amount,
            invoice: t.tx_hash || t.id.split('-')[0] || "N/A",
            date: formatTableDate(t.created_at) || "-",
            userStatus: user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : "Unknown",
            email: user.email || t.user_id,
            country: user.country || "Unknown",
            status: formatStatus(t.status),
            rawStatus: t.status,
            note: t.note
        };
    });

    const handleStatusUpdate = async (id, newStatus) => {
        const backendStatus = newStatus === "Completed" ? "completed" : "rejected";
        const res = await updateTransaction(id, { status: backendStatus });
        if (res.success) {
            toast.success(`Transaction ${newStatus.toLowerCase()} successfully!`);
        } else {
            toast.error(res.message || "Failed to update transaction.");
        }
    };

    const columns = [
        {
            header: "Action",
            key: "action",
            render: (val) => {
                let colorClass = "text-slate-600";
                if (val === "Withdraw") colorClass = "text-rose-600";
                if (val === "Deposit") colorClass = "text-emerald-600";
                if (val === "Investment") colorClass = "text-sky-600";
                if (val === "Gift Card") colorClass = "text-sky-500";
                return <span className={`font-semibold ${colorClass}`}>{val}</span>;
            },
        },
        {
            header: "Amount",
            key: "amount",
            render: (val) => <span className="font-bold text-slate-700">${Number(val).toFixed(2)}</span>,
        },
        {
            header: "Invoice Number",
            key: "invoice",
            render: (val) => <span className="text-slate-500 font-mono text-xs">{val}</span>,
        },
        {
            header: "Date",
            key: "date",
            render: (val) => <span className="text-slate-500 text-sm font-medium">{val}</span>,
        },
        {
            header: "User Status",
            key: "userStatus",
            type: "pill",
            getPillStyles: (status) => {
                const s = status?.toLowerCase();
                if (s === "active") return { bg: "#E7F4EE", text: "#0D894F" };
                if (s === "hold") return { bg: "#FEF3C7", text: "#B45309" };
                if (s === "suspend") return { bg: "#FFF1F2", text: "#FB7185" };
                if (s === "ignored") return { bg: "#F3F4F6", text: "#667085" };
                return { bg: "#F3F4F6", text: "#4B5563" };
            },
        },
        {
            header: "Email",
            key: "email",
            render: (val) => <span className="text-slate-600">{val}</span>,
        },
        {
            header: "Country",
            key: "country",
            render: (val) => <span className="text-slate-600">{val}</span>,
        },
        {
            header: "Note",
            key: "note",
            render: (val) => {
                if (!val) return "-";
                if (val.includes("| Profit:")) {
                    const [desc, profit] = val.split("|");
                    return (
                        <div className="flex flex-col gap-0.5 min-w-[150px]">
                            <span className="text-slate-700 font-medium text-xs">{desc.trim()}</span>
                            <span className="text-emerald-600 font-bold text-[10px] uppercase tracking-tight">
                                {profit.trim()}
                            </span>
                        </div>
                    );
                }
                return <span className="text-slate-600 text-xs">{val}</span>;
            }
        },
        {
            header: "Status",
            key: "status",
            type: "pill",
            getPillStyles: (status) => {
                const s = status?.toLowerCase();
                if (s === "pending") return { bg: "#FFF7ED", text: "#D97706" }; // Amber/Orange
                if (s === "completed") return { bg: "#E7F4EE", text: "#0D894F" }; // Green
                if (s === "failed") return { bg: "#FEE2E2", text: "#B91C1C" }; // Red
                return { bg: "#F3F4F6", text: "#4B5563" };
            },
        },
        {
            header: "Action",
            key: "edit",
            render: (val, row) => (
                <div className="flex gap-2">
                    {row.status === "Pending" ? (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(row.id, "Completed");
                                }}
                                className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
                            >
                                Approve
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(row.id, "Failed");
                                }}
                                className="px-3 py-1 bg-rose-500 text-white text-[10px] font-bold rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
                            >
                                Fail
                            </button>
                        </>
                    ) : (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Processed</span>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#1a5b7d]">Transaction Management</h1>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-slate-200">
                {["All", "Pending", "Completed", "Failed"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            setPage(1);
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
                    data={formattedTransactions}
                    columns={columns}
                    isLoading={isLoading}
                    headerBgClass="bg-[#B0E3F2]"
                    pagination={{
                        page: page,
                        per_page: perPage,
                        total: txPagination?.total || formattedTransactions.length
                    }}
                    onPageChange={setPage}
                    onPerPageChange={(newPerPage) => {
                        setPerPage(newPerPage);
                        setPage(1);
                    }}
                    getRowBgClass={(row) => row.status === "Pending" ? "bg-orange-50/30" : ""}
                />
            </div>
        </div>
    );
};

export default TransactionManagement;
