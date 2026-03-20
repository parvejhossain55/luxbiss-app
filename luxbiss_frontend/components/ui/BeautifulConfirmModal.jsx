"use client";

import React from "react";
import { AlertCircle, X, Check } from "lucide-react";

/**
 * BeautifulConfirmModal
 * A premium-looking alternative to the default browser confirm() dialog.
 */
export default function BeautifulConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger" // danger, warning, success, info
}) {
    if (!isOpen) return null;

    const bgColors = {
        danger: "bg-rose-50 text-rose-600 border-rose-100",
        warning: "bg-amber-50 text-amber-600 border-amber-100",
        success: "bg-emerald-50 text-emerald-600 border-emerald-100",
        info: "bg-sky-50 text-sky-600 border-sky-100"
    };

    const btnColors = {
        danger: "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20",
        warning: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20",
        success: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20",
        info: "bg-sky-500 hover:bg-sky-600 shadow-sky-500/20"
    };

    const iconColors = {
        danger: "text-rose-500",
        warning: "text-amber-500",
        success: "text-emerald-500",
        info: "text-sky-500"
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-8 text-center">
                    {/* Icon */}
                    <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${bgColors[variant]} border-4 border-white shadow-sm`}>
                        <AlertCircle size={40} className={iconColors[variant]} />
                    </div>

                    {/* Content */}
                    <h2 className="text-2xl font-black text-slate-800 mb-2">{title}</h2>
                    <p className="text-slate-500 font-medium leading-relaxed px-2">
                        {message}
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3 mt-8">
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all active:scale-[0.98] ${btnColors[variant]}`}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-2xl text-slate-400 font-bold hover:text-slate-600 hover:bg-slate-50 transition-all font-['Inter']"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-xl text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-all"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}
