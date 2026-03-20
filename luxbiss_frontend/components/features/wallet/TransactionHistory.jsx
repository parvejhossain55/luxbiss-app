import React from "react";
import FullWidthTable from "@/components/ui/FullWidthTable/FullWidthTable";
import { formatTableDate } from "@/lib/utils";

export default function TransactionHistory({ data, isLoading, pagination, showSearch = false, onPageChange, onPerPageChange }) {
    const columns = [
        {
            header: "Transaction ID",
            key: "tx_hash",
            type: "code",
            sortable: true,
            render: (val) => val ? `#${val}` : "-"
        },
        {
            header: "Date",
            key: "created_at",
            sortable: true,
            render: (val) => formatTableDate(val) || "-"
        },
        {
            header: "Amount",
            key: "amount",
            type: "number",
            sortable: true,
            render: (val) => `$${val?.toLocaleString()}`
        },
        {
            header: "Type",
            key: "type",
            sortable: true,
            render: (val) => {
                const lower = val?.toLowerCase();
                let colorClass = "text-slate-600";
                if (lower === "deposit" || lower === "giftcard") colorClass = "text-emerald-600";
                if (lower === "withdraw") colorClass = "text-rose-600";
                if (lower === "investment") colorClass = "text-sky-600";
                return <span className={`font-bold capitalize ${colorClass}`}>{val}</span>;
            }
        },
        {
            header: "Note",
            key: "note",
            sortable: false,
            render: (val) => {
                if (!val) return "-";
                if (val.includes("| Profit:")) {
                    const [desc, profit] = val.split("|");
                    return (
                        <div className="flex flex-col gap-0.5">
                            <span className="text-slate-700 font-medium">{desc.trim()}</span>
                            <span className="text-emerald-600 font-bold text-xs uppercase tracking-tight">
                                {profit.trim()}
                            </span>
                        </div>
                    );
                }
                return <span className="text-slate-600">{val}</span>;
            }
        },
        {
            header: "Status",
            key: "status",
            type: "pill",
            getPillStyles: (status) => {
                const lower = status?.toLowerCase();
                if (lower === "completed") return { bg: "#E7F4EE", text: "#0D894F" };
                if (lower === "processing") return { bg: "#FDF1E8", text: "#E46A11" };
                if (lower === "rejected") return { bg: "#FEE2E2", text: "#B91C1C" };
                if (lower === "cancelled") return { bg: "#F3F4F6", text: "#4B5563" };
                return { bg: "#F0F1F3", text: "#667085" };
            }
        },
    ];

    return (
        <section className="relative">
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-2xl">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1FB0D8]" />
                </div>
            )}
            <FullWidthTable
                title="Recent Transaction History"
                data={data || []}
                columns={columns}
                showCheckbox={false}
                showSearch={showSearch}
                pagination={pagination}
                onPageChange={onPageChange}
                onPerPageChange={onPerPageChange}
            />
        </section>
    );
}

import { Loader2 } from "lucide-react";
