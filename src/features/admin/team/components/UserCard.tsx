"use client";

import Link from "next/link";
import { OrgUserSummary, UserRole } from "../types";

interface Props {
    user: OrgUserSummary;
}

const roleBadgeStyles: Record<UserRole, string> = {
    SUPER_ADMIN: "bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100",
    HOD: "bg-slate-800 text-white dark:bg-slate-700 dark:text-slate-100",
    ZONAL_HEAD: "bg-slate-800 text-white dark:bg-slate-700 dark:text-slate-100",
    MANAGER: "bg-cyan-700 text-white dark:bg-cyan-600",
    TEAM_LEAD: "bg-slate-700 text-white dark:bg-slate-600",
    EMPLOYEE: "bg-slate-800 text-white dark:bg-slate-700 dark:text-slate-100",
};

const roleLabels: Record<UserRole, string> = {
    SUPER_ADMIN: "Super Admin",
    HOD: "HOD",
    ZONAL_HEAD: "Zonal Head",
    MANAGER: "Manager",
    TEAM_LEAD: "TeamLead",
    EMPLOYEE: "Employee",
};

export default function UserCard({ user }: Props) {
    // Generate initials or fallback avatar if user image isn't available
    const initials = user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    return (
        <Link
            href={`/admin/team/${user.id}`}
            className="block rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition text-left dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
        >
            {/* Top row: Avatar, Name, Role badge, Status */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600 text-xs dark:bg-slate-800 dark:text-slate-300">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm font-bold text-slate-800 truncate dark:text-slate-100">{user.fullName}</h3>
                            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${roleBadgeStyles[user.role]}`}>
                                {roleLabels[user.role]}
                            </span>
                        </div>
                    </div>
                </div>

                <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold flex-shrink-0 ${
                        user.isActive
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                >
                    {user.isActive ? "Active" : "Inactive"}
                </span>
            </div>

            {/* Metrics Row with vertical separators */}
            <div className="mt-4 grid grid-cols-3 text-center border-t border-b border-slate-100 py-2.5 dark:border-slate-800">
                <div className="border-r border-slate-100 px-1 dark:border-slate-800">
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">Goals</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5 dark:text-slate-200">
                        {user.completedGoals}/{user.totalGoals}
                    </p>
                </div>
                <div className="border-r border-slate-100 px-1 dark:border-slate-800">
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">Tasks</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5 dark:text-slate-200">
                        {user.completedTasks}/{user.totalTasks}
                    </p>
                </div>
                <div className="px-1">
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">Activities</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5 dark:text-slate-200">
                        {user.completedActivities ?? user.totalActivities}
                    </p>
                </div>
            </div>

            {/* Performance Score and mini graph indicator visual representation */}
            <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] dark:text-slate-500">Performance Score</span>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{user.performanceScore}</span>
                    {/* Visual mini bar graph representation matching the reference image style */}
                    <div className="flex items-end gap-0.5 h-3">
                        <span className="w-0.5 bg-emerald-500 h-1.5 rounded-full dark:bg-emerald-400"></span>
                        <span className="w-0.5 bg-emerald-500 h-2 rounded-full dark:bg-emerald-400"></span>
                        <span className="w-0.5 bg-emerald-500 h-2.5 rounded-full dark:bg-emerald-400"></span>
                        <span className="w-0.5 bg-emerald-500 h-3 rounded-full dark:bg-emerald-400"></span>
                    </div>
                </div>
            </div>

            {user.overdueActivities > 0 && (
                <p className="mt-2 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                    {user.overdueActivities} overdue activit{user.overdueActivities === 1 ? "y" : "ies"}
                </p>
            )}
        </Link>
    );
}