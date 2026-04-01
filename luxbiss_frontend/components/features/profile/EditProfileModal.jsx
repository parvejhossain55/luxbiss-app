import React, { useState, useEffect } from "react";
import { X, ChevronDown, Camera, Loader2 } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { getImageUrl } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function EditProfileModal({ isOpen, onClose, initialValue, onSubmit }) {
    const { uploadProductImage } = useProductStore();
    const [draft, setDraft] = useState(initialValue || {});
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validations
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size must be less than 2MB");
            return;
        }

        setIsUploading(true);
        try {
            const res = await uploadProductImage(file);
            if (res.success && res.data?.url) {
                setDraft({ ...draft, profile_photo: res.data.url });
                toast.success("Photo uploaded!");
            } else {
                toast.error(res.message || "Failed to upload photo");
            }
        } catch (err) {
            toast.error("An error occurred during upload");
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm overflow-hidden"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEEEEE] bg-[#FAFAFA] flex-shrink-0">
                    <div className="text-sm font-semibold text-[#424242] font-['Plus_Jakarta_Sans']">
                        Edit Personal Information
                    </div>
                    <button onClick={onClose} className="h-8 w-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-[#757575]">
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 pb-6 pt-5 space-y-5 overflow-y-auto custom-scrollbar">
                    {/* Profile Photo Upload */}
                    <div className="flex flex-col items-center gap-4 py-2">
                        <div className="relative group">
                            <div className="h-32 w-32 rounded-full border-4 border-white shadow-md bg-slate-100 overflow-hidden flex items-center justify-center">
                                {isUploading ? (
                                    <Loader2 className="h-10 w-10 text-[#1FB0D8] animate-spin" />
                                ) : draft.profile_photo ? (
                                    <img
                                        src={getImageUrl(draft.profile_photo)}
                                        alt="Profile Preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="text-3xl font-bold text-slate-300">
                                        {draft.fullName?.[0] || "?"}
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-[#1FB0D8] border-2 border-white text-white flex items-center justify-center cursor-pointer hover:bg-[#199abf] transition-colors shadow-sm">
                                <Camera size={20} />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-bold text-[#424242]">Profile Photo</div>
                            <div className="text-[10px] text-[#757575] font-medium uppercase tracking-wider">PNG, JPG or SVG (Max. 2MB)</div>
                        </div>
                    </div>

                    <div className="grid gap-5">
                        <div>
                            <Label>Full Name</Label>
                            <Input
                                placeholder="Enter Full name"
                                value={draft.fullName || ""}
                                onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                                disabled={!!initialValue?.fullName}
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Date of Birth as 3 selects */}
                            <div>
                                <Label>Date of Birth</Label>
                                <div className="flex gap-2">
                                    <select
                                        disabled={!!initialValue?.dob}
                                        value={draft.dob ? draft.dob.split('-')[2] : ""}
                                        onChange={(e) => {
                                            const parts = draft.dob?.split('-') || ["0000", "00", "00"];
                                            parts[2] = e.target.value.padStart(2, '0');
                                            setDraft({ ...draft, dob: parts.join('-') });
                                        }}
                                        className="flex-1 h-10 rounded-md border border-[#EEEEEE] bg-[#FAFAFA] px-2 text-xs text-[#424242] font-semibold outline-none focus:bg-white focus:border-[#1FB0D8] transition-all font-['Plus_Jakarta_Sans'] disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Day</option>
                                        {Array.from({ length: 31 }, (_, i) => (
                                            <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        disabled={!!initialValue?.dob}
                                        value={draft.dob ? draft.dob.split('-')[1] : ""}
                                        onChange={(e) => {
                                            const parts = draft.dob?.split('-') || ["0000", "00", "00"];
                                            parts[1] = e.target.value.padStart(2, '0');
                                            setDraft({ ...draft, dob: parts.join('-') });
                                        }}
                                        className="flex-1 h-10 rounded-md border border-[#EEEEEE] bg-[#FAFAFA] px-2 text-xs text-[#424242] font-semibold outline-none focus:bg-white focus:border-[#1FB0D8] transition-all font-['Plus_Jakarta_Sans'] disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Month</option>
                                        {[
                                            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                                        ].map((m, i) => (
                                            <option key={i} value={(i + 1).toString().padStart(2, '0')}>
                                                {m}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        disabled={!!initialValue?.dob}
                                        value={draft.dob ? draft.dob.split('-')[0] : ""}
                                        onChange={(e) => {
                                            const parts = draft.dob?.split('-') || ["0000", "00", "00"];
                                            parts[0] = e.target.value;
                                            setDraft({ ...draft, dob: parts.join('-') });
                                        }}
                                        className="flex-[1.5] h-10 rounded-md border border-[#EEEEEE] bg-[#FAFAFA] px-2 text-xs text-[#424242] font-semibold outline-none focus:bg-white focus:border-[#1FB0D8] transition-all font-['Plus_Jakarta_Sans'] disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Year</option>
                                        {Array.from({ length: 100 }, (_, i) => {
                                            const year = new Date().getFullYear() - i;
                                            return <option key={year} value={year}>{year}</option>;
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <Label>Gender</Label>

                                <div className="relative">
                                    <select
                                        disabled={!!initialValue?.gender}
                                        value={draft.gender || ""}
                                        onChange={(e) => setDraft({ ...draft, gender: e.target.value })}
                                        className="w-full h-10 appearance-none rounded-md border border-[#EEEEEE] bg-[#FAFAFA] px-3 pr-9 text-xs text-[#424242] font-semibold outline-none focus:bg-white focus:border-[#1FB0D8] transition-all font-['Plus_Jakarta_Sans'] disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <Label>Email Address</Label>
                                <Input
                                    placeholder="Enter email address"
                                    value={draft.email || ""}
                                    onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                                    disabled={!!initialValue?.email}
                                />
                            </div>

                            <div>
                                <Label>Phone Number</Label>
                                <Input
                                    placeholder="Enter phone number"
                                    value={draft.phone || ""}
                                    onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                                    disabled={!!initialValue?.phone}
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Address</Label>
                            <Input
                                placeholder="Enter address"
                                value={draft.address || ""}
                                onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                                disabled={!!initialValue?.address}
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <Label>Country</Label>
                                <Input
                                    placeholder="Enter country"
                                    value={draft.country || ""}
                                    onChange={(e) => setDraft({ ...draft, country: e.target.value })}
                                    disabled={!!initialValue?.country}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-[#EEEEEE] bg-[#FAFAFA] flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-md border border-[#EEEEEE] text-sm font-semibold text-[#757575] hover:bg-slate-200 transition-colors font-['Plus_Jakarta_Sans']"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit(draft)}
                        disabled={isUploading}
                        className="px-8 py-2.5 rounded-md bg-[#1FB0D8] text-sm font-bold text-white hover:opacity-90 transition-opacity font-['Plus_Jakarta_Sans'] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        UPDATE INFORMATION
                    </button>
                </div>
            </div>
        </div>
    );
}

function Label({ children }) {
    return <div className="text-[13px] font-medium text-[#757575] mb-2 font-['Plus_Jakarta_Sans'] uppercase tracking-wider">{children}</div>;
}

function Input({ className = "", ...props }) {
    return (
        <input
            {...props}
            className={`w-full h-10 rounded-md border border-[#EEEEEE] bg-[#FAFAFA] px-3 text-xs text-[#424242] font-semibold outline-none focus:bg-white focus:border-[#1FB0D8] transition-all font-['Plus_Jakarta_Sans'] ${className}`}
        />
    );
}
