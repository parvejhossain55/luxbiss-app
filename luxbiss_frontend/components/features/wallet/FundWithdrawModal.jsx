import React, { useState, useEffect } from "react";
import { X, DollarSign, Loader2, AlertTriangle, Lock, CheckCircle2 } from "lucide-react";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useProductStore } from "@/store/useProductStore";

export default function FundWithdrawModal({ isOpen, onClose, availableBalance }) {
    const { createTransaction, isLoading, error, clearError } = useTransactionStore();
    const { fetchSteps } = useProductStore();
    const { user } = useAuthStore();
    const [amount, setAmount] = useState("");
    const [didSubmit, setDidSubmit] = useState(false);
    const [userProgress, setUserProgress] = useState(0);
    const [isCheckingProgress, setIsCheckingProgress] = useState(true);

    useEffect(() => {
        const checkProgress = async () => {
            if (user?.level_id) {
                setIsCheckingProgress(true);
                const res = await fetchSteps(user.level_id, { per_page: 50 });
                if (res?.success && res.data) {
                    const steps = res.data;
                    const totalSteps = steps.length;
                    const currentStepIndex = steps.findIndex(s => s.id === user.step_id);

                    const progress = totalSteps > 0
                        ? Math.min(100, Math.round(((Math.max(0, currentStepIndex) + (user.current_step_completed ? 1 : 0)) / totalSteps) * 100))
                        : 0;

                    setUserProgress(progress);
                }
                setIsCheckingProgress(false);
            } else {
                setUserProgress(0);
                setIsCheckingProgress(false);
            }
        };

        checkProgress();
        clearError();
    }, [isOpen, clearError, user, fetchSteps]);

    const isLevelCompleted = userProgress >= 100 || user?.status === "ignored";
    const canWithdraw = isLevelCompleted && user?.withdrawal_address;

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
        if (didSubmit) {
            setDidSubmit(false);
        }
        if (error) {
            clearError();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-hidden"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="w-full max-w-[686px] bg-white rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[95vh]"
                style={{ padding: '24px' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5 flex-shrink-0">
                    <h2 className="text-[18px] font-medium text-[#1A1C21] font-['Inter'] leading-[28px] tracking-[0.005em]">
                        Fund Withdraw
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#667085] hover:bg-slate-100 p-1 rounded-md transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="space-y-5 overflow-y-auto custom-scrollbar pr-1">
                    {/* Withdraw Amount Selection Row */}
                    <div className="space-y-1">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                            <label className="text-[14px] font-medium text-[#4D5464] font-['Inter'] leading-[20px] tracking-[0.01em]">
                                Withdraw Amount
                            </label>
                            <div className="text-[14px] font-semibold text-[#1FB0D8] font-['Plus_Jakarta_Sans']">
                                Withdrawable Balance ${availableBalance?.toLocaleString() || "0"}
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#858D9D]">
                                <DollarSign size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={handleAmountChange}
                                className="w-full h-[40px] pl-10 pr-4 bg-[#F9F9FC] border border-[#E0E2E7] rounded-lg text-sm text-[#1A1C21] placeholder-[#858D9D] focus:outline-none focus:border-[#118FB8] transition-all font-['Inter']"
                            />
                        </div>
                    </div>

                    {/* Network Content (Dynamic from user profile) */}
                    <div className="space-y-2">
                        <label className="text-[14px] font-medium text-[#4D5464] font-['Inter'] leading-[20px] tracking-[0.005em]">
                            Withdrawal Network
                        </label>
                        <div className="px-4 py-2 border border-[#E0E2E7] bg-[#F9F9FC] rounded-lg">
                            <div className="flex items-center gap-3">
                                {/* Icon */}
                                <div className="w-8 h-8 rounded-full bg-[#26A17B] flex items-center justify-center text-white text-[10px] font-bold overflow-hidden shadow-sm">
                                    T
                                </div>
                                {/* Text */}
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-black font-['Inter'] leading-[20px]">
                                        {user?.payment_currency || "USDT"}
                                    </span>
                                    <span className="text-[12px] font-normal text-[#4D5464] font-['Inter'] leading-[20px]">
                                        {user?.payment_network || "Default Network"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="text-[11px] text-[#858D9D]">
                            Funds will be sent to your saved withdrawal address.
                        </p>
                    </div>

                    {/* Withdraw Address */}
                    <div className="space-y-1">
                        <label className="text-[14px] font-medium text-[#4D5464] font-['Inter'] leading-[20px] tracking-[0.01em]">
                            Withdraw Address
                        </label>
                        <input
                            type="text"
                            readOnly
                            value={user?.withdrawal_address || "No address saved"}
                            className="w-full h-[40px] px-4 bg-[#E7E7E7] border border-[#E0E2E7] rounded-lg text-sm text-[#4F4F4F] font-['Inter'] overflow-hidden truncate"
                        />
                    </div>

                    {/* Error Message */}
                    {didSubmit && error && (
                        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-[13px] animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="space-y-4 mt-2">
                        {isCheckingProgress ? (
                            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100 gap-3">
                                <Loader2 className="animate-spin h-6 w-6 text-sky-500" />
                                <span className="text-sm font-medium text-slate-500">Verifying level completion...</span>
                            </div>
                        ) : !isLevelCompleted ? (
                            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center gap-2 text-rose-700 font-bold">
                                    <Lock size={18} />
                                    <span className="text-sm">Withdrawal Locked</span>
                                </div>
                                <p className="text-[13px] text-rose-800 leading-relaxed font-medium">
                                    Your current level progress is <span className="font-bold underline">{userProgress}%</span>.
                                    Withdrawals are only available when your level is <span className="font-bold">100% completed</span>.
                                </p>
                                <button
                                    onClick={() => {
                                        onClose();
                                        window.location.href = "/product";
                                    }}
                                    className="w-full h-[38px] bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-all shadow-sm shadow-rose-200"
                                >
                                    Complete Level Now
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-2 animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                                    <CheckCircle2 size={18} />
                                    <span className="text-sm">Thank You for Participating!</span>
                                </div>
                                <p className="text-[13px] text-emerald-800 leading-relaxed font-medium">
                                    Your current tier is 100% completed. You have successfully met all requirements and can now proceed with your withdrawal.
                                </p>
                            </div>
                        )}

                        {!user?.withdrawal_address && !isCheckingProgress && (
                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                                <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider leading-none">Missing Address</span>
                                    <p className="text-[12px] text-amber-800 font-medium leading-relaxed">
                                        Please set your withdrawal address in your profile settings before you can request a withdrawal.
                                    </p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={async () => {
                                setDidSubmit(true);
                                if (!canWithdraw || parseFloat(amount) > availableBalance) {
                                    return;
                                }
                                const res = await createTransaction({
                                    type: "withdraw",
                                    amount: parseFloat(amount),
                                    note: "Withdrawal request"
                                });
                                if (res.success) onClose();
                            }}
                            disabled={isLoading || isCheckingProgress || !canWithdraw || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance}
                            className="w-full h-[48px] bg-[#118FB8] text-white font-bold text-base rounded-xl hover:bg-[#0e7a9d] transition-all shadow-lg shadow-sky-900/10 active:scale-[0.98] disabled:opacity-40 disabled:grayscale disabled:pointer-events-none flex items-center justify-center gap-2 flex-shrink-0 mt-2"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                <>
                                    {!canWithdraw && <Lock size={18} />}
                                    Withdraw Funds
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}
