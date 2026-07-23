"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pencil, Trash2, CheckSquare, Square } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { formatDate } from "@/src/lib/date";
import { Task } from "../types";
import EditTaskModal from "./EditTaskModal";
import { deleteTask as deleteTaskAPI, updateTaskStatus } from "../api/task.service";
import { removeTask, updateTask as updateTaskRedux } from "../store/taskSlice";

interface Props {
    task: Task;
    compact?: boolean;
}

export default function TaskCard({ task, compact }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const pathname = usePathname();

    // Builds links relative to whichever section is currently rendering
    // this card (/employee/..., /teamlead/..., /manager/...) instead of
    // hardcoding /employee — this component is now shared across roles.
    const basePath = `/${pathname?.split("/")[1] || "employee"}`;

    const currentUserId =
        useSelector((state: RootState) => state.auth.user?.id);

    const isCreator = task.createdById === currentUserId;
    const isAssignee = task.assignedToId === currentUserId;

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);

    const handleDelete = async () => {
        const ok = window.confirm("Are you sure you want to delete this task?");
        if (!ok) return;

        try {
            setLoading(true);
            await deleteTaskAPI(task.id);
            dispatch(removeTask(task.id));
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async () => {
        if (task.status === "COMPLETED") return;

        try {
            setStatusLoading(true);
            const updated = await updateTaskStatus(task.id, { status: "COMPLETED" });
            dispatch(updateTaskRedux(updated));
        } finally {
            setStatusLoading(false);
        }
    };

    // Aligned strictly with your Candy Capsule Color System
    const priorityStyles: Record<string, string> = {
        LOW: "bg-slate-100 text-slate-600 border-slate-200",
        MEDIUM: "bg-[#3bc4d9]/15 text-[#1092a5] border-[#3bc4d9]/30", // Cyan
        HIGH: "bg-[#fcc419]/20 text-[#b28904] border-[#fcc419]/40",   // Yellow/Amber
        CRITICAL: "bg-[#e64980]/15 text-[#c2215b] border-[#e64980]/30", // Rose/Pink
        default: "bg-slate-100 text-slate-600 border-slate-200"
    };

    const statusStyles: Record<string, string> = {
        PENDING: "bg-slate-100 text-slate-600 border-slate-200",
        IN_PROGRESS: "bg-blue-50 text-blue-600 border-blue-200",
        COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-200",
        CANCELLED: "bg-rose-50 text-rose-600 border-rose-200",
        default: "bg-slate-100 text-slate-600 border-slate-200"
    };

    // Safe style resolving
    const activePriorityStyle = priorityStyles[task.priority] || priorityStyles.default;
    const activeStatusStyle = statusStyles[task.status] || statusStyles.default;

    // Render Compact Style view inside Floating Popover Component Panel
    if (compact) {
        return (
            <div className="py-2 px-3 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between text-[11px] gap-2">
                <Link href={`${basePath}/tasks`} className="flex-1 truncate text-slate-800 font-medium hover:text-slate-900 transition-colors">
                    {task.title}
                </Link>
                <div className="flex gap-1 flex-shrink-0">
                    <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold border ${activeStatusStyle}`}>
                        {task.status}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <>
            <tr className="hover:bg-slate-50/60 transition duration-150 group">
                 <td className="px-5 py-4 font-bold text-slate-800 max-w-[240px] truncate">
                 <Link href={`${basePath}/activities`}>
                    {task.title}
                </Link>
                </td>
                <td className="px-5 py-4">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${activeStatusStyle}`}>
                        {task.status}
                    </span>
                </td>
                <td className="px-5 py-4 min-w-[180px]">
                    <div className="flex justify-between text-[11px] mb-1.5 font-semibold text-slate-400">
                        <span>Progress</span>
                        <span className="font-bold text-slate-700">{task.progress || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-slate-800 rounded-full transition-all duration-500"
                            style={{ width: `${task.progress || 0}%` }}
                        />
                    </div>
                </td>
                <td className="px-5 py-4 text-xs font-semibold text-slate-500">{formatDate(task.startDate)}</td>
                <td className="px-5 py-4 text-xs font-bold text-slate-700">{formatDate(task.dueDate)}</td>
                <td className="px-5 py-4">
                    <span className={`rounded-lg border px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${activePriorityStyle}`}>
                        {task.priority}
                    </span>
                </td>
                <td className="px-5 py-4">
                    <div className="flex justify-center items-center gap-1.5">
                        {isAssignee && (
                            <button
                                disabled={statusLoading || task.status === "COMPLETED"}
                                onClick={handleComplete}
                                className="p-1.5 rounded-xl bg-slate-100/80 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-95 disabled:opacity-40"
                                title={task.status === "COMPLETED" ? "Completed" : "Mark Complete"}
                            >
                                {task.status === "COMPLETED" ? <CheckSquare size={14} /> : <Square size={14} />}
                            </button>
                        )}
                        {isCreator && (
                            <>
                                <button
                                    onClick={() => setOpen(true)}
                                    className="p-1.5 rounded-xl bg-slate-100/80 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-all active:scale-95"
                                    title="Edit Task"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    disabled={loading}
                                    onClick={handleDelete}
                                    className="p-1.5 rounded-xl bg-slate-100/80 text-slate-500 hover:bg-rose-50 hover:text-[#c2215b] transition-all active:scale-95 disabled:opacity-40"
                                    title="Delete Task"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </>
                        )}
                    </div>
                </td>
            </tr>

            <EditTaskModal open={open} task={task} onClose={() => setOpen(false)} />
        </>
    );
}
