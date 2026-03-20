"use client";

import React, { useState, useEffect } from "react";
import FullWidthTable from "@/components/ui/FullWidthTable/FullWidthTable";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { giftCardService } from "@/lib/giftcard";
import { formatTableDate } from "@/lib/utils";

/**
 * Gift Card Management Component
 * Matches the requested screenshot layout and functionality.
 */
const GiftCardManagement = () => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [newCode, setNewCode] = useState("");
    const [newAmount, setNewAmount] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const [giftCards, setGiftCards] = useState([]);
    const [pagination, setPagination] = useState({ total: 0 });

    const fetchGiftCards = async () => {
        setIsLoading(true);
        try {
            const res = await giftCardService.getGiftCards({ page, per_page: perPage });
            if (res.success) {
                setGiftCards(res.data);
                if (res.pagination) setPagination(res.pagination);
            }
        } catch (error) {
            toast.error("Failed to fetch gift cards");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGiftCards();
    }, [page, perPage]);

    const handleGenerate = async () => {
        if (!newAmount) {
            toast.error("Please enter an amount");
            return;
        }

        setIsGenerating(true);
        try {
            // Convert date to ISO format if provided
            let expiredAt = undefined;
            if (expiryDate) {
                // Set expiration to 23:59:59 in Bangladesh Time (+06:00)
                expiredAt = new Date(`${expiryDate}T23:59:59+06:00`).toISOString();
            }

            const res = await giftCardService.createGiftCard({
                redeem_code: newCode || undefined,
                amount: Number(newAmount),
                expired_at: expiredAt
            });

            if (res.success) {
                toast.success("Gift card generated successfully!");
                setNewCode("");
                setNewAmount("");
                setExpiryDate("");
                fetchGiftCards();
            } else {
                toast.error(res.message || "Failed to generate gift card");
            }
        } catch (error) {
            toast.error("An error occurred during generation");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await giftCardService.deleteGiftCard(id);
            if (res.success) {
                toast.success("Gift card deleted!");
                fetchGiftCards();
            } else {
                toast.error(res.message || "Failed to delete gift card");
            }
        } catch (error) {
            toast.error("An error occurred during deletion");
        }
    };

    const columns = [
        {
            header: "Redeem Code",
            key: "redeem_code",
            render: (val) => (
                <span
                    className="font-medium text-slate-700 cursor-pointer hover:text-[#1a97bd] transition-colors active:scale-95 inline-block"
                    onClick={() => {
                        if (val) {
                            navigator.clipboard.writeText(val);
                            toast.success("Code copied!");
                        }
                    }}
                    title="Click to copy"
                >
                    {val}
                </span>
            )
        },
        {
            header: "Amount",
            key: "amount",
            render: (val) => <span className="text-slate-700 font-medium">${Number(val).toFixed(2)}</span>
        },
        {
            header: "Expiration",
            key: "expired_at",
            render: (val) => {
                if (!val) return <span className="text-slate-400 text-xs italic">No Expiry</span>;
                const isExpired = new Date(val) < new Date();
                return (
                    <div className="flex flex-col gap-0.5">
                        <span className={`text-sm font-semibold ${isExpired ? "text-rose-600" : "text-slate-700"}`}>
                            {formatTableDate(val)}
                        </span>
                        {isExpired && (
                            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-tight">
                                Expired
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            header: "Card Status",
            key: "status",
            type: "pill",
            getPillStyles: (status) => {
                const s = status?.toLowerCase();
                if (s === "available") return {
                    bg: "#E7F4EE",
                    text: "#0D894F",
                    render: (t) => (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#0D894F]/20">
                            <span className="w-2 h-2 rounded-full bg-[#0D894F]" />
                            {t}
                        </span>
                    )
                };
                return {
                    bg: "#F3F4F6",
                    text: "#667085",
                    render: (t) => (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-slate-200">
                            <span className="w-2 h-2 rounded-full bg-slate-400" />
                            {t}
                        </span>
                    )
                };
            }
        },
        {
            header: "User Email",
            key: "user_email",
            render: (val) => <span className="text-slate-600 text-sm">{val || "-"}</span>
        },
        {
            header: "Use Date",
            key: "used_at",
            render: (val) => <span className="text-slate-600 text-sm">{formatTableDate(val) || ""}</span>
        },
        {
            header: "Delete",
            key: "id",
            render: (val) => (
                <button
                    onClick={() => handleDelete(val)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                >
                    <Trash2 size={18} />
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#1a5b7d]">Gift Cards</h1>

            {/* Top Generator Bar */}
            <div className="flex items-center gap-4">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 font-bold">$</span>
                    <input
                        type="number"
                        placeholder="Enter Amount"
                        className="w-40 h-11 pl-7 pr-4 rounded-lg border border-slate-300 bg-white outline-none focus:border-sky-500 transition-all text-sm placeholder:text-slate-300"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <input
                        type="date"
                        className="h-11 px-4 rounded-lg border border-slate-300 bg-white outline-none focus:border-sky-500 transition-all text-sm text-slate-600 font-medium"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="h-11 px-6 bg-[#1a97bd] text-white font-bold rounded-lg hover:bg-[#157a99] transition-all text-sm disabled:opacity-50 flex items-center gap-2"
                >
                    {isGenerating && <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    Generate Giftcard
                </button>
            </div>

            <div className="bg-white rounded-lg overflow-hidden border border-slate-200">
                <FullWidthTable
                    data={giftCards}
                    columns={columns}
                    headerBgClass="bg-[#B0E3F2]"
                    loading={isLoading}
                    pagination={{
                        page,
                        per_page: perPage,
                        total: pagination.total || giftCards.length
                    }}
                    onPageChange={setPage}
                    onPerPageChange={(n) => { setPerPage(n); setPage(1); }}
                    hideSearch={true}
                />
            </div>
        </div>
    );
};

export default GiftCardManagement;
