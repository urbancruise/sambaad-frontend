"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { X, ListTodo, Loader2 } from "lucide-react";

import { createEmployeeTask } from "../api/task.service";
import { useEmployeeGoals } from "../../goals/hooks/useEmployeeGoals";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
    defaultGoalId?: string;
    defaultTaskId?: string;
}

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function CreateEmployeeTaskModal({ open, onClose, onCreated, defaultGoalId, defaultTaskId }: Props) {
    const { employeeId } = useParams<{ employeeId: string }>();
    const { goals } = useEmployeeGoals();

    const [goalId, setGoalId] = useState(defaultGoalId ?? "");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("MEDIUM");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [estimatedHours, setEstimatedHours] = useState<number | "">("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!open) return null;

    const effectiveGoalId = defaultGoalId ?? goalId;

    const reset = () => {
        if (!defaultGoalId) setGoalId("");
        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        setStartDate("");
        setDueDate("");
        setEstimatedHours("");
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !effectiveGoalId || !startDate || !dueDate || !employeeId) return;

        try {
            setLoading(true);
            setError(null);
            await createEmployeeTask(employeeId, {
                goalId: effectiveGoalId,
                title,
                description,
                priority,
                startDate,
                dueDate,
                estimatedHours: estimatedHours === "" ? undefined : estimatedHours,
            });
            reset();
            onCreated();
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to create task.");
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
                        <ListTodo size={18} className="text-blue-500" />
                        <h2 className="text-lg font-bold text-slate-800">Assign New Task</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                        <X size={16} />
                    </button>
                </div>

                {error && (
                    <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!defaultGoalId && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Goal *</label>
                            <select
                                required
                                value={goalId}
                                onChange={(e) => setGoalId(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Select this employee's goal</option>
                                {goals.map((g) => (
                                    <option key={g.id} value={g.id}>{g.title}</option>
                                ))}
                            </select>
                            {goals.length === 0 && (
                                <p className="mt-1 text-xs text-slate-400">
                                    This employee has no goals yet — create a goal first.
                                </p>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label>
                        <input
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                            >
                                {PRIORITIES.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Est. Hours</label>
                            <input
                                type="number"
                                min={0}
                                value={estimatedHours}
                                onChange={(e) => setEstimatedHours(e.target.value ? Number(e.target.value) : "")}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
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
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Due Date *</label>
                            <input
                                type="date"
                                required
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading && <Loader2 size={14} className="animate-spin" />}
                        {loading ? "Assigning..." : "Assign Task"}
                    </button>
                </form>
            </div>
        </div>
    );
}
