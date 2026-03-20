"use client";

import React, { useState } from "react";
import { X, DollarSign, FileText, Send, CheckCircle, Clock, Calendar } from "lucide-react";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useWalletStore } from "@/store/useWalletStore";
import { useAdminDashboardStore } from "@/store/useAdminDashboardStore";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

/**
 * GenerateTransactionModal
 * Allows admin to manually create a transaction for a user.
 */
export default function GenerateTransactionModal({ isOpen, onClose, userId, userEmail, userStatus, onSuccess }) {
    const { createTransaction } = useTransactionStore();
    const { wallets, fetchWallets } = useWalletStore();
    const { fetchStats } = useAdminDashboardStore();
    // Helper to get local datetime string for input
    const getLocalDatetime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: "deposit",
        amount: "",
        tx_hash: "",
        status: "completed",
        payment_method: "",
        created_at: getLocalDatetime()
    });

    useEffect(() => {
        if (isOpen) {
            fetchWallets();
            // Reset to current time whenever modal opens
            setFormData(prev => ({
                ...prev,
                created_at: getLocalDatetime()
            }));
        }
    }, [isOpen, fetchWallets]);

    // Set default payment method whenever wallets are loaded AND modal is open
    useEffect(() => {
        if (isOpen && wallets.length > 0) {
            setFormData(prev => {
                // If current method is empty or not in the latest wallets list, pick the first one
                const currentExists = wallets.some(w => `${w.coin_name} (${w.network})` === prev.payment_method);
                if (!prev.payment_method || !currentExists) {
                    return {
                        ...prev,
                        payment_method: `${wallets[0].coin_name} (${wallets[0].network})`
                    };
                }
                return prev;
            });
        }
    }, [wallets, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            return toast.error("Please enter a valid amount");
        }

        setIsLoading(true);
        try {
            let finalNote = "";
            let finalTxHash = formData.tx_hash;

            if (formData.type === "giftcard") {
                // Auto-generate gift card code: XXXX-XXXX-XXXX-XXXX
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                const generatePart = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
                const autoCode = `${generatePart()}-${generatePart()}-${generatePart()}-${generatePart()}`;

                finalTxHash = autoCode;
                finalNote = `Gift card redeemed: ${autoCode}`;
            } else if (formData.payment_method) {
                const prefix = formData.type === "withdraw" ? "Withdrawal via" : "Deposit via";
                finalNote = `${prefix} ${formData.payment_method}`;
            }

            const payload = {
                user_id: userId,
                type: formData.type,
                amount: parseFloat(formData.amount),
                status: formData.type === "giftcard" ? "completed" : formData.status,
                note: finalNote,
                tx_hash: finalTxHash,
                created_at: formData.created_at ? new Date(formData.created_at).toISOString() : undefined
            };

            const res = await createTransaction(payload);

            if (res.success) {
                toast.success("Transaction generated successfully!");
                fetchStats(); // Update dashboard stats in real-time
                if (onSuccess) onSuccess();
                onClose();
            } else {
                toast.error(res.message || "Failed to generate transaction");
            }
        } catch (err) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-[#B0E3F2] p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-[#1a5b7d]">Generate Transaction</h2>
                        <p className="text-[#1a5b7d]/70 text-sm font-medium">For: {userEmail}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/50 text-[#1a5b7d] hover:bg-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                    {/* Type Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Transaction Type</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: "deposit" })}
                                className={`flex flex-col items-center justify-center gap-1 py-3 rounded-2xl font-bold border transition-all ${formData.type === "deposit"
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-600 ring-2 ring-emerald-500/20"
                                    : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200"
                                    }`}
                            >
                                <CheckCircle size={18} />
                                <span className="text-xs">Deposit</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: "withdraw" })}
                                className={`flex flex-col items-center justify-center gap-1 py-3 rounded-2xl font-bold border transition-all ${formData.type === "withdraw"
                                    ? "bg-rose-50 border-rose-200 text-rose-600 ring-2 ring-rose-500/20"
                                    : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200"
                                    }`}
                            >
                                <Clock size={18} />
                                <span className="text-xs">Withdraw</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: "giftcard" })}
                                className={`flex flex-col items-center justify-center gap-1 py-3 rounded-2xl font-bold border transition-all ${formData.type === "giftcard"
                                    ? "bg-sky-50 border-sky-200 text-sky-600 ring-2 ring-sky-500/20"
                                    : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200"
                                    }`}
                            >
                                <DollarSign size={18} />
                                <span className="text-xs">Redeem GC</span>
                            </button>
                        </div>
                    </div>

                    {/* Created Date (Optional, primarily for backdating) */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                            Transaction Date (Optional)
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Calendar size={18} />
                            </div>
                            <input
                                type="datetime-local"
                                value={formData.created_at}
                                onChange={(e) => setFormData({ ...formData, created_at: e.target.value })}
                                className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-sky-500 outline-none font-bold text-slate-700 transition-all"
                            />
                        </div>
                    </div>

                    {/* Payment Method - Hide for Gift Card */}
                    {formData.type !== "giftcard" && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Payment Method (Platform Wallet)</label>
                            <select
                                value={formData.payment_method}
                                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-sky-500 outline-none font-bold text-slate-700 transition-all appearance-none"
                            >
                                {wallets.length === 0 ? (
                                    <option value="">No Wallets Configured</option>
                                ) : (
                                    wallets.map(w => (
                                        <option key={w.id} value={`${w.coin_name} (${w.network})`}>
                                            {w.coin_name} ({w.network})
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    )}

                    {/* Amount */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Amount ($)</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                <DollarSign size={18} />
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                                className="w-full h-12 pl-16 pr-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all outline-none font-bold text-slate-800"
                            />
                        </div>
                    </div>


                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-sky-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20 hover:bg-sky-600 transition-all active:scale-[0.98] disabled:opacity-70"
                    >
                        {isLoading ? (
                            <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send size={20} />
                                Generate Transaction
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
