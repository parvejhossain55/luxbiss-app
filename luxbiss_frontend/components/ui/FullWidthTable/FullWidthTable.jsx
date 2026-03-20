"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Search, Download } from "lucide-react";

/**
 * Reusable Full Width Table Component
 * Features: Responsive design, Pill styles for status, customizable columns.
 */
export default function FullWidthTable({
    title,
    data = [],
    columns = [],
    showCheckbox = false,
    showSearch = false,
    onRowClick,
    pagination,
    onPageChange,
    onPerPageChange,
    headerBgClass = "bg-[#F9F9FB]",
    getRowBgClass,
    centerTitle = false,
    loading = false
}) {
    const { page = 1, per_page = 10, total = 0 } = pagination || {};
    const totalPages = total ? Math.ceil(total / per_page) : 1;
    const startIdx = total ? ((page - 1) * per_page) + 1 : 0;
    const endIdx = total ? Math.min(page * per_page, total) : 0;

    const getPageNumbers = () => {
        if (!totalPages) return [];
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        return pages;
    };

    return (
        <div className="w-full bg-white border border-[#E0E2E7] rounded-2xl overflow-hidden shadow-sm">
            {/* Table Header/Toolbar */}
            <div className={`p-4 md:p-6 flex flex-col md:flex-row md:items-center ${centerTitle ? 'justify-center' : 'justify-between'} gap-4 border-b border-[#E0E2E7]`}>
                {title && (
                    <h3 className={`text-lg font-bold text-[#1D1F2C] font-['Inter'] ${centerTitle ? 'text-center' : ''}`}>
                        {title}
                    </h3>
                )}
                <div className="flex flex-wrap items-center gap-3">
                    {showSearch && (
                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#858D9D]"
                            />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="h-10 pl-10 pr-4 rounded-xl border border-[#E0E2E7] bg-[#F9F9FB] text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all w-full sm:w-64"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className={`${headerBgClass} border-b border-[#E0E2E7]`}>
                            {showCheckbox && (
                                <th className="p-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-[#D0D5DD] accent-sky-500"
                                    />
                                </th>
                            )}
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className="p-4 text-xs font-semibold text-[#858D9D] uppercase tracking-wider"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0E2E7]">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (showCheckbox ? 1 : 0)}
                                    className="p-12 text-center"
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="h-8 w-8 rounded-full border-4 border-sky-500/20 border-t-sky-500 animate-spin" />
                                        <span className="text-slate-500 font-medium">Loading data...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length > 0 ? (
                            data.map((row, rowIdx) => {
                                const rowBgClass = getRowBgClass ? getRowBgClass(row) : "";
                                return (
                                    <tr
                                        key={rowIdx}
                                        onClick={() => onRowClick?.(row)}
                                        className={`${rowBgClass} hover:bg-slate-50/80 transition-colors cursor-pointer`}
                                    >
                                        {showCheckbox && (
                                            <td className="p-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-[#D0D5DD] accent-sky-500"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </td>
                                        )}
                                        {columns.map((col, colIdx) => (
                                            <td key={colIdx} className="p-4 text-sm text-[#1D1F2C]">
                                                <TableCell row={row} column={col} />
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length + (showCheckbox ? 1 : 0)}
                                    className="p-12 text-center text-slate-500 italic"
                                >
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E0E2E7] bg-[#F9F9FB]">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-[#858D9D]">
                        <div>
                            Showing <span className="font-semibold text-[#1D1F2C]">{startIdx}-{endIdx}</span> of{" "}
                            <span className="font-semibold text-[#1D1F2C]">{total}</span> entries
                        </div>
                        {onPerPageChange && (
                            <div className="flex items-center gap-2">
                                <span>Per page:</span>
                                <select
                                    value={per_page}
                                    onChange={(e) => onPerPageChange(Number(e.target.value))}
                                    className="border border-[#E0E2E7] rounded-lg px-2 py-1 outline-none text-[#1D1F2C] bg-white cursor-pointer hover:border-sky-500 transition-colors"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => onPageChange?.(page - 1)}
                            className="h-8 w-8 rounded-lg border border-[#E0E2E7] bg-white flex items-center justify-center text-[#667085] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
                            <ChevronLeft size={18} />
                        </button>
                        {getPageNumbers().map((p, i) => (
                            <button
                                key={i}
                                disabled={p === '...'}
                                onClick={() => p !== '...' && onPageChange?.(p)}
                                className={`h-8 w-8 rounded-lg text-sm font-semibold transition-colors ${p === page
                                    ? "bg-sky-500 text-white shadow-sm"
                                    : p === '...' ? "text-[#667085]" : "text-[#667085] hover:bg-slate-100 border border-transparent hover:border-[#E0E2E7]"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            disabled={page >= totalPages}
                            onClick={() => onPageChange?.(page + 1)}
                            className="h-8 w-8 rounded-lg border border-[#E0E2E7] bg-white flex items-center justify-center text-[#667085] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed translate-x-1">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function TableCell({ row, column }) {
    const value = row[column.key];

    if (column.render) {
        return column.render(value, row);
    }

    if (column.type === "pill" && column.getPillStyles) {
        const styles = column.getPillStyles(value);
        return (
            <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: styles.bg, color: styles.text }}
            >
                <span
                    className="w-1.5 h-1.5 rounded-full mr-1.5"
                    style={{ backgroundColor: styles.text }}
                />
                {value}
            </span>
        );
    }

    if (column.type === "code") {
        return <span className="font-mono font-medium text-sky-600">{value}</span>;
    }

    if (column.type === "number") {
        return <span className="font-semibold">{value}</span>;
    }

    return <span>{value}</span>;
}

