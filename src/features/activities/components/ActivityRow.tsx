"use client";

import { useState } from "react";
import { CheckSquare, Square, Pencil, Trash2, Play } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/src/lib/store";
import { getActivityTiming } from "@/src/lib/activityTime";
import { Activity } from "../types";
import {
    updateActivityStatus,
    deleteActivity as deleteActivityAPI,
} from "../api/activity.service";
import { updateActivity, deleteActivity } from "../store/activitySlice";
import EditActivityModal from "./EditActivityModal";

interface Props {
    activity: Activity;
}

export default function ActivityRow({ activity }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const currentUserId = useSelector((s: RootState) => s.auth.user?.id);
    const isAssignee = activity.assignedToId === currentUserId;

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState(false);

    const changeStatus = async (status: "PENDING" | "IN_PROGRESS" | "COMPLETED") => {
        try {
            setBusy(true);
            const updated = await updateActivityStatus(activity.id, { status });
            dispatch(updateActivity({ ...activity, ...updated }));
        } catch (error) {
            console.error("Failed to update activity status:", error);
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this activity?")) return;
        try {
            setLoading(true);
            await deleteActivityAPI(activity.id);
            dispatch(deleteActivity(activity.id));
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const isCompleted = activity.status === "COMPLETED";
    const { overdue, completedLate, time } = getActivityTiming(activity);

    return (
        <>
            <tr className="hover:bg-slate-400/20 transition-colors group select-none">
                {/* Title + checkbox */}
                <td className="py-2.5 px-4 max-w-[200px] sm:max-w-[280px]">
                    <button
                        disabled={busy}
                        onClick={() => changeStatus(isCompleted ? "PENDING" : "COMPLETED")}
                        className="flex items-center gap-3 w-full text-left focus:outline-none disabled:opacity-50"
                    >
                        {isCompleted ? (
                            <CheckSquare className="text-emerald-500 flex-shrink-0" size={18} />
                        ) : (
                            <Square className="text-slate-800 flex-shrink-0" size={18} />
                        )}
                        <span className={`truncate font-medium ${isCompleted ? "line-through text-slate-500" : "text-slate-900"}`}>
                            {activity.title}
                        </span>
                    </button>
                </td>

                {/* Estimated */}
                <td className="py-2.5 px-2 whitespace-nowrap text-slate-900 font-medium">
                    {activity.estimatedMinutes ?? "-"} min
                </td>

                {/* Actual + on time / delayed */}
                <td className="py-2.5 px-2 whitespace-nowrap">
                    {isCompleted ? (
                        <div className="flex items-center gap-2">
                            <span className={`font-semibold ${time?.text ?? ""}`}>
                                {activity.actualMinutes ? `${activity.actualMinutes} min` : "-"}
                            </span>
                            {time && (
                                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${time.badge}`}>
                                    {time.label}
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="text-slate-400">-</span>
                    )}
                </td>

                {/* Status tags + Start */}
                <td className="py-2.5 px-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        {activity.status === "IN_PROGRESS" && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                                In progress
                            </span>
                        )}
                        {overdue && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                                Overdue
                            </span>
                        )}
                        {completedLate && (
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
                                Completed late
                            </span>
                        )}
                        {isAssignee && activity.status === "PENDING" && (
                            <button
                                disabled={busy}
                                onClick={() => changeStatus("IN_PROGRESS")}
                                className="flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Play size={12} /> Start
                            </button>
                        )}
                    </div>
                </td>

                {/* Actions */}
                <td className="py-2.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setOpen(true)} className="rounded-md p-1.5 text-cyan-600 hover:bg-cyan-500/10" title="Edit activity">
                            <Pencil size={14} />
                        </button>
                        <button disabled={loading} onClick={handleDelete} className="rounded-md p-1.5 text-rose-600 hover:bg-rose-500/10 disabled:opacity-30" title="Delete activity">
                            <Trash2 size={14} />
                        </button>
                    </div>
                </td>
            </tr>

            <EditActivityModal open={open} activity={activity} onClose={() => setOpen(false)} />
        </>
    );
}