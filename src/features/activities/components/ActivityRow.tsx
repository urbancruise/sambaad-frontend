"use client";

import { useState } from "react";
import { CheckSquare, Square, Pencil, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";

import { AppDispatch } from "@/src/lib/store";
import { Activity } from "../types";
import {
    updateActivity as updateActivityAPI,
    deleteActivity as deleteActivityAPI,
} from "../api/activity.service";
import { updateActivity, deleteActivity } from "../store/activitySlice";
import EditActivityModal from "./EditActivityModal";

interface Props {
    activity: Activity;
}

export default function ActivityRow({ activity }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleComplete = async () => {
        try {
            const newStatus =
                activity.status === "COMPLETED" ? "PENDING" : "COMPLETED";

            const updated = await updateActivityAPI(activity.id, {
                status: newStatus,
            });

            dispatch(updateActivity(updated));
        } catch (error) {
            console.error("Failed to update activity status node:", error);
        }
    };

    const handleDelete = async () => {
        const ok = window.confirm("Acknowledge total deletion of activity node?");
        if (!ok) return;

        try {
            setLoading(true);
            await deleteActivityAPI(activity.id);
            dispatch(deleteActivity(activity.id));
        } catch (error) {
            console.error("Delete sequence termination failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const isCompleted = activity.status === "COMPLETED";

    return (
        <>
            <tr className="hover:bg-slate-400/20 dark:hover:bg-slate-800/60 transition-colors group select-none">
                {/* Task Name & Checkbox Cell */}
                <td className="py-2.5 px-4 max-w-[200px] sm:max-w-[280px]">
                    <button
                        onClick={handleComplete}
                        className="flex items-center gap-3 w-full text-left focus:outline-none"
                    >
                        {isCompleted ? (
                            <CheckSquare className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" size={18} />
                        ) : (
                            <Square className="text-slate-800 dark:text-slate-400 group-hover:text-black dark:group-hover:text-white flex-shrink-0 transition-colors" size={18} />
                        )}

                        <span
                            className={`text-s truncate font-medium transition-all ${
                                isCompleted
                                    ? "line-through text-slate-900 dark:text-slate-500"
                                    : "text-slate-900 dark:text-slate-900 group-hover:text-black dark:group-hover:text-white"
                            }`}
                        >
                            {activity.title}
                        </span>
                    </button>
                </td>

                {/* Actions Cell */}
                <td className="py-2.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                        <button
                            onClick={() => setOpen(true)}
                            className="rounded-md p-1.5 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 transition"
                            title="Edit activity"
                        >
                            <Pencil size={14} />
                        </button>

                        <button
                            disabled={loading}
                            onClick={handleDelete}
                            className="rounded-md p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition disabled:opacity-30"
                            title="Delete activity"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </td>
            </tr>

            <EditActivityModal
                open={open}
                activity={activity}
                onClose={() => setOpen(false)}
            />
        </>
    );
}