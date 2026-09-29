"use client";

import { useState } from "react";
import { X, Sliders, Loader2 } from "lucide-react";

import { EmployeeActivity } from "../types";
import { updateEmployeeActivity } from "../api/activity.services";

interface Props {
    open: boolean;
    activity: EmployeeActivity;
    onClose: () => void;
    onUpdated: () => void;
}

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function EditEmployeeActivityModal({ open, activity, onClose, onUpdated }: Props) {
    const [title, setTitle] = useState(activity.title);
    const [description, setDescription] = useState(activity.description ?? "");
    const [priority, setPriority] = useState(activity.priority);
    const [dueDate, setDueDate] = useState(activity.dueDate?.split("T")[0] ?? "");
    const [estimatedMinutes, setEstimatedMinutes] = useState<number | "">(activity.estimatedMinutes ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            setLoading(true);
            setError(null);
            await updateEmployeeActivity(activity.id, {
                title,
                description,
                priority,
                dueDate: dueDate || undefined,
                estimatedMinutes: estimatedMinutes === "" ? undefined : estimatedMinutes,
            });
            onUpdated();
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to update activity.");
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
                        <h2 className="text-lg font-bold text-slate-800">Edit Activity</h2>
                        <span className="text-xs text-slate-400 ml-1">· {activity.task.title}</span>
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
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Est. Minutes</label>
                            <input
                                type="number"
                                min={0}
                                value={estimatedMinutes}
                                onChange={(e) => setEstimatedMinutes(e.target.value ? Number(e.target.value) : "")}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Due Date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                        />
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
