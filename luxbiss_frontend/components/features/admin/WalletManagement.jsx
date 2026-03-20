"use client";

import React, { useState, useEffect } from "react";
import FullWidthTable from "@/components/ui/FullWidthTable/FullWidthTable";
import { Plus, Edit2, Trash2, Wallet as WalletIcon, ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";
import { useWalletStore } from "@/store/useWalletStore";
import { useProductStore } from "@/store/useProductStore";
import { formatTableDate, getImageUrl } from "@/lib/utils";

/**
 * CoinLogo Component
 * Handles image rendering with a fallback if the image fails to load.
 */
const CoinLogo = ({ src, alt, size = 20, className = "" }) => {
    const [isError, setIsError] = React.useState(false);

    // Reset error state if src changes
    React.useEffect(() => {
        setIsError(false);
    }, [src]);

    if (!src || isError) {
        return <WalletIcon className="text-slate-400" size={size} />;
    }

    return (
        <img
            src={getImageUrl(src)}
            alt={alt}
            className={`h-full w-full object-contain ${className}`}
            onError={() => setIsError(true)}
        />
    );
};

/**
 * Wallet Management Component
 * Allows admins to manage the platform's deposit wallet addresses.
 */
const WalletManagement = () => {
    const { wallets, fetchWallets, createWallet, updateWallet, deleteWallet, isLoading } = useWalletStore();
    const { uploadProductImage } = useProductStore();

    useEffect(() => {
        fetchWallets();
    }, [fetchWallets]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWallet, setEditingWallet] = useState(null);
    const [formData, setFormData] = useState({
        coin_name: "",
        network: "",
        wallet_address: "",
        coin_logo_url: "",
        qr_code_url: "",
    });

    const handleOpenModal = (wallet = null) => {
        if (wallet) {
            setEditingWallet(wallet);
            setFormData({ ...wallet });
        } else {
            setEditingWallet(null);
            setFormData({
                coin_name: "",
                network: "",
                wallet_address: "",
                coin_logo_url: "",
                qr_code_url: "",
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingWallet(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!formData.coin_logo_url) {
            toast.error("Coin Logo is required");
            return;
        }
        if (!formData.qr_code_url) {
            toast.error("QR Code is required");
            return;
        }

        let res;
        if (editingWallet) {
            res = await updateWallet(editingWallet.id, formData);
        } else {
            res = await createWallet(formData);
        }

        if (res.success) {
            handleCloseModal();
            toast.success("Wallet saved successfully!");
        } else {
            toast.error(res.message || "Failed to save wallet");
        }
    };

    const handleDelete = async (id) => {
        const res = await deleteWallet(id);
        if (!res.success) {
            toast.error(res.message || "Failed to delete wallet");
        } else {
            toast.success("Wallet deleted successfully!");
        }
    };

    // Format dates for display
    const formattedWallets = wallets.map(w => ({
        ...w,
        created_at_display: formatTableDate(w.created_at) || "N/A"
    }));

    const columns = [
        {
            header: "Coin",
            key: "coin_name",
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100 p-2 flex items-center justify-center overflow-hidden">
                        <CoinLogo src={row.coin_logo_url} alt={val} size={20} />
                    </div>
                    <div>
                        <div className="font-bold text-slate-800">{val}</div>
                        <div className="text-[10px] uppercase font-bold text-sky-500 tracking-wider bg-sky-50 px-1.5 py-0.5 rounded inline-block">
                            {row.network}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: "Wallet Address",
            key: "wallet_address",
            render: (val) => (
                <div className="flex items-center gap-2 group">
                    <span className="text-sm font-mono text-slate-600 truncate max-w-[200px]">{val}</span>
                    <button
                        onClick={() => { navigator.clipboard.writeText(val); toast.success("Copied!") }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded text-sky-500"
                    >
                        <ExternalLink size={14} />
                    </button>
                </div>
            ),
        },
        {
            header: "Date Added",
            key: "created_at_display",
            render: (val) => <span className="text-slate-500 text-sm">{val}</span>,
        },
        {
            header: "Actions",
            key: "id",
            render: (val, row) => (
                <div className="flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(row); }}
                        className="h-8 w-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center hover:bg-sky-100 transition-colors"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
                        className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1a5b7d]">Wallet Management</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Configure system-wide payment addresses and networks.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-sky-500 text-white font-bold rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-[0.98]"
                >
                    <Plus size={20} />
                    Add New Wallet
                </button>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <FullWidthTable
                    data={formattedWallets}
                    columns={columns}
                    isLoading={isLoading}
                    headerBgClass="bg-[#B0E3F2]"
                />
            </div>

            {/* Simple Modal */}
            {isModalOpen && (
                <div
                    onMouseDown={handleCloseModal}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                >
                    <div
                        onMouseDown={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                    >
                        <div className="bg-[#1a5b7d] p-6 text-white">
                            <h3 className="text-xl font-bold">{editingWallet ? "Edit Wallet" : "Add New Wallet"}</h3>
                            <p className="text-sky-200/80 text-sm">Enter the details for the payment method.</p>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Coin Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Tether"
                                        className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-sky-500 outline-none font-semibold text-slate-700 transition-all"
                                        value={formData.coin_name}
                                        onChange={(e) => setFormData({ ...formData, coin_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Network</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. TRC20"
                                        className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-sky-500 outline-none font-semibold text-slate-700 transition-all"
                                        value={formData.network}
                                        onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Wallet Address</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter full wallet address"
                                    className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-sky-500 outline-none font-mono font-semibold text-slate-700 transition-all"
                                    value={formData.wallet_address}
                                    onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Coin Logo</label>
                                <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all group overflow-hidden">
                                    <div className="h-16 w-16 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                                        <CoinLogo src={formData.coin_logo_url} alt="Logo Preview" size={24} className="p-2" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-slate-600 mb-1">Upload Crypto Logo</div>
                                        <p className="text-[10px] text-slate-400 font-medium">PNG, SVG or JPG (Max. 2MB)</p>
                                    </div>
                                    <label className="cursor-pointer bg-white px-4 py-2 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                                        Browse
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const res = await uploadProductImage(file);
                                                    if (res.success && res.data?.url) {
                                                        setFormData({ ...formData, coin_logo_url: res.data.url });
                                                        toast.success("Logo uploaded!");
                                                    } else {
                                                        toast.error(res.message || "Failed to upload image.");
                                                    }
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">QR Code</label>
                                <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all group overflow-hidden">
                                    <div className="h-16 w-16 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                                        <CoinLogo src={formData.qr_code_url} alt="QR Preview" size={24} className="p-2" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-slate-600 mb-1">Upload QR Code</div>
                                        <p className="text-[10px] text-slate-400 font-medium">PNG, SVG or JPG (Max. 2MB)</p>
                                    </div>
                                    <label className="cursor-pointer bg-white px-4 py-2 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                                        Browse
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const res = await uploadProductImage(file);
                                                    if (res.success && res.data?.url) {
                                                        setFormData({ ...formData, qr_code_url: res.data.url });
                                                        toast.success("QR Code uploaded!");
                                                    } else {
                                                        toast.error(res.message || "Failed to upload image.");
                                                    }
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 h-12 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 h-12 rounded-xl font-bold bg-[#1a5b7d] text-white hover:bg-[#144762] transition-colors shadow-lg shadow-sky-900/10"
                                >
                                    {editingWallet ? "Save Changes" : "Create Wallet"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletManagement;
