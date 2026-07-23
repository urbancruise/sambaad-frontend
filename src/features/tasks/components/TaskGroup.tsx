"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Layers, Plus } from "lucide-react";
import { Goal } from "@/src/features/goals/types";
import { Task } from "../types";
import CreateTaskModal from "./CreateTaskModal";
import TaskCard from "./TaskCard";
import Link from "next/link";

// 1. Dynamic Capsule Theme Config for Group Headers
interface GroupThemeProps {
    badgeBg: string;
    badgeText: string;
    accentColor: string;
}

const groupThemeConfig: Record<string, GroupThemeProps> = {
    longTerm: {
        badgeBg: "bg-[#3bc4d9]/15",
        badgeText: "text-[#1092a5]",
        accentColor: "group-hover:text-[#1092a5]"
    },
    onGoing: {
        badgeBg: "bg-[#fcc419]/20",
        badgeText: "text-[#b28904]",
        accentColor: "group-hover:text-[#b28904]"
    },
    urgent: {
        badgeBg: "bg-[#e64980]/15",
        badgeText: "text-[#c2215b]",
        accentColor: "group-hover:text-[#c2215b]"
    },
    default: {
        badgeBg: "bg-slate-100",
        badgeText: "text-slate-600",
        accentColor: "group-hover:text-slate-800"
    }
};

interface Props {
    goal: Goal;
    tasks: Task[];
}


export default function TaskGroup({ goal, tasks }: Props) {
    const handleClick = ()=>{
        // tasks.map((task)=>{
        //     if(task.id)
        // })
        setOpen(!open)
    }
 
    const [open, setOpen] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);

    // Safe lookup without indexing errors
    const lookupKey = String(goal.goalType || (goal as any).goalType || "default");
    const theme = groupThemeConfig[lookupKey] || groupThemeConfig.default;

    return (
        <div className="overflow-hidden rounded-3xl border border-slate-100/80 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-200">
            
            {/* Header Core Panel */}
            <div 
                onClick={handleClick}
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50/60 transition-all duration-150 select-none group"
            >
                <div className="flex items-center gap-3 flex-1">
                    <div className={`text-slate-400 transition-colors ${theme.accentColor}`}>
                        {open ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    
                    <div className="flex items-center gap-2.5">
                        <Layers size={18} className={`text-slate-400 transition-colors ${theme.accentColor}`} />
                        <span className="text-base font-bold capitalize tracking-tight text-slate-800 transition-colors">
                            {goal.title || "Untitled Objective"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <span className={`rounded-full px-3 py-1 text-xs font-black tracking-wide ${theme.badgeBg} ${theme.badgeText}`}>
                        {tasks.length} TASK{tasks.length !== 1 ? "S" : ""}
                    </span>

                    <button
                        onClick={() => setOpenCreate(true)}
                        className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-bold transition-all active:scale-95 shadow-sm"
                    >
                        <Plus size={14} /> Add Task
                    </button>
                </div>
            </div>

            {/* Expanded Table Control Grid */}
            {open && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                    <div className="border-t border-slate-100" />
                    <div className="p-4 bg-slate-50/40">
                        {tasks.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-8 text-center text-xs font-semibold tracking-wide text-slate-400">
                                No tasks linked to this objective yet.
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
                                <table className="min-w-[900px] w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-400 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider">
                                            <th className="px-5 py-3.5 text-left">Objective Title</th>
                                            <th className="px-5 py-3.5 text-left">Status</th>
                                            <th className="px-5 py-3.5 text-left">Metrics Progress</th>
                                            <th className="px-5 py-3.5 text-left">Launch Date</th>
                                            <th className="px-5 py-3.5 text-left">Target Date</th>
                                            <th className="px-5 py-3.5 text-left">Priority</th>
                                            <th className="px-5 py-3.5 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                   <tbody className="divide-y divide-slate-100">
                                       {tasks.map((task) => (
                                            <TaskCard key={task.id} task={task} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <CreateTaskModal
                open={openCreate}
                goalId={goal.id}
                onClose={() => setOpenCreate(false)}
            />
        </div>
    );
}