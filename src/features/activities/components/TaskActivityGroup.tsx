"use client";

import { useMemo, useState } from "react";
import {
    Calendar,
    Flag,
    Target,
    ChevronDown,
    ChevronRight,
    Plus,
} from "lucide-react";

import { formatDate } from "@/src/lib/date";
import { Task } from "@/src/features/tasks/types";
import { Activity } from "../types";

import ActivityList from "./ActivityList";
import CreateActivityModal from "./CreateActivityModal";

interface Props {
    task: Task;
    activities: Activity[];
    compact?: boolean;
}

export default function TaskActivityGroup({ task, activities }: Props) {
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);

    const taskActivities = useMemo(
        () => activities.filter((activity) => activity.taskId === task.id),
        [activities, task.id]
    );

    return (
        <div className="border border-red-200/70 rounded-3xl bg-gradient-to-b from-white/50 to-slate-100/90 backdrop-blur-xl shadow-md overflow-hidden transition-all duration-200 hover:border-red-600 w-full">
            {/* Header Stream Accordion Toggle Card */}
            <div
                onClick={() => setExpanded(!expanded)}
                className="flex cursor-pointer items-center justify-between p-4 sm:p-5 hover:bg-white/90 select-none transition-colors"
            >
                <div className="min-w-0 pr-4">
                    <p className="text-xs font-bold uppercase tracking-wider">
                        {task.goal?.title || "System Stream Core"}
                    </p>
                    <h3 className="text-base capitalize sm:text-lg font-bold text-black mt-1 truncate">
                        {task.title}
                    </h3>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="rounded-lg bg-blue-700/10 border border-blue-400/30 px-2.5 py-1 text-xs font-bold text-blue-700 uppercase tracking-wide">
                        {task.status}
                    </span>
                    {expanded ? (
                        <ChevronDown size={20} className="text-amber-500" />
                    ) : (
                        <ChevronRight size={20} className="text-slate-700" />
                    )}
                </div>
            </div>

            {/* Inner Expansion Panel */}
            {expanded && (
                <div className="border-t border-slate-800 bg-slate-100/90 p-4 sm:p-5 space-y-4 animate-[fadeIn_0.15s_ease-out]">
                    {/* Horizontal Scannable Metadata Panel Rows */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-900 border-b border-slate-800/60 pb-3">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-slate-800" />
                            <span className="text-black " >{formatDate(task.startDate)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Flag size={16} className="text-slate-800" />
                            <span className="text-black ">{formatDate(task.dueDate)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Target size={16} className="text-slate-800" />
                            <span className="text-black ">
                                Priority: <span className="font-bold text-black ">{task.priority}</span>
                            </span>
                        </div>

                        {task.goal?.goalType && (
                            <div className="text-xs rounded bg-slate-800 px-2 py-0.5 border border-slate-700/50 text-slate-100 font-medium capitalize">
                                {task.goal.goalType}
                            </div>
                        )}
                    </div>

                    {/* Sub-Activities Stream Grid Header */}
                    <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                Target Checkpoints ({taskActivities.length})
                            </span>
                            <button
                                onClick={() => setOpen(true)}
                                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-black  hover:bg-emerald-500 shadow-sm transition-all active:scale-95"
                            >
                                <Plus size={14} />
                                Add Unit
                            </button>
                        </div>

                        {/* Cleaned up wrapper: The table handles its own 10-item scrolling natively now */}
                        <div className="pt-1">
                            <ActivityList activities={taskActivities} />
                        </div>
                    </div>
                </div>
            )}

            <CreateActivityModal
                open={open}
                onClose={() => setOpen(false)}
                taskId={task.id}
            />
        </div>
    );
}