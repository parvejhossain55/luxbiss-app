import React from "react";

/**
 * AdminStatCard component for the admin dashboard.
 * @param {string} title - The title of the stat (e.g., "User").
 * @param {string|number} value - The main value (e.g., "56").
 * @param {string} trendText - The trend text (e.g., "+0 Today").
 * @param {function} onClick - Optinal click handler.
 */
const AdminStatCard = ({ title, value, trendText, trendColorClass = "text-emerald-500", onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`
                bg-white rounded-xl border border-sky-100 p-6 shadow-sm flex flex-col gap-4 
                ${onClick ? "cursor-pointer hover:shadow-md transition-all active:scale-[0.98]" : ""}
            `}
        >
            <div className="space-y-2">
                <h3 className="text-lg font-medium text-slate-700">{title}</h3>
                <p className="text-4xl font-bold text-slate-900">{value}</p>
            </div>
            <div className={`text-sm font-semibold ${trendColorClass}`}>
                {trendText}
            </div>
        </div>
    );
};

export default AdminStatCard;
