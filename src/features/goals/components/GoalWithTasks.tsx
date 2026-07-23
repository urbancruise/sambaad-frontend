"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react"; 
import { Goal } from "../types";
import { Task } from "../../tasks/types";
import GoalActions from "./GoalActions";
import TaskCard from "../../tasks/components/TaskCard";
import { formatDate } from "@/src/lib/date";

// 1. Explicitly type the theme object structure so TypeScript knows what values to expect
interface ThemeProps {
    btnBg: string;
    textColor: string;
    borderColor: string;
    ringColor: string;
}
const priorityColors = {
  LOW: "bg-blue-50 text-blue-600 border border-blue-200",
  MEDIUM: "bg-amber-50 text-amber-600 border border-amber-200",
  HIGH: "bg-orange-50 text-orange-600 border border-orange-200",
  CRITICAL: "bg-red-50 text-red-600 border border-red-200 uppercase tracking-wider animate-pulse", // added punch to Critical
};

const goalTypeColors = {
  LONG_TERM: "bg-purple-50 text-purple-600 border border-purple-200",
  ONGOING: "bg-teal-50 text-teal-600 border border-teal-200",
  URGENT: "bg-rose-50 text-rose-600 border border-rose-200",
};


const themeConfig: Record<string, ThemeProps> = {
    LONG_TERM: {
        btnBg: "bg-[#3bc4d9] hover:bg-[#2eb0c4]",
        textColor: "text-[#1092a5]",
        borderColor: "border-[#3bc4d9]",
        ringColor: "stroke-[#3bc4d9]"
    },
    ONGOING: {
        btnBg: "bg-[#fcc419] hover:bg-[#e5b212]",
        textColor: "text-[#b28904]",
        borderColor: "border-[#fcc419]",
        ringColor: "stroke-[#fcc419]"
    },
    URGENT: {
        btnBg: "bg-[#e64980] hover:bg-[#d4376f]",
        textColor: "text-[#c2215b]",
        borderColor: "border-[#e64980]",
        ringColor: "stroke-[#e64980]"
    },
    default: {
        btnBg: "bg-slate-400 hover:bg-slate-500",
        textColor: "text-slate-600",
        borderColor: "border-slate-400",
        ringColor: "stroke-slate-400"
    }
};

interface Props {
    goal: Goal;
    tasks: Task[];
    onEditSelect: () => void;
}

export default function GoalWithTasks({ goal, tasks, onEditSelect }: Props) {
    const [isExpanded, setIsExpanded] = useState(false);

    const goalTypeKey = goal.goalType? String(goal.goalType) : "default";
    const theme = themeConfig[goalTypeKey] || themeConfig.default;

    const completedTasks = tasks.filter(t => t.status === "COMPLETED").length;
    const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    return (
        <div className="relative bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 flex flex-col justify-between min-h-[280px]">
            
            {/* Click-Away Handler Backdrop Overlay for Floating Popover Modal */}
            {isExpanded && (
                <div 
                    className="fixed inset-0 z-20 bg-transparent" 
                    onClick={() => setIsExpanded(false)}
                />
            )}

            <div>
                <div className="flex justify-between items-center mb-3 gap-2">
  <div className="flex gap-2">
    {/* Priority Badge */}
    <span className={`text-xs  font-bold px-2 py-0.5 rounded-md ${
      goal.priority ? priorityColors[goal.priority] : "bg-slate-100 text-slate-500"
    }`}>
      {goal.priority ? `${goal.priority}` : "No Priority"}
    </span>

    <span className={`text-xs font-bold px-1 py-0.5 rounded-md ${
      goal.goalType ? goalTypeColors[goal.goalType] : "bg-slate-100 text-slate-500"
    }`}>
      {goal.goalType ? goal.goalType.replace('_', ' ') : "Goal Type"}
    </span>
  </div>
  
  {/* <GoalActions goal={goal} onEditClick={onEditSelect} /> */}
</div>

                {/* Main Heading Label */}
                <h2 className="text-[20px]  capitalize font-bold text-slate-800 mb-4 tracking-tight line-clamp-1">
                    {goal.title || "Untitled Objective"}
                </h2>

                {/* Structural Sub-Counters & Radial Metrics Progress Ring Row */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-full border-[3.5px] ${theme.borderColor} flex items-center justify-center font-black text-slate-800 text-lg`}>
                            {tasks.length}
                        </div>
                        <span className="text-slate-500 text-s font-medium tracking-wide">tasks</span>
                    </div>

                    {/* Circular Percentage Vector Chart Mapping Container */}
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="stroke-slate-100"
                                strokeWidth="3.5"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className={`${theme.ringColor} transition-all duration-500`}
                                strokeDasharray={`${progressPercent}, 100`}
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <span className="absolute text-[11px] font-bold text-slate-600">{progressPercent}%</span>
                    </div>
                </div>

                {/* Substantive Description Context Display Label */}
                <p className="text-slate-500 text-s leading-relaxed mb-6 line-clamp-2">
                    {goal.description || "No description assigned."}
                </p>
            </div>

            {/* Bottom Actions Framework Row */}
            <div className="flex justify-between items-end pt-2 border-t border-slate-50">
                <div className="relative">
                    {/* Floating Dropdown Toggle Switch */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-slate-900 shadow-sm transition-all active:scale-95 text-s ${theme.btnBg} z-10 relative`}
                    >
                        <span>Task</span>
                        <ChevronDown size={15} className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                    </button>

                    {/* Absolute Floating Popover Window Context Container */}
                    {isExpanded && (
                        <div className="absolute left-0 bottom-full mb-3 w-[280px] bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-30 p-3 max-h-[240px] overflow-y-auto space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 px-2 pb-1 border-b border-slate-50">
                                Target Subunits
                            </h4>
                            {tasks.length === 0 ? (
                                <p className="text-xs text-slate-400 italic p-2 text-center">No structural subunits configured.</p>
                            ) : (
                                tasks.map((task) => (
                                    <TaskCard key={task.id} task={task} compact={true} />
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Calendar Operational Timeline Bounds Grid */}
                <div className="text-[13px] font-semibold text-slate-500 text-right space-y-0.5">
                    <div>Start date: <span className="text-slate-700 font-bold">{goal.startDate ? formatDate(goal.startDate) : "01/10/2023"}</span></div>
                    <div>End date: <span className="text-slate-700 font-bold">{goal.dueDate || goal.dueDate ? formatDate(goal.dueDate || goal.dueDate) : "31/12/2023"}</span></div>
                </div>
            </div>

        </div>
    );
}