"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import FullWidthTable from "@/components/ui/FullWidthTable/FullWidthTable";
import BeautifulConfirmModal from "@/components/ui/BeautifulConfirmModal";
import { useTransactionTemplateStore } from "@/store/useTransactionTemplateStore";

const getLocalDatetime = (value = new Date()) => {
    const date = new Date(value);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
};

const formatTemplateDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours24 = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const suffix = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;

    return `${month}.${day} ${String(hours12).padStart(2, "0")}:${minutes} ${suffix}`;
};

const emptyForm = {
    date: getLocalDatetime(),
    amount: "",
    type: "deposit",
    note: "",
};

export default function TransactionTemplateManagement() {
    const {
        templates,
        isLoading,
        fetchTemplates,
        createTemplate,
        updateTemplate,
        deleteTemplate,
    } = useTransactionTemplateStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    const modalTitle = editingTemplate ? "Update Transaction Template" : "Add Transaction Template";

    const openCreateModal = () => {
        setEditingTemplate(null);
        setFormData({ ...emptyForm, date: getLocalDatetime() });
        setIsModalOpen(true);
    };

    const openEditModal = (template) => {
        setEditingTemplate(template);
        setFormData({
            date: getLocalDatetime(template.date),
            amount: String(template.amount),
            type: template.type,
            note: template.note,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTemplate(null);
        setFormData({ ...emptyForm, date: getLocalDatetime() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.date.trim() || !formData.amount) {
            toast.error("All fields are required");
            return;
        }

        const payload = {
            date: new Date(formData.date).toISOString(),
            amount: Number(formData.amount),
            type: formData.type,
            note: formData.note.trim(),
        };

        const res = editingTemplate
            ? await updateTemplate(editingTemplate.id, payload)
            : await createTemplate(payload);

        if (res.success) {
            toast.success(editingTemplate ? "Template updated successfully" : "Template created successfully");
            closeModal();
            return;
        }

        toast.error(res.message || "Request failed");
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        const res = await deleteTemplate(deleteTarget.id);
        if (res.success) {
            toast.success("Template deleted successfully");
        } else {
            toast.error(res.message || "Failed to delete template");
        }
    };

    const columns = useMemo(() => [
        {
            header: "Date",
            key: "date",
            render: (value) => <span className="font-semibold text-slate-600">{formatTemplateDate(value)}</span>,
        },
        {
            header: "Amount",
            key: "amount",
            render: (value) => <span className="font-bold text-slate-700">${Number(value).toLocaleString()}</span>,
        },
        {
            header: "Type",
            key: "type",
            render: (value) => (
                <span className={`font-bold ${value === "withdraw" ? "text-rose-500" : "text-emerald-500"}`}>
                    {value === "withdraw" ? "Withdraw" : "Deposit"}
                </span>
            ),
        },
        {
            header: "Note",
            key: "note",
            render: (value) => <span className="text-slate-500">{value}</span>,
        },
        {
            header: "Action",
            key: "action",
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(row);
                        }}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                        aria-label="Edit template"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(row);
                        }}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                        aria-label="Delete template"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ], []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-[#1a5b7d]">Transaction Template</h1>
                    <p className="text-sm text-slate-500">
                        Admin can add, update, and delete reusable transaction templates.
                    </p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600"
                >
                    <Plus size={18} />
                    Add Template
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <FullWidthTable
                    data={templates}
                    columns={columns}
                    loading={isLoading}
                    headerBgClass="bg-slate-50"
                    pagination={{
                        page: 1,
                        per_page: templates.length || 10,
                        total: templates.length,
                    }}
                />
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />

                    <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between bg-[#B0E3F2] p-6">
                            <div>
                                <h2 className="text-xl font-bold text-[#1a5b7d]">{modalTitle}</h2>
                                <p className="text-sm font-medium text-[#1a5b7d]/70">Manage template content shown in admin.</p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/50 text-[#1a5b7d] transition hover:bg-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 p-6">
                            <div className="grid gap-5 md:grid-cols-2">
                                <label className="space-y-2">
                                    <span className="ml-1 text-xs font-bold uppercase tracking-wider text-slate-500">Date</span>
                                    <input
                                        type="datetime-local"
                                        value={formData.date}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                                        className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 font-semibold text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white"
                                    />
                                </label>

                                <label className="space-y-2">
                                    <span className="ml-1 text-xs font-bold uppercase tracking-wider text-slate-500">Amount</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                                        placeholder="31000"
                                        className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 font-semibold text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white"
                                    />
                                </label>
                            </div>

                            <label className="space-y-2">
                                <span className="ml-1 text-xs font-bold uppercase tracking-wider text-slate-500">Type</span>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                                    className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 font-semibold text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white"
                                >
                                    <option value="deposit">Deposit</option>
                                    <option value="withdraw">Withdraw</option>
                                </select>
                            </label>

                            <label className="space-y-2">
                                <span className="ml-1 text-xs font-bold uppercase tracking-wider text-slate-500">Note</span>
                                <textarea
                                    value={formData.note}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
                                    placeholder="Deposit via USDT (TRX Tron (TRC20))"
                                    rows={4}
                                    className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 font-medium text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white"
                                />
                            </label>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-2xl bg-sky-500 py-4 font-bold text-white shadow-xl shadow-sky-500/20 transition hover:bg-sky-600 disabled:opacity-70"
                            >
                                {editingTemplate ? "Update Template" : "Create Template"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <BeautifulConfirmModal
                isOpen={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete template?"
                message={deleteTarget ? `This will remove the template for ${deleteTarget.type} ${deleteTarget.amount}.` : ""}
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}
