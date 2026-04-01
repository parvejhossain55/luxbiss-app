"use client";
import React, { useState, useEffect, useCallback } from "react";
import { X, CreditCard, Loader2, CheckCircle2, Gift, Calendar } from "lucide-react";
import { useGiftCardStore } from "@/store/useGiftCardStore";
import { useTransactionStore } from "@/store/useTransactionStore";

import { useAuthStore } from "@/store/useAuthStore";
import { formatTableDate } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Utility helpers (matches the API guide spec)
───────────────────────────────────────────── */

/** Auto-format input to XXXX-XXXX-XXXX-XXXX as the user types */
const formatCode = (val) =>
    val
        .replace(/[^A-Z0-9]/gi, "")
        .toUpperCase()
        .match(/.{1,4}/g)
        ?.join("-") ?? "";



/** Format amount → "$150.00" */
const formatAmount = (amount) =>
    amount != null ? `$${Number(amount).toFixed(2)}` : "$0.00";

/* ─────────────────────────────────────────────
   Simple in-modal toast component
───────────────────────────────────────────── */
function InlineToast({ message, type = "success" }) {
    if (!message) return null;
    const styles =
        type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-red-50 border-red-200 text-red-600";
    return (
        <div
            className={`p-3 border rounded-lg text-[13px] leading-snug animate-in fade-in slide-in-from-top-1 duration-200 ${styles}`}
        >
            {message}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Main Modal Component
───────────────────────────────────────────── */
export default function RedeemGiftCardModal({ isOpen, onClose }) {
    const {
        verifiedCard,
        isVerifying,
        isApplying,
        verifyError,
        applyError,
        verifyGiftCard,
        applyGiftCard,
        reset,
    } = useGiftCardStore();

    const { fetchSummary, fetchTransactions } = useTransactionStore();
    const { fetchMe } = useAuthStore();

    const [giftCard, setGiftCard] = useState({ code: "", amount: 0, expired_at: "" });
    const [successMessage, setSuccessMessage] = useState("");

    /* ── Re-verify whenever the code reaches full length (16 chars raw) ── */
    const rawLength = giftCard.code.replace(/-/g, "").length;
    const isFullCode = rawLength === 16;

    const handleCodeChange = useCallback(
        async (e) => {
            const formatted = formatCode(e.target.value);
            setGiftCard(prev => ({ ...prev, code: formatted }));
            // Clear previous verified state whenever user edits the code
            if (verifiedCard || verifyError) {
                reset();
                setSuccessMessage("");
            }

            if (formatted.replace(/-/g, "").length === 16 && !isVerifying) {
                setSuccessMessage("");
                await verifyGiftCard(formatted);
            }
        },
        [isVerifying, reset, verifiedCard, verifyError, verifyGiftCard]
    );

    const handleRedeem = useCallback(async () => {
        if (!verifiedCard || isApplying) return;
        const res = await applyGiftCard(giftCard.code);
        if (res.success) {
            const amount = formatAmount(res.data?.amount);
            setSuccessMessage(`Redemption request of ${amount} submitted! Pending admin approval.`);
            // Refresh real-time data: wallet balance, summary and transactions
            Promise.all([fetchSummary(), fetchMe(), fetchTransactions({ per_page: 10 })]);
            // Close modal after short delay so user reads success message
            setTimeout(() => {
                setGiftCard({ code: "", amount: 0, expired_at: "" });
                setSuccessMessage("");
                reset();
                onClose();
            }, 1800);
        }
    }, [verifiedCard, isApplying, applyGiftCard, giftCard.code, fetchSummary, fetchMe, fetchTransactions, onClose, reset]);

    const handleClose = useCallback(() => {
        setGiftCard({ code: "", amount: 0, expired_at: "" });
        setSuccessMessage("");
        reset();
        onClose();
    }, [onClose, reset]);

    if (!isOpen) return null;

    const isVerified = !!verifiedCard;
    const balance = verifiedCard ? formatAmount(verifiedCard.amount) : null;
    const expiryDate = verifiedCard?.expired_at ? formatTableDate(verifiedCard.expired_at) : null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm overflow-hidden"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="redeem-modal-title"
                className="w-full sm:max-w-[480px] bg-white rounded-t-2xl sm:rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 sm:zoom-in duration-250 flex flex-col max-h-[95vh] sm:max-h-[90vh]"
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F1F3F5] flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-[#EBF7FC] flex items-center justify-center text-[#118FB8]">
                            <Gift size={16} />
                        </span>
                        <h2
                            id="redeem-modal-title"
                            className="text-[17px] font-semibold text-[#1A1C21] font-['Inter'] leading-[26px]"
                        >
                            Redeem Gift Card
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        aria-label="Close modal"
                        className="text-[#667085] hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="px-6 py-5 space-y-5 overflow-y-auto custom-scrollbar">

                    {/* ── Gift Card Number Input ── */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <label
                                htmlFor="gift-card-number"
                                className="text-[13px] font-medium text-[#4D5464] font-['Inter'] leading-[20px] tracking-[0.01em]"
                            >
                                Enter Gift Card Number
                            </label>

                            {/* Dynamic balance badge */}
                            <div
                                className={`text-[13px] font-semibold font-['Plus_Jakarta_Sans'] transition-all duration-300 ${isVerified
                                    ? "text-[#118FB8] scale-100 opacity-100"
                                    : "text-[#9CA3AF] opacity-60"
                                    }`}
                            >
                                Gift Card Balance&nbsp;
                                <span>{isVerified ? balance : "$00.00"}</span>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#858D9D] pointer-events-none">
                                <CreditCard size={17} />
                            </div>
                            <input
                                id="gift-card-number"
                                type="text"
                                placeholder="ABCD-EFGH-IJKL-MNOP"
                                value={giftCard.code}
                                onChange={handleCodeChange}
                                maxLength={19} /* 16 chars + 3 dashes */
                                autoComplete="off"
                                spellCheck={false}
                                className={`w-full h-[42px] pl-10 pr-10 bg-[#F9F9FC] border rounded-lg text-sm text-[#1A1C21] placeholder-[#C0C5C9] focus:outline-none transition-all font-['Inter'] tracking-widest ${verifyError
                                    ? "border-red-400 focus:border-red-500"
                                    : isVerified
                                        ? "border-emerald-400 focus:border-emerald-500"
                                        : "border-[#E0E2E7] focus:border-[#118FB8]"
                                    }`}
                            />
                            {/* Right-side status icon */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {isVerifying && (
                                    <Loader2 size={16} className="animate-spin text-[#118FB8]" />
                                )}
                                {!isVerifying && isVerified && (
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                )}
                            </div>
                        </div>

                        {/* Verify error */}
                        {verifyError && !isVerified && (
                            <p className="text-[12px] text-red-500 font-['Inter'] mt-1 animate-in fade-in duration-150">
                                {verifyError}
                            </p>
                        )}

                        {/* Hint text */}
                        {!verifyError && !isVerified && (
                            <p className="text-[11px] text-[#9CA3AF] font-['Inter'] mt-0.5">
                                Format: XXXX-XXXX-XXXX-XXXX — verification happens automatically.
                            </p>
                        )}

                        {/* Expiry date status */}
                        {isVerified && expiryDate && (
                            <div className="flex items-center gap-2.5 px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl mt-3 animate-in fade-in slide-in-from-top-1 duration-400">
                                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white shadow-sm border border-[#F1F5F9] flex items-center justify-center">
                                    <Calendar size={13} className="text-[#118FB8]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider leading-none mb-0.5">
                                        Valid Until
                                    </span>
                                    <p className="text-[13px] font-bold text-[#1E293B] font-['Inter'] leading-tight">
                                        {expiryDate}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>


                    {/* ── Apply error ── */}
                    {applyError && <InlineToast message={applyError} type="error" />}

                    {/* ── Success toast ── */}
                    {successMessage && (
                        <InlineToast message={successMessage} type="success" />
                    )}

                    {/* ── Action Button ── */}
                    <button
                        id="redeem-gift-card-btn"
                        onClick={handleRedeem}
                        disabled={!isVerified || isApplying || !!successMessage}
                        aria-disabled={!isVerified || isApplying}
                        className="w-full h-[46px] bg-[#118FB8] text-white font-semibold text-[15px] rounded-lg hover:bg-[#0e7a9d] active:scale-[0.98] transition-all shadow-sm font-['Inter'] mt-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex-shrink-0"
                    >
                        {isApplying ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Redeeming…
                            </>
                        ) : (
                            "Redeem Gift Card"
                        )}
                    </button>

                    {/* ── Disclaimer ── */}
                    <p className="text-center text-[11px] text-[#9CA3AF] font-['Inter'] leading-[16px]">
                        Redemption is permanent. The balance will be added to your account after admin approval.
                    </p>
                </div>
            </div>
        </div>
    );
}
