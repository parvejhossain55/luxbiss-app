"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout/AdminDashboardLayout";
import {
    User, Mail, Phone, Globe, Shield, Wallet,
    Lock, ArrowLeft, Save, Trash2, Calendar,
    TrendingUp, CreditCard, History
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useProductStore } from "@/store/useProductStore";
import GenerateTransactionModal from "@/components/features/admin/GenerateTransactionModal";
import { formatTableDate } from "@/lib/utils";

/**
 * Admin User Edit Page
 * Dedicated page for updating all aspects of a user account.
 */
export default function AdminUserEditPage() {
    const params = useParams();
    const router = useRouter();

    // Extract ID from URL, handling both standard navigation and static shells
    const [userId, setUserId] = React.useState(() => {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        return id !== "user_shell" ? id : null;
    });

    React.useEffect(() => {
        // Fallback for static export where params.id might be 'user_shell'
        if ((!userId || userId === "user_shell") && typeof window !== "undefined") {
            const parts = window.location.pathname.split("/").filter(Boolean);
            const usersIndex = parts.indexOf("users");
            if (usersIndex !== -1 && parts[usersIndex + 1]) {
                const idFromUrl = parts[usersIndex + 1];
                if (idFromUrl !== "user_shell") {
                    setUserId(idFromUrl);
                }
            }
        }
    }, [params.id]);

    const { user } = useAuthStore();
    const { fetchUser, updateUser, approveHoldBalance, isLoading: storeLoading } = useUserStore();
    const { fetchSummary } = useTransactionStore();
    const { levels, fetchLevels, fetchSteps } = useProductStore();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isTxModalOpen, setIsTxModalOpen] = useState(false);
    const [availableSteps, setAvailableSteps] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        country: "",
        status: "Active",
        balance: 0,
        holdBalance: 0,
        withdrawableBalance: 0,
        totalDeposit: 0,
        totalWithdraw: 0,
        totalProfit: 0,
        regDate: "",
        level_id: "",
        step_id: ""
    });

    useEffect(() => {
        // If not admin, redirect 
        if (user && user.role !== "admin") {
            router.push("/dashboard");
        }
    }, [user, router]);

    useEffect(() => {
        if (user && user.role === "admin" && userId && userId !== "user_shell") {
            loadUser();
            fetchLevels({ per_page: 50 });
        }
    }, [userId, user]);

    useEffect(() => {
        if (formData.level_id) {
            fetchSteps(formData.level_id, { per_page: 50 }).then(res => {
                if (res.success) {
                    setAvailableSteps(res.data);
                }
            });
        }
    }, [formData.level_id, fetchSteps]);

    const loadUser = async () => {
        setIsLoading(true);
        const [userRes, summaryRes] = await Promise.all([
            fetchUser(userId),
            fetchSummary(365, userId) // Get summary for a wider range to be safe
        ]);

        if (userRes.success && userRes.data) {
            const u = userRes.data;
            const s = summaryRes.success ? summaryRes.data : null;

            setFormData({
                name: u.name || "",
                email: u.email || "",
                username: u.telegram_username || "",
                phone: u.phone || "",
                country: u.country || "",
                status: u.status ? u.status.charAt(0).toUpperCase() + u.status.slice(1) : "Unknown",
                balance: u.balance || 0,
                holdBalance: u.hold_balance || 0,
                withdrawableBalance: u.withdrawable_balance || 0,
                totalDeposit: s?.total_deposit || 0,
                totalWithdraw: s?.total_withdrawal || 0,
                totalProfit: (s?.total_deposit || 0) > 0 ? (u.balance - s.total_deposit) : 0,
                regDate: formatTableDate(u.created_at) || "",
                level_id: u.level_id || "",
                step_id: u.step_id || ""
            });
        } else {
            toast.error(userRes.message || "Failed to load user");
            router.push("/admin/users/");
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const payload = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            country: formData.country,
            status: formData.status.toLowerCase(),
            balance: formData.balance,
            hold_balance: formData.holdBalance,
            withdrawable_balance: formData.withdrawableBalance,
            level_id: formData.level_id ? Number(formData.level_id) : null,
            step_id: formData.step_id ? Number(formData.step_id) : null
        };
        // Option to include password if provided
        if (formData.password) payload.password = formData.password;

        const res = await updateUser(userId, payload);
        setIsSaving(false);
        if (res.success) {
            toast.success("User details updated successfully!");
        } else {
            toast.error(res.message || "Failed to update user");
        }
    };

    const handleApproveHoldBalance = async () => {
        if (formData.holdBalance <= 0) return;

        setIsSaving(true);
        const res = await approveHoldBalance(userId);
        setIsSaving(false);

        if (res.success) {
            setFormData(prev => ({
                ...prev,
                balance: res.data.balance,
                holdBalance: res.data.hold_balance
            }));
            toast.success("Hold balance approved successfully!");
        } else {
            toast.error(res.message || "Failed to approve hold balance");
        }
    };

    const handleSuspend = async () => {
        const isSuspended = formData.status === "Suspend";
        const newStatus = isSuspended ? "Active" : "Suspend";

        setIsSaving(true);
        const res = await updateUser(userId, { status: newStatus.toLowerCase() });
        setIsSaving(false);
        if (res.success) {
            setFormData({ ...formData, status: newStatus });
            toast.success(`User has been ${isSuspended ? 'activated' : 'suspended'} successfully.`);
        } else {
            toast.error(res.message || "Failed to update user status");
        }
    };

    if (isLoading) {
        return (
            <AdminDashboardLayout>
                <div className="h-[60vh] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500" />
                </div>
            </AdminDashboardLayout>
        );
    }

    return (
        <AdminDashboardLayout>
            <div className="mx-auto space-y-6 pb-12">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.push("/admin/users/")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-white hover:shadow-sm transition-all font-medium"
                    >
                        <ArrowLeft size={18} />
                        Back to User List
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSuspend}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-semibold disabled:opacity-50 ${formData.status === "Suspend"
                                ? "text-emerald-600 border border-emerald-100 bg-emerald-50 hover:bg-emerald-100"
                                : "text-rose-600 border border-rose-100 bg-rose-50 hover:bg-rose-100"
                                }`}
                        >
                            {formData.status === "Suspend" ? <Shield size={18} /> : <Trash2 size={18} />}
                            {formData.status === "Suspend" ? "Activate User" : "Suspend User"}
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 shadow-lg shadow-sky-500/20 transition-all active:scale-[0.98] disabled:opacity-70"
                        >
                            {isSaving ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                        {formData.status === "Ignored" && (
                            <button
                                onClick={() => setIsTxModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#40C4E9] text-white font-semibold hover:bg-[#35b1d4] shadow-lg shadow-sky-400/20 transition-all active:scale-[0.98]"
                            >
                                <CreditCard size={18} />
                                Generate Transaction
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: User Overview */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Summary Card */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
                            <div className="w-24 h-24 rounded-full bg-sky-50 border-4 border-sky-100 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                                <User size={48} className="text-sky-500" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">{formData.name}</h2>
                            <p className="text-slate-500 text-sm mb-4">{formData.email}</p>
                            <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border transition-colors ${formData.status === "Suspend"
                                ? "bg-rose-50 text-rose-600 border-rose-100"
                                : formData.status === "Hold"
                                    ? "bg-amber-50 text-amber-600 border-amber-100"
                                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                }`}>
                                <Shield size={14} className="mr-2" />
                                {formData.status} Account
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-tighter">Joined</p>
                                    <p className="text-sm font-bold text-slate-700">{formData.regDate}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-tighter">Location</p>
                                    <p className="text-sm font-bold text-slate-700">{formData.country}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Overview Section */}
                        <div className="grid grid-cols-2 gap-4">
                            <MiniStatCard title="Total Deposit" value={`$${formData.totalDeposit}`} icon={<CreditCard />} />
                            <MiniStatCard title="Total Withdraw" value={`$${formData.totalWithdraw}`} icon={<History />} />
                        </div>

                        {/* Hold Balance Card */}
                        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 overflow-hidden relative">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-rose-500 font-bold text-sm uppercase tracking-wider">On Hold Balance</h3>
                                    <div className="text-3xl font-black text-slate-800 mt-1">${formData.holdBalance.toLocaleString()}</div>
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                                    <Lock size={24} />
                                </div>
                            </div>

                            <button
                                onClick={handleApproveHoldBalance}
                                disabled={formData.holdBalance <= 0}
                                className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${formData.holdBalance > 0
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 active:scale-[0.98]"
                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    }`}
                            >
                                <TrendingUp size={18} />
                                Approve to Main Balance
                            </button>

                            <p className="text-[10px] text-slate-400 text-center mt-3 font-medium uppercase tracking-tight text-wrap">
                                Approving will move funds instantly to available balance
                            </p>
                        </div> {/* End of Hold Balance Card */}
                    </div> {/* End of Left Column: User Overview */}

                    {/* Right Column: Detailed Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Information Section */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 rounded-lg bg-sky-50 text-sky-500">
                                    <User size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">Account Information</h3>
                            </div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Full Name"
                                    icon={<User size={18} />}
                                    value={formData.name}
                                    onChange={(v) => setFormData({ ...formData, name: v })}
                                />
                                <FormInput
                                    label="Email Address"
                                    icon={<Mail size={18} />}
                                    value={formData.email}
                                    onChange={(v) => setFormData({ ...formData, email: v })}
                                />
                                <FormInput
                                    label="Phone Number"
                                    icon={<Phone size={18} />}
                                    value={formData.phone}
                                    onChange={(v) => setFormData({ ...formData, phone: v })}
                                />
                                <FormInput
                                    label="Country"
                                    icon={<Globe size={18} />}
                                    value={formData.country}
                                    onChange={(v) => setFormData({ ...formData, country: v })}
                                />
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Account Status</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Shield size={18} />
                                        </div>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all outline-none font-semibold text-slate-700 appearance-none cursor-pointer"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Ignored">Ignored</option>
                                            <option value="Suspend">Suspended</option>
                                            <option value="Hold">Hold</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Assigned Level</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <TrendingUp size={18} />
                                        </div>
                                        <select
                                            value={formData.level_id}
                                            onChange={(e) => setFormData({ ...formData, level_id: e.target.value, step_id: "" })}
                                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all outline-none font-semibold text-slate-700 appearance-none cursor-pointer"
                                        >
                                            <option value="">No Level Assigned</option>
                                            {levels.map(l => (
                                                <option key={l.id} value={l.id}>{l.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Current Step</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <History size={18} />
                                        </div>
                                        <select
                                            value={formData.step_id}
                                            onChange={(e) => setFormData({ ...formData, step_id: e.target.value })}
                                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all outline-none font-semibold text-slate-700 appearance-none cursor-pointer"
                                            disabled={!formData.level_id}
                                        >
                                            <option value="">No Step Assigned</option>
                                            {availableSteps.map(s => (
                                                <option key={s.id} value={s.id}>Step {s.step_number}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Financial Management Section */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 rounded-lg bg-sky-50 text-sky-500">
                                    <Wallet size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">Financial Management</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Available Balance ($)"
                                    icon={<Wallet size={18} />}
                                    type="number"
                                    value={formData.balance}
                                    onChange={(v) => setFormData({ ...formData, balance: Number(v) })}
                                />
                                <FormInput
                                    label="Hold Balance ($)"
                                    icon={<Lock size={18} />}
                                    type="number"
                                    value={formData.holdBalance}
                                    onChange={(v) => setFormData({ ...formData, holdBalance: Number(v) })}
                                />
                                <FormInput
                                    label="Withdrawable Balance ($)"
                                    icon={<TrendingUp size={18} />}
                                    type="number"
                                    value={formData.withdrawableBalance}
                                    onChange={(v) => setFormData({ ...formData, withdrawableBalance: Number(v) })}
                                />
                                <FormInput
                                    label="Change Password"
                                    icon={<Lock size={18} />}
                                    type="password"
                                    placeholder="Enter new password"
                                    value={formData.password || ""}
                                    onChange={(v) => setFormData({ ...formData, password: v })}
                                />
                            </div>

                            {formData.status === "Ignored" && (
                                <button
                                    onClick={() => setIsTxModalOpen(true)}
                                    className="w-full mt-8 py-3 bg-sky-50 text-sky-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-sky-100 transition-colors"
                                >
                                    <TrendingUp size={18} />
                                    Create Manual Deposit/Withdraw
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            <GenerateTransactionModal
                isOpen={isTxModalOpen}
                onClose={() => setIsTxModalOpen(false)}
                userId={userId}
                userEmail={formData.email}
                userStatus={formData.status?.toLowerCase()}
                onSuccess={loadUser}
            />
        </AdminDashboardLayout>
    );
}


function FormInput({ label, icon, value, onChange, type = "text", placeholder }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {icon}
                </div>
                <input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all outline-none font-semibold text-slate-700"
                />
            </div>
        </div>
    );
}

function MiniStatCard({ title, value, icon }) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center">
                {React.cloneElement(icon, { size: 18 })}
            </div>
            <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-tighter">{title}</p>
                <p className="text-sm font-bold text-slate-800">{value}</p>
            </div>
        </div>
    );
}


