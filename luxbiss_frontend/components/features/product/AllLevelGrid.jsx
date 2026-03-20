import { Lock } from "lucide-react";

export default function AllLevelGrid({ levels = [], selectedLevel, onSelectLevel, userLevelId, userStatus, currentStepCompleted }) {
    const sortedLevels = [...levels].sort((a, b) => (a.id || 0) - (b.id || 0));
    const groupSize = 10; // Sets of 10 as requested

    // Group based on the currently active/selected level
    const activeLevelId = selectedLevel || userLevelId;
    const activeIndex = sortedLevels.findIndex(l => l.id === activeLevelId);

    // Calculate the current 10-level page (0 for 1-10, 1 for 11-20, etc.)
    const groupIndex = activeIndex >= 0 ? Math.floor(activeIndex / groupSize) : 0;

    const start = groupIndex * groupSize;
    const end = start + groupSize;
    const visibleLevels = sortedLevels.slice(start, end);

    return (
        <section className="rounded-2xl border bg-white p-4 md:p-6 transition-all duration-300">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span>All Levels</span>
                <div className="h-px flex-1 bg-slate-100" />
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                {visibleLevels.map((l, idx) => {
                    const levelId = Number(l.id);
                    const currentId = Number(userLevelId);
                    const isUserLevel = levelId === currentId;
                    const isSelected = levelId === Number(selectedLevel);

                    const nextLevelIdIfFinished = sortedLevels.find((_, i) => Number(sortedLevels[i - 1]?.id) === currentId)?.id;
                    const isNextToUserLevel = levelId === Number(nextLevelIdIfFinished);

                    // A level is UNLOCKED only if:
                    // 1. It is the user's current level AND they haven't finished it yet
                    // 2. It is the NEXT level AND they have finished the current one
                    const isUnlocked = (isUserLevel && !currentStepCompleted) || (isNextToUserLevel && currentStepCompleted);
                    const isLocked = !isUnlocked;

                    return (
                        <button
                            key={l.id}
                            disabled={isLocked}
                            onClick={() => !isLocked && onSelectLevel && onSelectLevel(levelId)}
                            className={`
                                relative rounded-2xl border p-6 text-center font-bold transition-all duration-300 flex flex-col items-center justify-center gap-2
                                ${isSelected
                                    ? "bg-sky-50 border-sky-400 text-sky-700 shadow-sm scale-[1.05]"
                                    : !isLocked
                                        ? "bg-white border-sky-200 text-sky-600 hover:border-sky-300"
                                        : "bg-slate-50 border-slate-100 text-slate-300 opacity-60"}
                                ${isLocked ? "cursor-not-allowed grayscale" : "cursor-pointer"}
                            `}
                        >
                            <span className="text-lg leading-none">{l.name}</span>

                            {isLocked ? (
                                <Lock size={20} className="text-slate-200" />
                            ) : (
                                <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-sky-500 animate-pulse" : "bg-sky-200"}`} />
                            )}

                            {isUserLevel && !isLocked && (
                                <div className="absolute -top-1 -right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500"></span>
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>
        </section>
    );
}
