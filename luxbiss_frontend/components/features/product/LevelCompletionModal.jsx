import React from "react";
import { X, CheckCircle2, AlertTriangle, Sparkles, Heart } from "lucide-react";

export default function LevelCompletionModal({ isOpen, onClose, onContinue, onWithdraw, hasNextLevel }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
            <div
                className="w-full max-w-[500px] bg-white rounded-[32px] shadow-2xl shadow-sky-900/20 overflow-hidden animate-in zoom-in duration-300 relative"
                style={{ padding: '0' }}
            >
                {/* Decorative background */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-sky-500 to-indigo-600 opacity-10 pointer-events-none" />
                <div className="absolute top-10 right-10 w-24 h-24 bg-sky-400 rounded-full blur-3xl opacity-20 animate-pulse pointer-events-none" />

                <div className="p-8 relative">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>

                    {/* Content */}
                    <div className="flex flex-col items-center text-center mt-4">
                        <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Sparkles size={40} />
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 mb-2 font-['Plus_Jakarta_Sans']">
                            Level Completed!
                        </h2>

                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-px w-8 bg-slate-100" />
                            <div className="flex items-center gap-1 text-emerald-600">
                                <CheckCircle2 size={16} />
                                <span className="text-xs font-black uppercase tracking-widest">100% Success</span>
                            </div>
                            <div className="h-px w-8 bg-slate-100" />
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center justify-center gap-2">
                                    Thank You! <Heart size={18} className="text-rose-500 fill-rose-500" />
                                </h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                    We sincerely appreciate your active participation and strategic investment. You have successfully scaled this tier!
                                </p>
                            </div>

                            <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl text-left relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-10 text-amber-500 group-hover:scale-110 transition-transform">
                                    <AlertTriangle size={40} />
                                </div>
                                <div className="flex items-center gap-2 text-amber-700 font-black text-[11px] uppercase tracking-widest mb-2">
                                    <AlertTriangle size={14} />
                                    <span>Withdrawal Warning</span>
                                </div>
                                <p className="text-[13px] text-amber-800 font-medium leading-[20px] relative z-10">
                                    Your withdrawal limit is now <span className="text-emerald-600 font-bold">Unlocked</span>.
                                    <br /><br />
                                    <span className="font-bold underline text-rose-700 italic">Attention:</span> Starting a new investment in the <span className="font-bold">Next Level</span> will lock your withdrawals again until that tier is finished.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={hasNextLevel ? onContinue : onClose}
                                className="w-full h-[56px] bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl active:scale-[0.98] transition-all"
                            >
                                {hasNextLevel ? "Explore Next Tier" : "Got it"}
                            </button>

                            <button
                                onClick={onWithdraw}
                                className="w-full h-[56px] bg-sky-50 hover:bg-sky-100 text-sky-600 font-black uppercase tracking-[0.2em] text-xs rounded-2xl active:scale-[0.98] transition-all border border-sky-100"
                            >
                                Withdraw Funds
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
