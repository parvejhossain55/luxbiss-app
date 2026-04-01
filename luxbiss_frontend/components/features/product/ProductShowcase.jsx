import React, { useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { Lock, Loader2 } from "lucide-react";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { toast } from "react-hot-toast";
import LevelCompletionModal from "./LevelCompletionModal";

export default function ProductShowcase({
    products = [],
    currentLevel,
    allLevels = [],
    onSelectLevel,
    steps = [],
    selectedStep,
    onSelectStep,
    isLoading,
    userStepId
}) {
    // Reset selected product index (though no longer used for thumbnails, good to keep for state consistency)
    const [setQuantity, setSetQuantity] = useState(() => products[0]?.min_quantity || 1);
    const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

    const { investInProduct, isLoading: isInvesting } = useTransactionStore();
    const { user, fetchMe } = useAuthStore();
    const { openDepositModal, openWithdrawModal } = useModalStore();

    const baseMinQty = products[0]?.min_quantity || 1;
    const incrementQuantity = () => setSetQuantity(prev => prev + 1);
    const decrementQuantity = () => setSetQuantity(prev => prev > baseMinQty ? prev - 1 : baseMinQty);

    const userStepIdx = steps.findIndex(s => s.id === userStepId);

    const [showCompletionModal, setShowCompletionModal] = useState(false);

    // Find next level logic
    const currentLevelIdx = allLevels.findIndex(l => l.id === currentLevel?.id);
    const nextLevel = currentLevelIdx !== -1 && currentLevelIdx < allLevels.length - 1
        ? allLevels[currentLevelIdx + 1]
        : null;

    const isLastStep = steps.length > 0 && selectedStep === steps[steps.length - 1].id;
    const isTierFinished = user?.current_step_completed && isLastStep && user?.level_id === currentLevel?.id;
    const isCompletionModalOpen =
        showCompletionModal || (user?.current_step_completed && isTierFinished && !hasBeenDismissed);

    const handleNextLevel = () => {
        if (nextLevel) {
            onSelectLevel(nextLevel.id);
            // The first step will be automatically selected by the parent component's useEffect
            toast.success(`Welcome to ${nextLevel.name}!`);
        }
    };

    const handleInvest = async () => {
        const isCurrentlyAtUserProgress = currentLevel?.id === user?.level_id && selectedStep === user?.step_id;
        if (user?.current_step_completed && isCurrentlyAtUserProgress) {
            toast.error("You have already completed the investment for this tier step. Click 'Explore Next Tier' to continue.");
            return;
        }

        try {
            const res = await investInProduct({
                level_id: currentLevel?.id,
                step_id: selectedStep,
                quantity: setQuantity
            });

            if (res.success) {
                toast.success("Investment successful!");
                // Refresh user data to see updated balance and progress
                await fetchMe();

                // Show Level Completion Modal immediately if this was the LAST step of the level
                if (isLastStep) {
                    setShowCompletionModal(true);
                }
            } else {
                if (res.message === "Insufficient balance") {
                    openDepositModal("Your current balance is insufficient to complete this investment. Please deposit funds to continue.");
                } else {
                    toast.error(res.message || "Failed to complete investment");
                }
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        }
    };

    return (
        <section className="rounded-2xl border bg-white p-4 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-start gap-4 border-b border-slate-100 pb-4">
                <div className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3 shrink-0 min-w-[140px] whitespace-nowrap">
                    <div className="w-1.5 h-5 bg-sky-500 rounded-full" />
                    {currentLevel?.name || "Level Products"}
                </div>
            </div>

            {isLoading ? (
                <div className="py-24 flex flex-col justify-center items-center gap-4">
                    <div className="h-10 w-10 rounded-full border-4 border-sky-500/10 border-t-sky-500 animate-spin" />
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading Catalog...</span>
                </div>
            ) : products.length === 0 ? (
                <div className="py-24 text-center text-slate-400 font-bold border-2 border-dashed border-slate-100 rounded-2xl mt-6 bg-slate-50/50 flex flex-col items-center gap-3">
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                        <Lock size={20} className="text-slate-300" />
                    </div>
                    <span>No active products found for this section.</span>
                </div>
            ) : (
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                        {products.map((p) => (
                            <div
                                key={p.id}
                                className="group flex flex-col bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 hover:border-sky-100 overflow-hidden mx-auto w-full max-w-[420px]"
                            >
                                {/* Product Image Section */}
                                <div className="h-[280px] bg-slate-50 flex items-center justify-center relative overflow-hidden">
                                    {p.image_url ? (
                                        <Image
                                            src={getImageUrl(p.image_url)}
                                            alt={p.name}
                                            width={400}
                                            height={280}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 opacity-20">
                                            <div className="text-6xl">📦</div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">No Image</span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info Section */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-sky-600 transition-colors">
                                            {p.name}
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-5">
                                        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-50 flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</span>
                                            <span className="text-lg font-black text-[#1a5b7d]">${p.price}</span>
                                        </div>
                                        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-50 flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-lg font-black text-slate-800">{p.rating || "5.0"}</span>
                                                <span className="text-amber-500 text-sm">★</span>
                                            </div>
                                        </div>
                                    </div>

                                    {p.description && (
                                        <p className="text-[13px] text-slate-500 leading-relaxed font-medium line-clamp-2">
                                            {p.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Panel */}
                    <div className="sticky top-6 flex flex-col gap-6">
                        <div className="bg-[#1a5b7d] rounded-[32px] p-8 text-white shadow-2xl shadow-sky-900/20 relative overflow-hidden group">
                            {/* Decorative element */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black uppercase tracking-widest leading-none">Investment Summary</h2>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {products.map((p) => (
                                        <div key={p.id} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-bold truncate pr-4">{p.name}</span>
                                                <span className="text-[10px] text-sky-200 opacity-80 uppercase font-black">
                                                    ${p.price} × {setQuantity}
                                                </span>
                                            </div>
                                            <span className="text-xs font-black shrink-0">
                                                ${(p.price * setQuantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Quantity Selector */}
                                <div className="flex items-center justify-between mb-6 bg-white/5 rounded-2xl p-4 border border-white/10">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-sky-200">Bundle Multiply</span>
                                        <span className="text-[10px] text-white/60 font-medium">Scaling investment</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={decrementQuantity}
                                            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white font-black"
                                        >
                                            −
                                        </button>
                                        <span className="text-sm font-black w-4 text-center">{setQuantity}</span>
                                        <button
                                            onClick={incrementQuantity}
                                            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white font-black"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-black/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 mb-8">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-sky-200">Total Value</span>
                                    </div>
                                    <div className="text-3xl font-black tracking-tighter flex items-start">
                                        <span className="text-lg mt-1 mr-0.5">$</span>
                                        {(products.reduce((acc, p) => acc + (p.price * setQuantity), 0)).toFixed(2)}
                                    </div>
                                </div>

                                <button
                                    onClick={isTierFinished ? handleNextLevel : handleInvest}
                                    disabled={isInvesting || (!isTierFinished && user?.current_step_completed && selectedStep === user?.step_id)}
                                    className="w-full h-16 rounded-2xl bg-white text-[#1a5b7d] font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-sky-50 transition-all active:scale-[0.98] hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed px-4 text-center"
                                >
                                    {isInvesting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : isTierFinished ? (
                                        "Explore Next Tier"
                                    ) : (user?.current_step_completed && selectedStep === user?.step_id) ? (
                                        "Step Completed"
                                    ) : (
                                        "Invest Now"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <LevelCompletionModal
                isOpen={isCompletionModalOpen}
                onClose={() => {
                    setShowCompletionModal(false);
                    setHasBeenDismissed(true);
                }}
                onContinue={() => {
                    setShowCompletionModal(false);
                    setHasBeenDismissed(true);
                    handleNextLevel();
                }}
                onWithdraw={() => {
                    setShowCompletionModal(false);
                    openWithdrawModal();
                }}
                hasNextLevel={!!nextLevel}
            />
        </section>
    );
}
