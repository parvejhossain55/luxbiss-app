"use client";
import React, { useState, useEffect } from "react";

import {
    Pencil,
    X,
    Calendar as CalendarIcon,
    PlusCircle,
} from "lucide-react";
import UserDashboardLayout from "@/components/layout/UserDashboardLayout/UserDashboardLayout";
import EditProfileModal from "@/components/features/profile/EditProfileModal";
import AddWalletModal from "@/components/features/profile/AddWalletModal";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";
import { getImageUrl } from "@/lib/utils";

export default function ProfilePage() {

    const { user, updateUser, fetchMe, isLoading } = useAuthStore();

    const [profile, setProfile] = useState({
        header: {
            name: "",
            email: "",
            status: "Active",
            avatarUrl: "",
        },
        personal: {
            fullName: "",
            dob: "",
            gender: "",
            email: "",
            phone: "",
            address: "",
            country: "",
            profile_photo: "",
        },
        wallet: {
            networkKey: "",
            paymentMethod: "Cryptocurrency",
            currency: "",
            network: "",
            withdrawalAddress: "",
        },
    });

    useEffect(() => {
        fetchMe();
    }, [fetchMe]);

    useEffect(() => {
        if (user) {
            setProfile({
                header: {
                    name: user.name || "",
                    email: user.email || "",
                    status: user.status || "Active",
                    avatarUrl: user.profile_photo || "",
                },
                personal: {
                    fullName: user.name || "",
                    dob: user.date_of_birth || "",
                    gender: user.gender || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    address: user.address || "",
                    country: user.country || "",
                    profile_photo: user.profile_photo || "",
                },
                wallet: {
                    networkKey: "", // Map if possible
                    paymentMethod: user.payment_method || "Cryptocurrency",
                    currency: user.payment_currency || "",
                    network: user.payment_network || "",
                    withdrawalAddress: user.withdrawal_address || "",
                },
            });
        }
    }, [user]);

    const [personalOpen, setPersonalOpen] = useState(false);
    const [walletOpen, setWalletOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);

    const handlePersonalSubmit = async (draft) => {
        const res = await updateUser(user.id, {
            name: draft.fullName,
            date_of_birth: draft.dob,
            gender: draft.gender,
            phone: draft.phone,
            address: draft.address,
            country: draft.country,
            profile_photo: draft.profile_photo,
            email: draft.email
        });
        if (res.success) {
            setPersonalOpen(false);
            toast.success("Personal information updated!");
        } else {
            toast.error(res.message || "Failed to update information");
        }
    };


    const handleWalletSubmit = async (draft) => {
        const res = await updateUser(user.id, {
            payment_method: draft.paymentMethod,
            payment_currency: draft.currency,
            payment_network: draft.network,
            withdrawal_address: draft.withdrawalAddress
        });
        if (res.success) {
            setWalletOpen(false);
            toast.success("Wallet information updated!");
        } else {
            toast.error(res.message || "Failed to update wallet");
        }
    };


    return (
        <UserDashboardLayout>
            <div className="mx-auto w-full flex flex-col gap-3">
                {/* Top card / User Detail */}
                <div className="relative bg-white border border-[#EEEEEE] rounded-lg p-6 shadow-sm isolate">
                    {/* Background decoration */}
                    <div className="absolute top-2 left-2 right-2 h-[148px] bg-[#F5F5F5] rounded-[4px] -z-10" />

                    <div className="flex flex-col items-center text-center">
                        <div className="h-[164px] w-[164px] rounded-full bg-slate-200 overflow-hidden flex items-center justify-center border-[8px] border-white shadow-sm text-slate-700 text-3xl font-bold">
                            {profile.header.avatarUrl ? (
                                <img
                                    src={getImageUrl(profile.header.avatarUrl)}
                                    alt={profile.header.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                getInitials(profile.header.name)
                            )}
                        </div>

                        <div className="mt-3 flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2">
                                <h1 className="text-base font-semibold text-[#424242] font-['Plus_Jakarta_Sans']">
                                    {profile.header.name}
                                </h1>
                                <span className="inline-flex items-center justify-center rounded-full bg-[#E8F5E9] px-2 py-0.5 text-[12px] font-semibold text-[#4CAF50] font-['Plus_Jakarta_Sans']">
                                    {profile.header.status}
                                </span>
                            </div>

                            <p className="text-[12px] font-medium text-[#757575]">
                                {profile.header.email}
                            </p>
                        </div>

                        {/* <button
                            onClick={() => setPasswordOpen(true)}
                            className="mt-5 h-9 rounded-md bg-[#1FB0D8] px-6 text-xs font-bold text-white hover:opacity-90 transition-opacity shadow-sm"
                        >
                            Change Password
                        </button> */}
                    </div>
                </div>

                {/* Personal Information */}
                <div className="rounded-lg border border-[#EEEEEE] bg-white overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-4 bg-[#FAFAFA] border-b border-[#EEEEEE]">
                        <h2 className="text-sm font-semibold text-[#424242] font-['Plus_Jakarta_Sans']">
                            Personal Information
                        </h2>
                        {(!user?.address || !user?.phone || !user?.date_of_birth || !user?.gender || !user?.country) && (
                            <button
                                onClick={() => setPersonalOpen(true)}
                                className="inline-flex items-center gap-1 text-sm font-semibold text-[#1FB0D8]"
                            >
                                <Pencil size={16} />
                                {user?.address ? "Edit Information" : "Add Information"}
                            </button>
                        )}
                    </div>

                    <div className="p-3">
                        <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-4 p-4">
                            <InfoRow label="Full Name" value={profile.personal.fullName} />
                            <InfoRow label="Date of Birth" value={profile.personal.dob} />
                            <InfoRow label="Gender" value={profile.personal.gender || "-"} />
                            <InfoRow label="Email Address" value={profile.personal.email} />
                            <InfoRow label="Phone Number" value={profile.personal.phone || "-"} />
                            <InfoRow label="Address" value={profile.personal.address || "-"} />
                            <InfoRow label="Country" value={profile.personal.country || "-"} />
                        </div>
                    </div>

                </div>

                {/* Withdrawal Information */}
                <div className="rounded-lg border border-[#EEEEEE] bg-white overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-4 bg-[#FAFAFA] border-b border-[#EEEEEE]">
                        <h2 className="text-sm font-semibold text-[#424242] font-['Plus_Jakarta_Sans']">
                            Withdrawal Information
                        </h2>
                        {(!user?.withdrawal_address || !user?.payment_currency || !user?.payment_network) && (
                            <button
                                onClick={() => setWalletOpen(true)}
                                className="inline-flex items-center gap-1 text-sm font-semibold text-[#1FB0D8]"
                            >
                                <Pencil size={16} />
                                {user?.withdrawal_address ? "Edit Withdrawal Information" : "Add Withdrawal Information"}
                            </button>
                        )}
                    </div>

                    <div className="p-3">
                        <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-4 p-4">
                            <InfoRow label="Payment Method" value={profile.wallet.paymentMethod} />
                            <InfoRow label="Currency" value={profile.wallet.currency} />
                            <InfoRow label="Network" value={profile.wallet.network} />
                            <InfoRow
                                label="Withdrawal Address"
                                value={profile.wallet.withdrawalAddress || "-"}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <EditProfileModal
                isOpen={personalOpen}
                initialValue={profile.personal}
                onClose={() => setPersonalOpen(false)}
                onSubmit={handlePersonalSubmit}
            />

            <AddWalletModal
                isOpen={walletOpen}
                initialValue={profile.wallet}
                onClose={() => setWalletOpen(false)}
                onSubmit={handleWalletSubmit}
            />

            <ChangePasswordModal
                isOpen={passwordOpen}
                registeredEmail={profile.header.email}
                onClose={() => setPasswordOpen(false)}
            />
        </UserDashboardLayout>
    );
}

function InfoRow({ label, value, className = "" }) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <div className="text-sm font-normal text-[#757575] font-['Plus_Jakarta_Sans']">
                {label}
            </div>
            <div className="text-sm font-semibold text-[#424242] font-['Plus_Jakarta_Sans'] break-words">
                {value || "-"}
            </div>
        </div>
    );
}

function ChangePasswordModal({ isOpen, onClose, registeredEmail }) {
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm overflow-hidden"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-md rounded-lg bg-white shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 font-['Inter'] flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
                    <div className="text-sm font-bold text-slate-800">
                        Change Password
                    </div>
                    <button onClick={onClose} className="h-8 w-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 pb-6 pt-5 overflow-y-auto custom-scrollbar">
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">
                        For security reasons, password changes require email verification. We will send an OTP to your registered email.
                    </p>

                    <div className="mb-6">
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                            Registered Email
                        </label>
                        <input
                            value={registeredEmail}
                            disabled
                            className="w-full h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-xs text-slate-400 outline-none font-medium cursor-not-allowed"
                        />
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full rounded-md bg-[#148DB3] py-3.5 text-xs font-bold text-white hover:bg-[#117a9b] transition-all shadow-md active:scale-[0.98] flex-shrink-0"
                    >
                        Send OTP
                    </button>
                </div>
            </div>
        </div>
    );
}

function getInitials(name) {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
}
