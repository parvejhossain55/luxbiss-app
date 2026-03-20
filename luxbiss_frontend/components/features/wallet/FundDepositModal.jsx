import React, { useState, useEffect } from "react";
import { X, DollarSign, Copy, Check, Loader2 } from "lucide-react";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useWalletStore } from "@/store/useWalletStore";
import { getImageUrl } from "@/lib/utils";

export default function FundDepositModal({ isOpen, onClose, summary, message }) {
    const { createTransaction, isLoading, error, clearError } = useTransactionStore();
    const { wallets, fetchWallets } = useWalletStore();
    const { user } = useAuthStore();
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState("");
    const [selectedNetworkId, setSelectedNetworkId] = useState(null);
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds

    useEffect(() => {
        if (isOpen) {
            fetchWallets();
            setStep(1);
            setAmount("");
            setCopied(false);
            setTimeLeft(1200);
        }
        clearError();
    }, [isOpen, clearError, fetchWallets]);

    // Set default selection when wallets load
    useEffect(() => {
        if (wallets.length > 0 && !selectedNetworkId) {
            setSelectedNetworkId(wallets[0].id);
        }
    }, [wallets, selectedNetworkId]);

    // Countdown logic
    useEffect(() => {
        let timer;
        if (isOpen && step === 2 && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isOpen, step, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    // Map DB wallets to UI format
    const networks = wallets.map(w => {
        const coin = w.coin_name?.toUpperCase();
        let iconBg = "bg-slate-400";
        let fallback = coin?.[0] || "$";

        if (coin === "USDT") iconBg = "bg-[#26A17B]";
        else if (coin === "BTC") iconBg = "bg-[#F7931A]";
        else if (coin === "ETH") iconBg = "bg-[#627EEA]";
        else if (coin === "LTC") iconBg = "bg-[#2B53B7]";

        return {
            id: w.id,
            name: `${w.coin_name}`,
            sub: w.network,
            address: w.wallet_address,
            qr_code: getImageUrl(w.qr_code_url),
            logo: getImageUrl(w.coin_logo_url),
            coin: w.coin_name,
            iconBg
        };
    });

    const selectedNetwork = networks.find(n => n.id === selectedNetworkId) || networks[0];

    const handleCopy = () => {
        if (!selectedNetwork?.address) return;
        navigator.clipboard.writeText(selectedNetwork.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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
                        Fund Deposit
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#667085] hover:bg-slate-100 p-1 rounded-md transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto custom-scrollbar pr-1">
                    {message && (
                        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                            <div className="mt-0.5 text-amber-500">
                                <DollarSign size={18} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-amber-900 leading-none">Account Balance Notice</span>
                                <p className="text-[13px] text-amber-800 font-medium leading-relaxed">
                                    {message}
                                </p>
                            </div>
                        </div>
                    )}
                    {step === 1 ? (
                        /* Step 1: Selection */
                        <div className="space-y-5 animate-in slide-in-from-left-4 duration-300">
                            {/* Deposit Amount */}
                            <div className="space-y-1">
                                <label className="text-[14px] font-medium text-[#4D5464] font-['Inter'] leading-[20px] tracking-[0.01em]">
                                    Deposit Amount
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#858D9D]">
                                        <DollarSign size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full h-[40px] pl-10 pr-4 bg-[#F9F9FC] border border-[#E0E2E7] rounded-lg text-sm text-[#1A1C21] placeholder-[#858D9D] focus:outline-none focus:border-[#118FB8] transition-all font-['Inter']"
                                    />
                                </div>
                            </div>

                            {/* Network Selection */}
                            <div className="space-y-2">
                                <label className="text-[14px] font-medium text-[#4D5464] font-['Inter'] leading-[20px] tracking-[0.005em]">
                                    Select Crypto Network
                                </label>
                                <div className="border-t border-[#E0E2E7]">
                                    {networks.map((net) => (
                                        <div
                                            key={net.id}
                                            onClick={() => setSelectedNetworkId(net.id)}
                                            className="flex items-center justify-between py-2 px-4 border-b-[0.5px] border-[#E0E2E7] bg-white cursor-pointer hover:bg-slate-50 group transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Radio Button */}
                                                <div className="relative flex items-center justify-center w-4 h-4">
                                                    <div
                                                        className={`w-4 h-4 rounded-full border transition-all ${selectedNetworkId === net.id
                                                            ? "border-[4px] border-[#118FB8]"
                                                            : "border-[#118FB8] border-opacity-50"
                                                            }`}
                                                    />
                                                </div>

                                                {/* Icon */}
                                                <div className={`w-8 h-8 rounded-full ${net.iconBg} flex items-center justify-center text-white text-xs font-bold overflow-hidden shadow-sm`}>
                                                    {net.logo ? (
                                                        <img src={net.logo} alt={net.id} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span>{net.coin?.[0] || "$"}</span>
                                                    )}
                                                </div>

                                                {/* Text */}
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-black font-['Inter'] leading-[20px]">
                                                        {net.name}
                                                    </span>
                                                    <span className="text-[12px] font-normal text-[#4D5464] font-['Inter'] leading-[20px]">
                                                        {net.sub}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => setStep(2)}
                                disabled={!amount || parseFloat(amount) <= 0}
                                className="w-full h-[44px] bg-[#118FB8] text-white font-semibold text-base rounded-md hover:bg-[#0e7a9d] transition-colors shadow-sm font-['Inter'] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Fund Deposit
                            </button>
                        </div>
                    ) : (
                        /* Step 2: Payment Details */
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pt-6">
                            {/* Summary Info Box (Frame 207) */}
                            <div className="relative bg-[#F1FAFE] border border-[#1FB0D8] rounded-2xl p-6 space-y-3">
                                {/* Timer (Pill Design) */}
                                <div className="absolute -top-0 right-0 bg-gradient-to-r from-[#B10303] to-[#e41e1e] rounded-full px-4 py-1.5 flex items-center gap-2 shadow-[0_4px_12px_rgba(177,3,3,0.3)] border border-white/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    <span className="text-sm font-bold text-white font-['Inter'] tracking-tight tabular-nums">
                                        {formatTime(timeLeft)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 py-1">
                                    <span className="w-24 text-[15px] font-medium text-[#4D5464] font-['Inter']">Amount:</span>
                                    <span className="text-[16px] font-bold text-[#1A1C21] font-['Inter']">${amount || "15"}</span>
                                </div>

                                <div className="flex items-center gap-4 py-1">
                                    <span className="w-24 text-[15px] font-medium text-[#4D5464] font-['Inter']">Currency:</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[16px] font-bold text-[#1A1C21] font-['Inter']">{selectedNetwork?.name}</span>
                                        <div className={`w-6 h-6 rounded-full ${selectedNetwork?.iconBg} flex items-center justify-center text-[10px] text-white font-bold overflow-hidden shadow-sm`}>
                                            {selectedNetwork?.logo ? (
                                                <img src={selectedNetwork.logo} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span>{selectedNetwork?.coin?.[0] || "$"}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 py-1">
                                    <span className="w-24 text-[15px] font-medium text-[#4D5464] font-['Inter']">Network:</span>
                                    <span className="text-[16px] font-bold text-[#1A1C21] font-['Inter']">{selectedNetwork?.sub || "TRC20"}</span>
                                </div>
                            </div>

                            {/* QR and Address (Frame 210) */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                                {/* QR Code (Placeholder Frame 200) */}
                                <div className="h-[151px] w-[151px] border border-[#87DAF2] rounded-md p-1 bg-white flex-shrink-0">
                                    <img
                                        src={selectedNetwork?.qr_code || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedNetwork?.address || 'no-address'}`}
                                        alt="QR Code"
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                {/* Address Copy (Frame 209) */}
                                <div className="flex-1 w-full space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[16px] font-normal text-black font-['Inter']">
                                            Recipient’s wallet address
                                        </label>
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                            <div className="flex-1 h-[48px] px-4 bg-[#E2F4FC] rounded-lg flex items-center overflow-hidden">
                                                <span className="text-[14px] font-light text-black truncate font-['Inter']">
                                                    {selectedNetwork?.address || "No address configured"}
                                                </span>
                                            </div>
                                            <button
                                                onClick={handleCopy}
                                                className="h-[48px] px-5 bg-[#A5E1F5] border border-[#118FB8] rounded-lg flex items-center justify-center hover:opacity-90 transition-all font-['Inter'] text-[16px] font-normal text-black"
                                            >
                                                {copied ? <Check size={18} className="text-emerald-600" /> : "Copy"}
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-[14px] leading-relaxed text-[#4F4F4F] font-['Inter']">
                                        Scan the QR code or copy the wallet address and pay through this wallet address. Please confirm after payment is completed.
                                    </p>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-[13px] animate-in fade-in slide-in-from-top-1">
                                    {error}
                                </div>
                            )}

                            {/* Footer Buttons */}
                            <div className="flex gap-4 pt-2">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 h-[44px] bg-[#E7E7E7] text-[#0F0F0F] font-semibold text-[16px] rounded-[4px] hover:bg-slate-200 transition-colors font-['Inter'] disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        const res = await createTransaction({
                                            type: "deposit",
                                            amount: parseFloat(amount),
                                            note: `Deposit via ${selectedNetwork?.coin} (${selectedNetwork?.sub})`
                                        });
                                        if (res.success) onClose();
                                    }}
                                    disabled={isLoading || !amount || parseFloat(amount) <= 0}
                                    className="flex-1 h-[44px] bg-[#118FB8] text-white font-semibold text-[16px] rounded-[4px] hover:bg-[#0e7a9d] transition-colors shadow-sm font-['Inter'] flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Confirm Payment"}
                                </button>
                            </div>
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
}
