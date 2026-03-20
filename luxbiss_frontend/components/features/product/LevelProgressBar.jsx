import { CheckCircle2, AlertTriangle } from "lucide-react";

export default function LevelProgressBar({ userLevel, userStep, totalSteps = 10, currentStepIndex = 1, progressValue }) {
    const progress = typeof progressValue === 'number'
        ? progressValue
        : totalSteps > 0 ? Math.round((currentStepIndex / totalSteps) * 100) : 0;

    const isCompleted = progress >= 100;

    return (
        <section className="rounded-2xl border bg-white px-4 py-3 md:px-6 md:py-4 transition-all duration-500 overflow-hidden relative">
            {isCompleted && (
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            )}

            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-8 items-center">
                {/* left small progress */}
                <div className="flex items-center gap-4">
                    <div className="min-w-0 w-full">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] font-['Plus_Jakarta_Sans']">
                                {userLevel?.name || "Level 01"} Progress
                            </div>
                            {isCompleted && (
                                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
                                    <CheckCircle2 size={12} />
                                    Completed
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-sky-500'}`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className={`text-xs font-black ${isCompleted ? 'text-emerald-600' : 'text-sky-600'} w-9`}>
                                {progress}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Section */}
                <div className="md:border-l md:pl-8">
                    {isCompleted ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-500">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <span className="text-base">Level Completed Successfully!</span>
                                </div>
                                <p className="text-[14px] text-slate-600 font-medium ml-10">
                                    Thank you for your active participation. You have reached the maximum potential for this tier.
                                </p>
                            </div>


                        </div>
                    ) : (
                        <div className="text-[13px] text-slate-500 font-medium leading-[22px] font-['Inter']">
                            After completing your current level, your next level will be unlocked
                            automatically. As your level increases, your profits will also
                            increase. <span className="text-sky-500 font-bold">Keep investing to unlock withdrawals.</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
