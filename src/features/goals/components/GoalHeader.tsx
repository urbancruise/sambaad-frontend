"use client";

import { Calendar, Flag, Target } from "lucide-react";
import { formatDate } from "@/src/lib/date";
import { Goal } from "../types";

interface Props {
    goal: Goal;
}

export default function GoalHeader({ goal }: Props) {
    const statusColor = {
        PENDING: "bg-yellow-100 text-yellow-700",
        IN_PROGRESS: "bg-blue-100 text-blue-700",
        COMPLETED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700",
    };

    return (
        <div className="w-full space-y-1.5 py-1">
            {/* Top Row: Title -> Progress Bar -> Status */}
            <div className="flex items-center justify-between gap-6">
                {/* Goal Title & Optional Short Description */}
                <div className="min-w-0 flex-shrink-0">
                    <h2 className="text-[25px] font-bold capitalize leading-tight truncate">
                        {goal.title}
                    </h2>
                    {goal.description && (
                        <p className="text-[15px] text-slate-500 truncate max-w-sm leading-none mt-0.5">
                            {goal.description}
                        </p>
                    )}
                </div>

                {/* Progress Bar Area: Embedded Directly Between Title and Status */}
                <div className="flex-1 flex items-center gap-3 max-w-md min-w-[150px]">
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                            style={{
                                width: `${goal.progress}%`,
                            }}
                        />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 min-w-[38px] text-right">
                        {goal.progress}%
                    </span>
                </div>

                {/* Status Badge */}
                <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold flex-shrink-0 ${
                        statusColor[goal.status as keyof typeof statusColor]
                    }`}
                >
                    {goal.status}
                </span>
            </div>

            {/* Bottom Row: Core Metrics aligned on a single horizontal line */}
            <div className="flex items-center flex-wrap gap-x-6 text-sm text-slate-600 pt-0.5">
                {/* Start Date */}
                <div className="flex items-center gap-1.5">
                    <Calendar size={15} className="text-slate-700" />
                    <span>{formatDate(goal.startDate)}</span>
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-1.5">
                    <Flag size={15} className="text-slate-700" />
                    <span>{formatDate(goal.dueDate)}</span>
                </div>

                {/* Goal Type */}
                <div className="flex items-center gap-1.5">
                    <Target size={15} className="text-slate-700" />
                    <span className="capitalize">{goal.goalType}</span>
                </div>

                {/* Priority Status */}
                <div className="flex items-center gap-1">
                    <span className="text-slate-700">Priority :</span>
                    <span className="font-semibold text-slate-800">
                        {goal.priority}
                    </span>
                </div>
            </div>
        </div>
    );
}