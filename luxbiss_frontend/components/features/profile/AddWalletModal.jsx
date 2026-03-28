import React, { useState, useEffect } from "react";
import { X, Loader2, Wallet as WalletIcon } from "lucide-react";
import { useWalletStore } from "@/store/useWalletStore";
import { getImageUrl } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function AddWalletModal({ isOpen, onClose, initialValue, onSubmit }) {
    const { wallets, fetchWallets, isLoading, error } = useWalletStore();
    const [draft, setDraft] = useState(initialValue || {});

    useEffect(() => {
        if (isOpen) {
            setDraft(initialValue || {});
            fetchWallets();
        }
    }, [isOpen, initialValue, fetchWallets]);

    if (!isOpen) return null;

    const handleSelect = (wallet) => {
        setDraft({
            ...draft,
            networkKey: wallet.id,
            paymentMethod: "Cryptocurrency",
            currency: wallet.coin_name,
            network: wallet.network,
        });
    };

    // Try to find if currently selected wallet matches any in the list
    const isSelected = (wallet) => {
        if (draft.networkKey === wallet.id) return true;
        return draft.currency === wallet.coin_name && draft.network === wallet.network;
    };

    return (
        <div
            className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm overflow-hidden"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-lg rounded-lg bg-white shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEEEEE] bg-[#FAFAFA] flex-shrink-0">
                    <div className="text-sm font-semibold text-[#424242] font-['Plus_Jakarta_Sans']">
                        Wallet information
                    </div>
                    <button onClick={onClose} className="h-8 w-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-[#757575]">
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 pb-6 pt-5 overflow-y-auto custom-scrollbar">
                    <p className="text-xs text-[#757575] mb-5 font-['Plus_Jakarta_Sans']">
                        Choose the network you want to deposit through
                    </p>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-3">
                                <Loader2 className="h-8 w-8 text-[#1FB0D8] animate-spin" />
                                <span className="text-xs text-slate-500 font-medium">Fetching wallets...</span>
                            </div>
                        ) : error ? (
                            <div className="text-center py-10 border border-dashed border-rose-200 rounded-lg bg-rose-50">
                                <p className="text-xs text-rose-500 font-medium tracking-tight">{error}</p>
                                <button
                                    type="button"
                                    onClick={fetchWallets}
                                    className="mt-3 text-xs font-semibold text-rose-600 hover:underline"
                                >
                                    Try again
                                </button>
                            </div>
                        ) : wallets.length === 0 ? (
                            <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg bg-slate-50">
                                <p className="text-xs text-slate-400 font-medium tracking-tight">No wallets available.</p>
                            </div>
                        ) : (
                            wallets.map((wallet) => (
                                <label
                                    key={wallet.id}
                                    className={`flex items-start gap-4 p-3 border rounded-lg cursor-pointer transition-all ${isSelected(wallet) ? 'border-[#1FB0D8] bg-[#1FB0D8]/5' : 'border-[#EEEEEE] hover:bg-[#FAFAFA]'}`}
                                >
                                    <input
                                        type="radio"
                                        name="network"
                                        checked={isSelected(wallet)}
                                        onChange={() => handleSelect(wallet)}
                                        className="mt-1.5 h-4 w-4 accent-[#1FB0D8]"
                                    />

                                    <div
                                        className={`h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0`}
                                    >
                                        {wallet.coin_logo_url ? (
                                            <img
                                                src={getImageUrl(wallet.coin_logo_url)}
                                                alt={wallet.coin_name}
                                                className="w-full h-full object-contain p-1"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = '<div class="text-[10px] font-bold text-slate-400">' + (wallet.coin_name?.[0] || 'W') + '</div>';
                                                }}
                                            />
                                        ) : (
                                            <div className="text-[10px] font-bold text-slate-400">
                                                {wallet.coin_name?.[0] || 'W'}
                                            </div>
                                        )}
                                    </div>

                                    <div className="leading-tight pt-1">
                                        <div className="text-xs font-bold text-[#424242] font-['Plus_Jakarta_Sans']">
                                            {wallet.coin_name}
                                        </div>
                                        <div className="text-[10px] font-medium text-[#757575] font-['Plus_Jakarta_Sans']">
                                            {wallet.network}
                                        </div>
                                    </div>
                                </label>
                            ))
                        )}
                    </div>

                    <div className="mt-6">
                        <label className="text-[13px] font-medium text-[#757575] mb-2 font-['Plus_Jakarta_Sans'] uppercase tracking-wider block">
                            Withdraw Address
                        </label>
                        <input
                            type="text"
                            placeholder="Paste your wallet address here"
                            value={draft.withdrawalAddress || ""}
                            onChange={(e) => setDraft({ ...draft, withdrawalAddress: e.target.value })}
                            className="w-full h-11 rounded-md border border-[#EEEEEE] bg-[#FAFAFA] px-4 text-xs text-[#424242] font-semibold outline-none focus:bg-white focus:border-[#1FB0D8] transition-all font-['Plus_Jakarta_Sans'] disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                    </div>

                    <button
                        onClick={() => {
                            if (!draft.currency || !draft.withdrawalAddress) {
                                toast.error("Please select a network and enter a withdrawal address");
                                return;
                            }
                            onSubmit(draft);
                        }}
                        disabled={isLoading || wallets.length === 0 || !draft.currency || !draft.withdrawalAddress}
                        className="mt-6 w-full rounded-md bg-[#1FB0D8] py-3.5 text-sm font-bold text-white hover:opacity-90 transition-all shadow-md active:scale-[0.98] font-['Plus_Jakarta_Sans'] flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
