"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TeamLeadSummary } from "../type";

interface Props {
    teamLead: TeamLeadSummary;
}

export default function TeamLeadCard({ teamLead }: Props) {
    return (
        <Link
            href={`/manager/team/${teamLead.id}`}
            className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
        >
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">{teamLead.fullName}</h3>
                    <p className="text-sm text-slate-500">{teamLead.email}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            teamLead.isActive
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                        }`}
                    >
                        {teamLead.isActive ? "Active" : "Inactive"}
                    </span>
                    <ChevronRight size={18} className="text-slate-400" />
                </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-xs text-slate-500">Goals</p>
                    <p className="font-semibold text-slate-800">
                        {teamLead.completedGoals}/{teamLead.totalGoals}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-500">Tasks</p>
                    <p className="font-semibold text-slate-800">
                        {teamLead.completedTasks}/{teamLead.totalTasks}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-500">Activities</p>
                    <p className="font-semibold text-slate-800">
                        {teamLead.completedActivities}/{teamLead.totalActivities}
                    </p>
                </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-500">Performance Score</span>
                <span className="font-bold text-emerald-600">{teamLead.performanceScore}</span>
            </div>

            {teamLead.overdueActivities > 0 && (
                <p className="mt-2 text-xs font-semibold text-rose-600">
                    {teamLead.overdueActivities} overdue activit{teamLead.overdueActivities === 1 ? "y" : "ies"}
                </p>
            )}
        </Link>
    );
}
