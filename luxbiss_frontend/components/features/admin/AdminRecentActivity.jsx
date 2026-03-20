import React from "react";
import FullWidthTable from "@/components/ui/FullWidthTable/FullWidthTable";
import { formatTableDate } from "@/lib/utils";

const AdminRecentActivity = ({ data, pagination, onPageChange, onPerPageChange, isLoading }) => {
    const columns = [
        {
            header: "Action",
            key: "action",
            render: (val) => {
                let colorClass = "text-slate-600";
                if (val === "Withdraw") colorClass = "text-rose-600";
                if (val === "Deposit") colorClass = "text-emerald-600";
                if (val === "Gift Card") colorClass = "text-emerald-600 font-semibold";
                if (val === "Registration") colorClass = "text-sky-500 font-semibold";
                if (val === "Investment") colorClass = "text-indigo-600 font-semibold";
                return <span className={`font-semibold ${colorClass}`}>{val}</span>;
            },
        },
        {
            header: "Amount",
            key: "amount",
            render: (val) => (val !== null && val !== undefined ? `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-"),
        },
        {
            header: "Invoice Number",
            key: "invoice",
            render: (val) => <span className="text-slate-600">{val}</span>,
        },
        {
            header: "Date",
            key: "date",
            render: (val) => <span className="text-slate-600">{formatTableDate(val) || val || "-"}</span>,
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
            header: "User Status",
            key: "userStatus",
            type: "pill",
            getPillStyles: (status) => {
                const s = status?.toLowerCase();
                if (s === "active") return { bg: "#E7F4EE", text: "#0D894F" };
                if (s === "hold") return { bg: "#FEF3C7", text: "#B45309" };
                if (s === "suspended") return { bg: "#FEE2E2", text: "#B91C1C" };
                if (s === "ignored") return { bg: "#F3F4F6", text: "#4B5563" };
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
            header: "Status",
            key: "status",
            type: "pill",
            getPillStyles: (status) => {
                const s = status?.toLowerCase();
                if (s === "pending") return { bg: "#FDF1E8", text: "#E46A11" };
                if (s === "failed") return { bg: "#FEE2E2", text: "#B91C1C" };
                if (s === "completed") return { bg: "#E7F4EE", text: "#0D894F" };
                if (s === "available") return { bg: "#E0F2FE", text: "#0369A1" };
                if (s === "used") return { bg: "#F1F5F9", text: "#475569" };
                return { bg: "#F3F4F6", text: "#4B5563" };
            },
        },
    ];

    const getRowBgClass = (row) => {
        // Subtle highlight for pending items
        if (row.status?.toLowerCase() === "pending") {
            return "bg-amber-50/30";
        }
        return "";
    };

    return (
        <div className="admin-recent-activity">
            <FullWidthTable
                title="Recent Activity"
                data={data}
                columns={columns}
                pagination={pagination}
                onPageChange={onPageChange}
                onPerPageChange={onPerPageChange}
                headerBgClass="bg-[#B0E3F2]"
                getRowBgClass={getRowBgClass}
                centerTitle={true}
                loading={isLoading}
            />
        </div>
    );
};

export default AdminRecentActivity;
