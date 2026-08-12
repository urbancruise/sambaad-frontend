"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { AppDispatch } from "@/src/lib/store";
import { Task } from "../types";
import { updateTaskStatus } from "../api/task.service";
import { updateTask as updateTaskState } from "../store/taskSlice";

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

interface Props {
    task: Task;
}

/**
 * STATUS UPDATE — assignee only. Renders a simple status dropdown
 * that hits PATCH /tasks/:id/status. Use this instead of EditTaskModal
 * for anyone who isn't the task's creator.
 */
export default function TaskStatusControl({ task }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);


    const handleChange = async (status: TaskStatus) => {
        try {
            setLoading(true);
            const updated = await updateTaskStatus(task.id, { status });
            dispatch(updateTaskState(updated));
        } catch (err) {
            console.error("Failed to update task status:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <select
                value={task.status}
                disabled={loading}
                onChange={(e) => handleChange(e.target.value as TaskStatus)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
            </select>
            {loading ? (
                <RefreshCw size={14} className="animate-spin text-slate-400" />
            ) : (
                task.status === "COMPLETED" && <CheckCircle2 size={14} className="text-emerald-500" />
            )}
        </div>
    );
}
