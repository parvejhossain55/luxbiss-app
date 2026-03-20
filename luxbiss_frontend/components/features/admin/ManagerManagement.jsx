"use client";

import React, { useState, useEffect } from "react";
import FullWidthTable from "@/components/ui/FullWidthTable/FullWidthTable";
import { Plus, UserPlus, Shield, Mail, Phone, Trash2, Edit2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { managerService } from "@/lib/manager";
import { productService } from "@/lib/product";
import { formatTableDate, getImageUrl } from "@/lib/utils";

/**
 * Manager Management Component
 * Allows super-admins to manage sub-admins/managers of the platform.
 */
const ManagerManagement = () => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingManager, setEditingManager] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [managers, setManagers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, per_page: 10, total: 0 });

    const fetchManagers = async (params = {}) => {
        setIsLoading(true);
        try {
            const res = await managerService.getManagers({ page, per_page: perPage, ...params });
            if (res.success) {
                setManagers(res.data);
                if (res.meta || res.pagination) {
                    const meta = res.meta || res.pagination;
                    setPagination({
                        page: meta.page || page,
                        per_page: meta.per_page || perPage,
                        total: meta.total || 0
                    });
                }
            }
        } catch (error) {
            toast.error("Failed to fetch managers");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchManagers();
    }, [page, perPage]);

    const [formData, setFormData] = useState({
        name: "",
        telegram_username: "",
        profile_photo: ""
    });

    const handleOpenModal = (manager = null) => {
        if (manager) {
            setEditingManager(manager);
            setFormData({ ...manager });
        } else {
            setEditingManager(null);
            setFormData({ name: "", telegram_username: "", profile_photo: "" });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = editingManager
                ? await managerService.updateManager(editingManager.id, formData)
                : await managerService.createManager(formData);

            if (res.success) {
                setIsModalOpen(false);
                toast.success(`Manager ${editingManager ? "updated" : "saved"} successfully!`);
                fetchManagers();
            } else {
                toast.error(res.message || "Failed to save manager");
            }
        } catch (error) {
            toast.error("An error occurred while saving");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await managerService.deleteManager(id);
            if (res.success) {
                toast.success("Manager removed successfully!");
                fetchManagers();
            } else {
                toast.error(res.message || "Failed to remove manager");
            }
        } catch (error) {
            toast.error("An error occurred while deleting");
        }
    };

    const normalizeTelegramUrl = (username) => {
        if (!username) return "";
        const cleanUsername = String(username).trim().replace(/^@/, "");
        if (!cleanUsername) return "";
        return `https://t.me/${cleanUsername}`;
    };

    const columns = [
        {
            header: "Manager",
            key: "name",
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                        {row.profile_photo ? (
                            <img src={getImageUrl(row.profile_photo)} alt={val} className="h-full w-full object-cover" />
                        ) : (
                            <div className="text-[#1a5b7d] font-bold text-lg">{val.charAt(0)}</div>
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-slate-800">{val}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Staff Member</div>
                    </div>
                </div>
            )
        },
        {
            header: "Telegram Username",
            key: "telegram_username",
            render: (val) => {
                const link = normalizeTelegramUrl(val);
                return (
                    <div className="flex items-center gap-2 text-sky-600 font-semibold">
                        <Mail size={14} className="text-sky-400" />
                        {link ? (
                            <a
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-sky-700 transition-colors"
                                title={link}
                            >
                                {val || "-"}
                            </a>
                        ) : (
                            <span>{val || "-"}</span>
                        )}
                    </div>
                );
            }
        },
        {
            header: "Date Created",
            key: "created_at",
            render: (val) => <span className="text-slate-500 text-sm">{formatTableDate(val) || "N/A"}</span>
        },
        {
            header: "Actions",
            key: "id",
            render: (val, row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleOpenModal(row)}
                        className="h-8 w-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center hover:bg-sky-100 transition-colors"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1a5b7d]">Managers</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Configure manager profiles and contact details.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-sky-500 text-white font-bold rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-[0.98]"
                >
                    <UserPlus size={20} />
                    Add Manager
                </button>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <FullWidthTable
                    data={managers}
                    columns={columns}
                    headerBgClass="bg-[#B0E3F2]"
                    loading={isLoading}
                    pagination={{
                        page,
                        per_page: perPage,
                        total: pagination.total
                    }}
                    onPageChange={setPage}
                    onPerPageChange={(n) => { setPerPage(n); setPage(1); }}
                />
            </div>

            {/* Manager Modal */}
            {isModalOpen && (
                <div
                    onMouseDown={() => setIsModalOpen(false)}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                >
                    <div
                        onMouseDown={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                    >
                        <div className="bg-[#1a5b7d] p-6 text-white text-center">
                            <h3 className="text-xl font-bold">{editingManager ? "Edit Manager" : "Create New Manager"}</h3>
                            <p className="text-sky-200/80 text-sm">Fill in the profile and contact details.</p>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-4">
                            <div className="flex justify-center mb-4">
                                <div className="relative group">
                                    <div className="h-24 w-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:bg-slate-100">
                                        {formData.profile_photo ? (
                                            <img src={getImageUrl(formData.profile_photo)} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center text-slate-400">
                                                <UserPlus size={24} />
                                                <span className="text-[10px] font-bold mt-1 uppercase">Photo</span>
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute -bottom-1 -right-1 h-8 w-8 rounded-lg bg-sky-500 text-white flex items-center justify-center cursor-pointer shadow-lg hover:bg-sky-600 transition-colors border-2 border-white">
                                        <Plus size={16} />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const res = await productService.uploadImage(file);
                                                    if (res.success) {
                                                        setFormData({ ...formData, profile_photo: res.data.url });
                                                        toast.success("Photo uploaded!");
                                                    } else {
                                                        toast.error(res.message || "Upload failed");
                                                    }
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-sky-500 outline-none font-semibold text-slate-700 transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Telegram Username</label>
                                <input
                                    type="text"
                                    placeholder="@username"
                                    className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-sky-500 outline-none font-semibold text-slate-700 transition-all"
                                    value={formData.telegram_username}
                                    onChange={(e) => setFormData({ ...formData, telegram_username: e.target.value })}
                                />
                            </div>



                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 h-12 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 h-12 rounded-xl font-bold bg-[#1a5b7d] text-white hover:bg-[#144762] transition-colors shadow-lg shadow-sky-900/10 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSaving && <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                    {editingManager ? "Update Details" : "Create Manager"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerManagement;
