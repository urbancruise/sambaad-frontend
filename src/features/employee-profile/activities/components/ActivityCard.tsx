"use client";

import { useState } from "react";

import { useSelector } from "react-redux";

import { Pencil, Trash2 } from "lucide-react";

import { RootState } from "@/src/lib/store";

import { getActivityTiming } from "@/src/lib/activityTime";

import { EmployeeActivity } from "../types";

import EditEmployeeActivityModal from "./EditEmployeeActivityModal";

import { deleteEmployeeActivity } from "../api/activity.services";

interface Props {
    activity: EmployeeActivity;
    onChanged?: () => void;
}

const statusColor = {
    PENDING: "bg-slate-100 text-slate-600 border-slate-200",
    IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
    COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const priorityColor = {
    LOW: "bg-slate-100 text-slate-600",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700",
};

export default function ActivityCard({
    activity,
    onChanged,
}: Props) {
    const currentUserId = useSelector(
        (state: RootState) => state.auth.user?.id
    );

    const isCreator = activity.createdById === currentUserId;

    const [editOpen, setEditOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const { overdue, completedLate, time } =
        getActivityTiming(activity);

    const progress = Math.min(
        100,
        Math.max(0, Number(activity.progress ?? 0))
    );

    const handleDelete = async () => {
        if (!window.confirm("Delete this activity?")) return;

        try {
            setDeleting(true);

            await deleteEmployeeActivity(activity.id);

            onChanged?.();
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div
                className="
                    group
                    relative
                    flex
                    min-h-[180px]
                    w-full
                    flex-col
                    rounded-[12px]
                    border
                    border-slate-300
                    bg-gradient-to-br
                    from-white
                    via-slate-50
                    to-slate-100
                    px-3
                    py-3
                    shadow-[0_2px_8px_rgba(15,23,42,0.10)]
                    transition-all
                    duration-200
                    hover:-translate-y-[1px]
                    hover:shadow-[0_5px_15px_rgba(15,23,42,0.14)]
                "
            >
                {/* TOP SECTION */}
                <div className="flex items-start justify-between gap-2">
                    {/* Activity information */}
                    <div className="min-w-0 flex-1">
                        <h2
                            className="
                                truncate
                                text-[14px]
                                font-medium
                                leading-tight
                                text-slate-800
                            "
                            title={activity.title}
                        >
                            {activity.title}
                        </h2>

                        <p
                            className="
                                mt-1
                                truncate
                                text-[9px]
                                leading-tight
                                text-slate-600
                            "
                            title={activity.goal?.title}
                        >
                            Goal : {activity.goal?.title || "-"}
                        </p>

                        <p
                            className="
                                mt-[2px]
                                line-clamp-1
                                text-[9px]
                                leading-tight
                                text-slate-500
                            "
                            title={activity.task?.title}
                        >
                            Task : {activity.task?.title || "-"}
                        </p>

                        {/* <p
                            className="
                                mt-[2px]
                                line-clamp-1
                                text-[9px]
                                leading-tight
                                text-slate-500
                            "
                        >
                            Desc : {activity.description || "-"}
                        </p> */}
                    </div>

                    {/* BADGES + ACTIONS */}
                    <div className="flex shrink-0 items-center gap-1">
                        {/* Priority */}
                        <span
                            className={`
                                rounded-full
                                px-2
                                py-[3px]
                                text-[8px]
                                font-semibold
                                leading-none
                                ${priorityColor[
                                    activity.priority as keyof typeof priorityColor
                                ]}
                            `}
                        >
                            {activity.priority}
                        </span>

                        {/* Status */}
                        <span
                            className={`
                                rounded-full
                                border
                                px-2
                                py-[3px]
                                text-[8px]
                                font-medium
                                leading-none
                                ${statusColor[
                                    activity.status as keyof typeof statusColor
                                ]}
                            `}
                        >
                            {activity.status}
                        </span>

                        {/* Overdue */}
                        {overdue && (
                            <span
                                className="
                                    rounded-full
                                    bg-red-100
                                    px-2
                                    py-[3px]
                                    text-[8px]
                                    font-semibold
                                    leading-none
                                    text-red-700
                                "
                            >
                                Overdue
                            </span>
                        )}

                        {/* Completed late */}
                        {completedLate && (
                            <span
                                className="
                                    rounded-full
                                    bg-orange-100
                                    px-2
                                    py-[3px]
                                    text-[8px]
                                    font-semibold
                                    leading-none
                                    text-orange-700
                                "
                            >
                                Late
                            </span>
                        )}

                        {/* Edit */}
                        {isCreator && (
                            <button
                                type="button"
                                onClick={() => setEditOpen(true)}
                                title="Edit activity"
                                className="
                                    rounded-full
                                    border
                                    border-slate-200
                                    bg-white
                                    p-1
                                    text-slate-400
                                    transition
                                    hover:bg-blue-50
                                    hover:text-blue-600
                                "
                            >
                                <Pencil size={10} />
                            </button>
                        )}

                        {/* Delete */}
                        {isCreator && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                title="Delete activity"
                                className="
                                    rounded-full
                                    border
                                    border-slate-200
                                    bg-white
                                    p-1
                                    text-slate-400
                                    transition
                                    hover:bg-red-50
                                    hover:text-red-600
                                    disabled:opacity-40
                                "
                            >
                                <Trash2 size={10} />
                            </button>
                        )}
                    </div>
                </div>

                {/* PROGRESS */}
                <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-700">
                            Progress
                        </span>

                        <span className="text-[10px] font-medium text-slate-700">
                            {progress}%
                        </span>
                    </div>

                    <div className="h-[7px] w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                            className={`
                                h-full
                                rounded-full
                                transition-all
                                duration-500
                                ${
                                    activity.status === "COMPLETED"
                                        ? "bg-emerald-500"
                                        : activity.status ===
                                          "IN_PROGRESS"
                                        ? "bg-teal-500"
                                        : "bg-slate-400"
                                }
                            `}
                            style={{
                                width: `${progress}%`,
                            }}
                        />
                    </div>
                </div>

                {/* TIME INFORMATION */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                    {/* Estimated */}
                    <div>
                        <p className="text-[9px] font-medium text-slate-500">
                            Estimated
                        </p>

                        <p className="mt-0.5 text-[10px] font-medium text-slate-800">
                            {activity.estimatedMinutes ?? "-"} min
                        </p>
                    </div>

                    {/* Actual */}
                    <div>
                        <p className="text-[9px] font-medium text-slate-500">
                            Actual
                        </p>

                        <div className="flex items-center gap-1.5">
                            <p
                                className={`
                                    text-[10px]
                                    font-medium
                                    text-slate-800
                                    ${time?.text ?? ""}
                                `}
                            >
                                {activity.actualMinutes
                                    ? `${activity.actualMinutes} min`
                                    : "-"}
                            </p>

                            {time && (
                                <span
                                    className={`
                                        rounded-full
                                        px-1.5
                                        py-[2px]
                                        text-[7px]
                                        font-semibold
                                        leading-none
                                        ${time.badge}
                                    `}
                                >
                                    {time.label}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* OPTIONAL DATE / STATUS AREA */}
                <div className="mt-3 flex items-center justify-between">
                    <div>
                        <p className="text-[8px] text-slate-400">
                            Status
                        </p>

                        <p className="text-[9px] font-medium text-slate-700">
                            {activity.status}
                        </p>
                    </div>

                    {activity.dueDate && (
                        <div className="text-right">
                            <p className="text-[8px] text-slate-400">
                                Due
                            </p>

                            <p className="text-[9px] font-medium text-slate-700">
                                {new Date(
                                    activity.dueDate
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {isCreator && (
                <EditEmployeeActivityModal
                    open={editOpen}
                    activity={activity}
                    onClose={() => setEditOpen(false)}
                    onUpdated={() => onChanged?.()}
                />
            )}
        </>
    );
}