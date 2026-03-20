import React from "react";

export default function WalletStatCard({ title, value, tone, icon }) {
    const toneStyles = {
        sky: { icon: "text-[#00A3FF]", bg: "bg-[#00A3FF]/10" },
        emerald: { icon: "text-[#10B981]", bg: "bg-[#10B981]/10" },
        orange: { icon: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
        rose: { icon: "text-[#FF4A55]", bg: "bg-[#FF4A55]/10" },
        sky2: { icon: "text-[#38BDF8]", bg: "bg-[#38BDF8]/10" },
    }[tone];

    return (
        <div className="rounded-2xl border border-[#EEEEEE] bg-white p-6 shadow-sm flex flex-col gap-4">
            <div className={`h-[44px] w-[44px] rounded-full ${toneStyles.bg} flex items-center justify-center ${toneStyles.icon}`}>
                {icon}
            </div>

            <div className="space-y-1">
                <div className="text-xs font-medium text-[#757575] font-['Plus_Jakarta_Sans']">
                    {title}
                </div>
                <div className="text-[24px] font-bold text-[#111827] font-['Plus_Jakarta_Sans'] leading-tight">
                    {value}
                </div>
            </div>
        </div>
    );
}
