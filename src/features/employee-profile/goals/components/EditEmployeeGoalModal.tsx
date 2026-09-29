"use client";

import { useState } from "react";
import { X, Sliders, Loader2 } from "lucide-react";

import { EmployeeGoal } from "../types";
import { updateEmployeeGoal } from "../api/goal.service";

interface Props {
    open: boolean;
    goal: EmployeeGoal;
    onClose: () => void;
    onUpdated: () => void;
}

const GOAL_TYPES = ["LONG_TERM", "ONGOING", "URGENT"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function EditEmployeeGoalModal({ open, goal, onClose, onUpdated }: Props) {
    const [title, setTitle] = useState(goal.title);
    const [description, setDescription] = useState(goal.description ?? "");
    const [goalType, setGoalType] = useState(goal.goalType);
    const [priority, setPriority] = useState(goal.priority);
    const [startDate, setStartDate] = useState(goal.startDate?.split("T")[0] ?? "");
    const [dueDate, setDueDate] = useState(goal.dueDate?.split("T")[0] ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !startDate || !dueDate) return;

        try {
            setLoading(true);
            setError(null);
            await updateEmployeeGoal(goal.id, {
                title,
                description,
                goalType,
                priority,
                startDate,
                dueDate,
            });
            onUpdated();
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to update goal.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <Sliders size={18} className="text-cyan-500" />
                        <h2 className="text-lg font-bold text-slate-800">Edit Goal</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                        <X size={16} />
                    </button>
                </div>

                {error && (
                    <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label>
                        <input
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-cyan-500 focus:outline-none resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Goal Type</label>
                            <select
                                value={goalType}
                                onChange={(e) => setGoalType(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                            >
                                {GOAL_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                            >
                                {PRIORITIES.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date *</label>
                            <input
                                type="date"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Due Date *</label>
                            <input
                                type="date"
                                required
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-600 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-60"
                    >
                        {loading && <Loader2 size={14} className="animate-spin" />}
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
