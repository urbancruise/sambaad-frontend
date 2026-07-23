"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { X, Sliders, RefreshCw } from "lucide-react";
import { AppDispatch } from "@/src/lib/store";
import { Task } from "../types";
import { updateTask as updateTaskAPI } from "../api/task.service";
import { updateTask as updateTaskState } from "../store/taskSlice";

type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface Props {
    open: boolean;
    task: Task;
    onClose: () => void;
}

/**
 * FULL EDIT — creator only. Title, priority, dates.
 * Status/progress are intentionally NOT editable here — the assignee
 * updates those via the status control on the task card instead
 * (see TaskStatusControl / updateTaskStatus in task.service.ts).
 * If this modal is opened by a non-creator, the API call will 403.
 */
export default function EditTaskModal({ open, task, onClose }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const [title, setTitle] = useState(task.title);
    const [priority, setPriority] = useState<TaskPriority>((task.priority as TaskPriority) || "MEDIUM");
    const [startDate, setStartDate] = useState(task.startDate ? task.startDate.split("T")[0] : "");
    const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split("T")[0] : "");

    useEffect(() => {
        setMounted(true);
        if (open) {
            setTitle(task.title);
            setPriority((task.priority as TaskPriority) || "MEDIUM");
            setStartDate(task.startDate ? task.startDate.split("T")[0] : "");
            setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
        }
        return () => setMounted(false);
    }, [open, task]);

    if (!open || !mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            setLoading(true);
            const payload = { title, priority, startDate, dueDate };
            const updatedTask = await updateTaskAPI(task.id, payload);
            dispatch(updateTaskState(updatedTask));
            onClose();
        } catch (err) {
            console.error("Failed to update task:", err);
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 select-none">
            <div
                className="absolute inset-0 bg-slate-100/10 backdrop-blur-xs transition-opacity animate-[fadeIn_0.2s_ease-out]"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800/90 bg-white backdrop-blur-xs p-5 md:p-5 text-slate-900 shadow-[0_0_60px_rgba(16,185,129,0.15)] animate-[scaleUp_0.25s_ease-out]">
                <div className="absolute top-0 right-0 w-32 h-[2px] bg-gradient-to-r from-transparent to-cyan-500" />
                <div className="absolute top-0 right-0 w-[2px] h-32 bg-gradient-to-b from-cyan-500 to-transparent" />

                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                            <Sliders size={18} />
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-bold tracking-wide text-black uppercase font-mono">
                                Edit Task
                            </h3>
                            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
                                id: {task.id.slice(0, 8)}...
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-900 border border-slate-800/30 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all duration-200"
                    >
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 font-mono">
                            Title
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 font-mono">
                            Priority
                        </label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as TaskPriority)}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 focus:border-cyan-500/50 focus:outline-none transition-all"
                        >
                            <option value="LOW">LOW</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="HIGH">HIGH</option>
                            <option value="CRITICAL">CRITICAL</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 font-mono">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-cyan-500/50 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 font-mono">
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-cyan-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-2 text-slate-900 border border-slate-200 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all duration-200"
                        >
                            <X size={16} />
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 text-xs font-bold tracking-wide text-white font-mono transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-98 disabled:opacity-40"
                        >
                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                            {loading ? "SAVING..." : "SAVE CHANGES"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
