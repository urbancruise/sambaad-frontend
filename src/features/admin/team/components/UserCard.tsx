"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { OrgUserSummary, UserRole } from "../types";

interface Props {
    user: OrgUserSummary;
}

const roleBadgeStyles: Record<UserRole, string> = {
    SUPER_ADMIN: "bg-slate-900 text-white",
    HOD: "bg-purple-100 text-purple-700",
    ZONAL_HEAD: "bg-purple-100 text-purple-700",
    MANAGER: "bg-cyan-100 text-cyan-700",
    TEAM_LEAD: "bg-amber-100 text-amber-700",
    EMPLOYEE: "bg-slate-100 text-slate-600",
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
    return (
        <Link
            href={`/admin/team/${user.id}`}
            className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
        >
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-800">{user.fullName}</h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${roleBadgeStyles[user.role]}`}>
                            {roleLabels[user.role]}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.isActive
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                        }`}
                    >
                        {user.isActive ? "Active" : "Inactive"}
                    </span>
                    <ChevronRight size={18} className="text-slate-400" />
                </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-xs text-slate-500">Goals</p>
                    <p className="font-semibold text-slate-800">
                        {user.completedGoals}/{user.totalGoals}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-500">Tasks</p>
                    <p className="font-semibold text-slate-800">
                        {user.completedTasks}/{user.totalTasks}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-500">Activities</p>
                    <p className="font-semibold text-slate-800">
                        {user.completedActivities}/{user.totalActivities}
                    </p>
                </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-500">Performance Score</span>
                <span className="font-bold text-emerald-600">{user.performanceScore}</span>
            </div>

            {user.overdueActivities > 0 && (
                <p className="mt-2 text-xs font-semibold text-rose-600">
                    {user.overdueActivities} overdue activit{user.overdueActivities === 1 ? "y" : "ies"}
                </p>
            )}
        </Link>
    );
}